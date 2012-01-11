<?php

/**
 * Debugging tool which displays information about any PHP variable, class or exception.
 * Inspired in Krumo by mrasnika (http://krumo.sourceforge.net/)
 * @author Javier Marín (https://github.com/javiermarinros)
 */
abstract class Dump {

    private static $_recursion_objects;
    private static $_static_url;
    private static $_special_paths;

    public static function config($static_url = 'dump-static', $special_paths = array()) {
        self::$_static_url = $static_url;
        self::$_special_paths = $special_paths;
    }

    /**
     * Display information about one or more PHP variables
     * @param mixed $var 
     */
    public static function show() {
        $data = func_get_args();
        echo self::render_data($data, null, true);
    }

    /**
     * Gets information about one or more PHP variables and return it in HTML code
     * @param mixed $var 
     * @return string
     */
    public static function render() {
        $data = func_get_args();
        return self::render_data($data, null, true);
    }

    /**
     * Gets information about one or more PHP variables and return it in HTML code.
     * @param mixed $name Name of the analyzed var, or dictionary with several vars and names
     * @param mixed $value
     * @param bool $show_caller
     * @return string 
     */
    public static function render_data($name, $value = null, $show_caller = true) {
        static $static_send = false;

        //Prepare data
        if (is_array($name)) {
            $data = $name;
        } else {
            $data = array($name => $value);
        }

        //Render data
        $info = array();
        foreach ($data as $name => $value) {
            self::$_recursion_objects = array();

            $info[] = self::_render(empty($name) || is_numeric($name) ? '...' : $name, $value);

            //Clean recursion marks
            foreach (self::$_recursion_objects as $marker => $var) {
                if (is_array($var))
                    unset($var[$marker]);
            }
            self::$_recursion_objects = null;
        }

        //Get caller
        if ($show_caller) {
            $trace = debug_backtrace();
            while ($step = array_pop($trace)) {
                if ((strToLower($step['function']) == 'dump' || strToLower($step['function']) == 'dumpdie') || (isset($step['class']) && strToLower($step['class']) == 'dump')) {
                    break;
                }
            }
            $step['file'] = self::clean_path($step['file']);
            $action = reset($data) instanceof Exception ? 'Thrown' : 'Called';
        }

        //Generate HTML
        $html = '';
        if (!$static_send) {
            $html .= self::_html_element('script', array('type' => 'text/javascript'), 'var dump_static_url="' . self::$_static_url . '";') .
                    self::_html_element('script', array('type' => 'text/javascript', 'src' => self::$_static_url . '/jquery.js'), '') .
                    self::_html_element('script', array('type' => 'text/javascript', 'src' => self::$_static_url . '/dump.js'), '') .
                    self::_html_element('style', array('type' => 'text/css'), ' @import url("' . self::$_static_url . '/dump.css");');
        }

        $html.=self::_html_element('div', array('class' => 'dump-main'), array(
                    '<ul class="dump-node dump-firstnode"><li>' . implode('</li><li>', $info) . '</li></ul>',
                    isset($step) && $show_caller ? self::_html_element('div', array('class' => 'dump-footer'), "$action from {$step['file']}, line {$step['line']}") : ''
                ));
        return $html;
    }

    private static function _render($name, &$data, $metadata = null) {
        if ($data instanceof Exception) {
            $render = self::_render_exception($data);
        } elseif (is_object($data)) {
            $render = self::_render_vars(true, $name, $data, $metadata);
        } elseif (is_array($data)) {
            $render = self::_render_vars(false, $name, $data, $metadata);
        } elseif (is_resource($data)) {
            $render = self::_render_item($name, 'Resource', get_resource_type($data), $metadata);
        } elseif (is_string($data)) {
            if (strpos($data, '<') !== false || strlen($data) > 15)//Only expand if is a long text or HTML code
                $html = self::_html_element('div', array('class' => 'dump-string'), htmlspecialchars($data));
            $render = self::_render_item($name, 'String', $data, $metadata, strlen($data) . ' characters', isset($html) ? $html : '');
        } elseif (is_float($data)) {
            $render = self::_render_item($name, 'Float', $data, $metadata);
        } elseif (is_integer($data)) {
            $render = self::_render_item($name, 'Integer', $data, $metadata);
        } elseif (is_bool($data)) {
            $render = self::_render_item($name, 'Boolean', $data ? 'TRUE' : 'FALSE', $metadata);
        } elseif (is_null($data)) {
            $render = self::_render_item($name, 'NULL', null, $metadata);
        } else {
            $render = self::_render_item($name, '?', '<pre>' . print_r($data, true) . '</pre>', $metadata);
        }

        return $render;
    }

