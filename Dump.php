<?php

/**
 * Debugging tool which displays information about any PHP variable, class or exception.
 * Inspired in Krumo by mrasnika (http://krumo.sourceforge.net/)
 * @author Javier Marín (https://github.com/javiermarinros)
 */
abstract class Dump {

    private static $_static_url = '/dump-static';
    private static $_special_paths = array();
    private static $_nesting_level = 10;
    private static $_recursion_objects;

    public static function config($static_url = '/dump-static', $special_paths = array(), $nesting_level = 10) {
        self::$_static_url = $static_url;
        self::$_special_paths = $special_paths;
        self::$_nesting_level = $nesting_level;
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
        if (count($data) == 1 && ($e = reset($data)) instanceof Exception) {
            self::$_recursion_objects = array();
            $inner = array(self::_render_exception($e, false));

            //Caller info
            $action = 'Thrown';
            $step['file'] = self::clean_path($e->getFile());
            $step['line'] = $e->getLine();
        } else {
            $inner = array();
            foreach ($data as $name => $value) {
                self::$_recursion_objects = array();

                $inner[] = self::_render(empty($name) || is_numeric($name) ? '...' : $name, $value);

                self::$_recursion_objects = null;
            }

            //Caller info
            if ($show_caller) {

                $action = 'Called';
                $trace = debug_backtrace();
                while ($step = array_pop($trace)) {
                    if ((strToLower($step['function']) == 'dump' || strToLower($step['function']) == 'dumpdie') || (isset($step['class']) && strToLower($step['class']) == 'dump')) {
                        break;
                    }
                }
                $step['file'] = self::clean_path($step['file']);
            }
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
                    '<ul class="dump-node dump-firstnode"><li>' . implode('</li><li>', $inner) . '</li></ul>',
                    isset($step) && $show_caller ? self::_html_element('div', array('class' => 'dump-footer'), "$action from {$step['file']}, line {$step['line']}") : ''
                ));
        return $html;
    }

    private static function _render($name, &$data, $level = 0, $metadata = null) {
        if ($data instanceof Exception) {
            $render = self::_render_exception($data);
        } elseif (is_object($data)) {
            $render = self::_render_vars(true, $name, $data, $level, $metadata);
        } elseif (is_array($data)) {
            $render = self::_render_vars(false, $name, $data, $level, $metadata);
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

    private static function _render_item($name, $type = '', $value = '', $metadata = '', $extra_info = '', $inner_html = null, $class = null) {
        if (!isset($class))
            $class = strtolower($type);

        $info = '';
        if (!empty($type)) {
            $info.= self::_html_element('span', array('class' => 'dump-item-type'), !empty($metadata) ? "$metadata, $type" : $type);
        }
        if (!empty($extra_info)) {
            if (!empty($info))
                $info.=', ';
            $info.= self::_html_element('span', array('class' => 'dump-item-info'), $extra_info);
        }

        $inner_html = empty($inner_html) ? '' : self::_html_element('div', array('class' => "dump-item-content $class", 'style' => 'display:none'), '<ul class="dump-node"><li>' . implode('</li><li>', (is_array($inner_html) ? $inner_html : array($inner_html))) . '</li></ul>');

        return self::_html_element('div', array('class' => "dump-item-header $class" . (empty($inner_html) ? '' : ' dump-item-collapsed')), array(
                    array('span', array('class' => 'dump-item-name'), htmlspecialchars($name)),
                    empty($info) ? '' : "($info)",
                    // !empty($value) ? array('span', array('class' => 'dump-item-value'), htmlspecialchars($value)) : '',
                    array('span', array('class' => 'dump-item-value'), htmlspecialchars($value)),
                )) . $inner_html;
    }

    private static function _render_exception(Exception &$e, $show_location = true) {
        $inner = array();
        $analized_trace = self::backtrace($e->getTrace());
        $path = self::clean_path($e->getFile());

        //Exception name
        $name = get_class($e);

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

        //Context and data
        if (method_exists($e, 'getContext')) {
            $context = $e->getContext();
            $inner[] = self::_render('Context', $context);
        }
        if (method_exists($e, 'getData')) {
            $data = $e->getData();
            $inner[] = self::_render('Data', $data);
        }

        //Backtrace
        $inner[] = self::_render_vars(false, 'Backtrace', $analized_trace);

        return self::_render_item($name, $show_location ? ($path . ':' . $e->getLine()) : '', strip_tags($message), '', '', $inner, 'exception');
    }

    private static function _render_vars($is_object, $name, &$data, $level = 0, $metadata = '') {
        //"Patch" to detect if the current array is a backtrace
        $is_backtrace = !$is_object && isset($data['function']) && is_string($data['function']) &&
                isset($data['file']) && is_string($data['file']);

        $recursive = $level > 4 && $is_object && in_array($data, self::$_recursion_objects);
        if ($level < self::$_nesting_level && !$recursive) {
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
                        $inner_html[] = self::_render($property->name, $value, $level + 1, implode(', ', $meta));
                        $properties_count++;
                    }
                } else {
                    $properties = get_object_vars($data);
                    foreach ($properties as $key => &$value) {
                        $inner_html[] = self::_render($key, $value, $level + 1);
                        $properties_count++;
                    }
                }
                self::$_recursion_objects[] = $data;
            } else {//Array
                foreach ($data as $key => &$value) {
                    if ($is_backtrace && $key == 'source' && is_string($value) && !empty($value)) {
                        $inner_html[] = self::_render_source_code($key, $value, $data['file'], $data['line']);
                    } else {
                        $inner_html[] = self::_render($key, $value, $level + 1);
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
                $info = count($data['args']) . ' parameters';
            } else {
                $type = 'Array';
                $info = count($data) . ' elements';
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
    public static function backtrace(array $trace = null) {
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
        foreach (self::$_special_paths as $clean_path => $source_path) {
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

        $source = array();
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

    /**
     * Echo information about the selected variable.
     * This function can be overwrited for autoload the DUMP class, e.g.:
     * @code
     * function dump() {
     *      if (!class_exists('Dump', false)) {
     *          require SYSTEM_PATH . '/third_party/Dump.php';
     *          Dump::config(...);
     *      }
     *      call_user_func_array(array('Dump', 'show'), func_get_args());
     * }
     * @endcode
     */
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
        dump(func_get_args());

        //Exit
        die(1);
    }

}