    private static function _render_item($name, $type = '', $value = '', $metadata = '', $extra_info = '', $inner_html = null) {
        $info = '';
        if (!empty($type)) {
            $info.= self::_html_element('span', array('class' => 'dump-item-type'), !empty($metadata) ? "$metadata, $type" : $type);
        }
        if (!empty($extra_info)) {
            if (!empty($info))
                $info.=', ';
            $info.= self::_html_element('span', array('class' => 'dump-item-info'), $extra_info);
        }

        $inner_html = empty($inner_html) ? '' : self::_html_element('div', array('class' => 'dump-item-content', 'style' => 'display:none'), '<ul class="dump-node"><li>' . implode('</li><li>', (is_array($inner_html) ? $inner_html : array($inner_html))) . '</li></ul>');
        return self::_html_element('div', array('class' => 'dump-item-header' . (empty($inner_html) ? '' : ' dump-item-collapsed')), array(
                    array('span', array('class' => 'dump-item-name'), $name),
                    empty($info) ? '' : "($info)",
                    !empty($value) ? array('span', array('class' => 'dump-item-value'), htmlspecialchars($value)) : '',
                )) . $inner_html;
    }

    private static function _render_exception(Exception &$e) {
        $inner = array();
        $analized_trace = self::analize_trace($e->getTrace());
        $path = self::clean_path($e->getFile());

        //Exception name
        $name = self::_html_element('img', array('src' => self::$_static_url . '/exception.png'));
        $name.=get_class($e);

        //Basic info about the exception
        $message = $e->getMessage();
        $inner[] = self::_html_element('div', array('class' => 'dump-exception'), $e->getMessage());

        //Source code
        foreach ($analized_trace as $step) {
            if ($step['file'] == $path && $step['line'] == $e->getLine()) {
                $source = $step['source'];
                break;
            }
        }
        if (!isset($source)) {
            $source = self::_get_source($e->getFile(), $e->getLine());
        }
        if (!empty($source)) {
            $inner[] = self::_render_source_code('Source', $source, $path, $e->getLine());
        }

        //Context
        if (method_exists($e, 'getContext')) {
            $context = $e->getContext();
            $inner[] = self::_render('Context', $context);
        }

        //Backtrace
        $inner[] = self::_render_vars(false, 'Backtrace', $analized_trace);

        return self::_render_item($name, $path . ':' . $e->getLine(), strip_tags($message), '', '', $inner);
    }

    private static function _render_vars($is_object, $name, &$data, $metadata = '') {
        //Avoid infinite recursion
        //Compare objects with === (harmless)
        //Recursive arrays can't be compared with ===, they throw the error Nesting level too deep - recursive dependency?, use a mark
        $is_recursive = false;
        foreach (self::$_recursion_objects as $key => $object) {
            if (($is_object && $object === $data) || (!$is_object && isset($data[$key]))) {
                $is_recursive = true;
                break;
            }
        }

        //"Patch" to detect if the current array is a backtrace
        $is_backtrace = !$is_object && isset($data['function']) && is_string($data['function']) &&
                isset($data['file']) && is_string($data['file']);

        if (!$is_recursive) {
            //Mark the item for next iterations
            do {
                $marker = uniqid('dump');
            } while (isset(self::$_recursion_objects[$marker]) || (!$is_object && isset($data[$marker])));
            if (!$is_object) {
                $data[$marker] = 1;
            }
            self::$_recursion_objects[$marker] = $data;

            //Render subitems
            $inner_html = array();
            if ($is_object) {
                $properties_count = 0;
                if (class_exists('ReflectionClass', false)) {
                    $reflection = new ReflectionClass($data);
                    foreach ($reflection->getProperties() as $property) {
                        /* @var $property ReflectionProperty */

                        //Get metadata
                        $meta = array();
                        if ($property->isStatic())
                            $meta[] = 'Static';
                        if ($property->isPrivate())
                            $meta[] = 'Private';
                        if ($property->isProtected())
                            $meta[] = 'Protected';
                        if ($property->isPublic())
                            $meta[] = 'Public';

                        //Build field
                        $property->setAccessible(true);
                        $value = $property->getValue($data);
                        $inner_html[] = self::_render($property->name, $value, implode(', ', $meta));
                        $properties_count++;
                    }
                } else {
                    $properties = get_object_vars($data);
                    foreach ($properties as $key => &$value) {
                        $inner_html[] = self::_render($key, $value);
                        $properties_count++;
                    }
                }
            } else {//Array
                foreach ($data as $key => &$value) {
                    if ($key !== $marker) {
                        if ($is_backtrace && $key == 'source' && is_string($value) && !empty($value)) {
                            $inner_html[] = self::_render_source_code($key, $value, $data['file'], $data['line']);
                        } else {
                            $inner_html[] = self::_render($key, $value);
                        }
                    }
                }
            }
        } else {
            $inner_html = '&#8734;';
        }

        //Render item
        if ($is_object) {
            return self::_render_item($name, 'Object', get_class($data), $metadata, isset($properties_count) ? "$properties_count fields" : '', $inner_html);
        } else {
            if ($is_backtrace) {
                $type = $data['function'];
                $info = (count($data['args']) - 1) . ' parameters';
            } else {
                $type = 'Array';
                $info = (count($data) - 1) . ' elements';
            }

            return self::_render_item($name, $type, '', $metadata, $info, $inner_html);
        }
    }

    private static function _render_source_code($name, $value, $file = null, $line = null) {
        $edit_link = '';
        return self::_render_item($name, '', '', '', '', self::_html_element('div', array('class' => 'dump-source'), $edit_link . $value));
    }

    /**
     * Analyzes the backtrace generated by debug_backtrace function(),
     * adding contextual information.
     * The result is returned in an array with the keys:
     * 'function': function name
     * 'args': arguments name and value
     * 'file': file where the call occurs
     * 'line': line of the file where the call occurs
     * 'source': source code where the call comes (in HTML format)
     * @param array $ call stack trace to be analyzed, if not use this parameter indicates the call stack before the function
     * @return array
     */
    public static function analize_trace(array $trace = null) {
        if ($trace === null) {
            $trace = debug_backtrace();
        }

        //"Special" functions
        $special_functions = array('include', 'include_once', 'require', 'require_once');

        $output = array();
        foreach ($trace as $i => $step) {
            //Get data from the current step
            foreach (array('class', 'type', 'function', 'file', 'line', 'args') as $param) {
                $$param = isset($step[$param]) ? $step[$param] : null;
            }

            //Source code of the call to this step
            if (!empty($file) && !empty($line)) {
                $source = self::_get_source($step['file'], $step['line']);
            } else {
                $source = '';
            }

            //Arguments
            $function_call = $class . $type . $function;
            $function_args = array();
            if (isset($args)) {
                if (in_array($function, $special_functions)) {
                    $function_args = array(self::clean_path($args[0]));
                } else {
                    if (!function_exists($function) || strpos($function, '{closure}') !== FALSE) {
                        $params = null;
                    } else if (class_exists('ReflectionMethod', false)) {
                        if (isset($class)) {
                            $reflection = new ReflectionMethod($class, method_exists($class, $function) ? $function : '__call');
                        } else {
                            $reflection = new ReflectionFunction($function);
                        }
                        $params = $reflection->getParameters();
                    }

                    foreach ($args as $i => $arg) {
                        if (isset($params[$i])) {
                            // Assign the argument by the parameter name
                            $function_args[$params[$i]->name] = $arg;
                        } else {
                            // Assign the argument by number
                            $function_args[$i] = $arg;
                        }
                    }
                }
            }

            $output[] = array(
                'function' => $function_call,
                'args' => $function_args,
                'file' => self::clean_path($file),
                'line' => $line,
                'source' => $source,
            );
        }
        return $output;
    }

    /**
     * Clean a path, replacing the special folders defined in the config. E.g.:
     *         /home/project/www/index.php -> APP_PATH/index.php
     * @param string $path
     * @param bool $restore True for restore a cleared path to its original state
     * @return string
     */
    public static function clean_path($path, $restore = false) {
        foreach (self::$_special_paths as $source_path => $clean_path) {
            if ($restore) {
                if (strpos($path, $clean_path) === 0) {
                    $path = $source_path . substr($path, strlen($clean_path));
                    break;
                }
            } else {
                if (strpos($path, $source_path) === 0) {
                    $path = $clean_path . substr($path, strlen($source_path));
                    break;
                }
            }
        }

        return str_replace(array('\\', '/'), DIRECTORY_SEPARATOR, $path);
    }

    /**
     * Read the source code from a file, centered in a line number and with a specific padding
     * @return string
     */
    private static function _get_source($file, $line_number, $padding = 10) {
        if (!$file || !is_readable($file)) {//Error de lectura
            return false;
        }

        // Open file
        $file = fopen($file, 'r');

        // Set padding
        $start = max(1, $line_number - $padding);
        $end = $line_number + $padding;

        for ($line = 1; ($row = fgets($file)) !== FALSE && $line < $end; $line++) {
            if ($line >= $start) {
                $source[] = trim($row) == '' ? "&nbsp;\n" : htmlspecialchars($row, ENT_NOQUOTES);
            }
        }

        // Close file
        fclose($file);

        return '<pre class="php-code" from="' . $start . '" highlight="' . $line_number . '">' . implode('', $source) . '</pre>';
    }

    private static function _html_element($tag_name, $attributes, $content = null) {
        //Check input data
        if (!isset($content)) {
            if (is_array($attributes)) {
                return '<' . $tag_name . self::_html_attributes($attributes) . ' />';
            } else {
                $content = $attributes;
                $attributes = null;
            }
        }

        //Prepare content
        if (is_array($content)) {
            $content_html = array();
            foreach ($content as $child_element) {
                if (is_array($child_element)) {
                    $content_html[] = self::_html_element($child_element[0], $child_element[1], count($child_element) > 2 ? $child_element[2] : null);
                } else if (!empty($child_element)) {
                    $content_html[] = $child_element;
                }
            }
            $content = implode('', $content_html);
        }

        //Build element
        if (empty($attributes)) {
            return "<$tag_name>$content</$tag_name>";
        } else {
            return '<' . $tag_name . self::_html_attributes($attributes) . ">$content</$tag_name>";
        }
    }

    private static function _html_attributes($attributes = '') {
        if (is_array($attributes)) {
            $atts = '';
            foreach ($attributes as $key => $val) {
                if ($key == 'class' && is_array($val)) {
                    $val = implode(' ', $val);
                } elseif ($key == 'style' && is_array($val)) {
                    $val = implode(';', $val);
                } elseif (is_bool($val)) {
                    // XHTML compatibility
                    if ($val) {
                        $val = $key;
                    } else {
                        continue;
                    }
                }

                $atts .= " $key=\"$val\"";
            }
            return $atts;
        }
        return $attributes;
    }

}

//Define shortcuts

if (!function_exists('dump')) {

    function dump() {
        call_user_func_array(array('Dump', 'show'), func_get_args());
    }

}

if (!function_exists('dumpdie')) {

    function dumpdie() {
        //Clean all output buffers
        while (ob_get_clean()) {
            ;
        }

        //Dump info
        call_user_func_array(array('Dump', 'show'), func_get_args());

        //Exit
        die(1);
    }

}