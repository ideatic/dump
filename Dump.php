<?php

/**
 * Debugging tool which displays information about any PHP variable, class or exception.
 * Inspired in Krumo by mrasnika (http://krumo.sourceforge.net/)
 * @author Javier Marín (https://github.com/javiermarinros)
 */
abstract class Dump {

    private static $_static_url = '/dump-static';
    private static $_special_paths = array();
    private static $_nesting_level = 5;
    private static $_recursion_objects;

    public static function config($static_url = '/dump-static', $special_paths = array(), $nesting_level = 5) {
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
        echo self::render_data($data, NULL, TRUE);
    }

    /**
     * Gets information about one or more PHP variables and return it in HTML code
     * @param mixed $var
     * @return string
     */
    public static function render() {
        $data = func_get_args();
        return self::render_data($data, NULL, TRUE);
    }

    /**
     * Gets information about one or more PHP variables and return it in HTML code.
     * @param mixed $name Name of the analyzed var, or dictionary with several vars and names
     * @param mixed $value
     * @param bool $show_caller
     * @return string
     */
    public static function render_data($name, $value = NULL, $show_caller = TRUE) {

        //Prepare data
        if (is_array($name)) {
            $data = $name;
        } else {
            $data = array($name => $value);
        }

        //Render data
        if (count($data) == 1 && ($e = reset($data)) instanceof Exception) {
            self::$_recursion_objects = array();
            $inner = array(self::_render_exception($e, FALSE));

            //Caller info
            $show_caller = TRUE;
            $action = 'Thrown';
            $step['file'] = self::clean_path($e->getFile());
            $step['line'] = $e->getLine();
        } else {
            $inner = array();
            foreach ($data as $name => $value) {
                self::$_recursion_objects = array();

                $inner[] = self::_render(empty($name) || is_numeric($name) ? '...' : $name, $value);

                self::$_recursion_objects = NULL;
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
        $html = self::_get_static_resources();


        $html .= self::_html_element('div', array('class' => 'dump-main dump-pending'), array(
                    '<ul class="dump-node dump-firstnode"><li>' . implode('</li><li>', $inner) . '</li></ul>',
                    isset($step) && $show_caller ? self::_html_element('div', array('class' => 'dump-footer'), "$action from {$step['file']}, line {$step['line']}") : ''
        ));
        return $html;
    }

    private static function _get_static_resources() {
        return self::_html_element('script', array('type' => 'text/javascript'), 'var dump_static_url="' . self::$_static_url . '";') .
                self::_html_element('script', array('type' => 'text/javascript'), 'window.jQuery || document.write(\'<script src="' . self::$_static_url . '/jquery.js' . '"><\/script>\')') .
                self::_html_element('script', array('type' => 'text/javascript', 'src' => self::$_static_url . '/dump.js'), '') .
                self::_html_element('style', array('type' => 'text/css'), ' @import url("' . self::$_static_url . '/dump.css");');
    }

    private static function _render($name, &$data, $level = 0, $metadata = NULL) {
        if ($data instanceof Exception) {
            $render = self::_render_exception($data, TRUE, $level);
        } elseif (is_object($data)) {
            $render = self::_render_vars(TRUE, $name, $data, $level, $metadata);
        } elseif (is_array($data)) {
            $render = self::_render_vars(FALSE, $name, $data, $level, $metadata);
        } elseif (is_resource($data)) {
            $render = self::_render_item($name, 'Resource', get_resource_type($data), $metadata);
        } elseif (is_string($data)) {
            if (preg_match('#^(\w+):\/\/([\w@][\w.:@]+)\/?[\w\.?=%&=\-@/$,]*$#', $data))//URL
                $html = self::_html_element('a', array('href' => $data, 'target' => '_blank'), htmlspecialchars($data));
            else if (preg_match('#^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$#', $data))//Email
                $html = self::_html_element('a', array('href' => "mailto:$data", 'target' => '_blank'), htmlspecialchars($data));
            else if (strpos($data, '<') !== FALSE || strlen($data) > 15) //Only expand if is a long text or HTML code
                $html = self::_html_element('div', array('class' => 'dump-string'), htmlspecialchars($data));
            $render = self::_render_item($name, 'String', $data, $metadata, strlen($data) . ' characters', isset($html) ? $html : '');
        } elseif (is_float($data)) {
            $render = self::_render_item($name, 'Float', $data, $metadata);
        } elseif (is_integer($data)) {
            $render = self::_render_item($name, 'Integer', $data, $metadata);
        } elseif (is_bool($data)) {
            $render = self::_render_item($name, 'Boolean', $data ? 'TRUE' : 'FALSE', $metadata);
        } elseif (is_null($data)) {
            $render = self::_render_item($name, 'NULL', NULL, $metadata);
        } else {
            $render = self::_render_item($name, '?', '<pre>' . print_r($data, TRUE) . '</pre>', $metadata);
        }

        return $render;
    }

    private static function _render_item($name, $type = '', $value = '', $metadata = '', $extra_info = '', $inner_html = NULL, $class = NULL) {
        if (!isset($class))
            $class = strtolower($type);

        $info = '';
        if (!empty($type)) {
            $info .= self::_html_element('span', array('class' => 'dump-item-type'), !empty($metadata) ? "$metadata, $type" : $type);
        }
        if (!empty($extra_info)) {
            if (!empty($info))
                $info .= ', ';
            $info .= self::_html_element('span', array('class' => 'dump-item-info'), $extra_info);
        }

        $inner_html = empty($inner_html) ? '' : self::_html_element('div', array('class' => "dump-item-content $class", 'style' => 'display:none'), '<ul class="dump-node"><li>' . implode('</li><li>', (is_array($inner_html) ? $inner_html : array($inner_html))) . '</li></ul>');

        return self::_html_element('div', array('class' => "dump-item-header $class" . (empty($inner_html) ? '' : ' dump-item-collapsed')), array(
                    array('span', array('class' => 'dump-item-name'), htmlspecialchars($name)),
                    empty($info) ? '' : "($info)",
                    // !empty($value) ? array('span', array('class' => 'dump-item-value'), htmlspecialchars($value)) : '',
                    array('span', array('class' => 'dump-item-value'), htmlspecialchars($value)),
                )) . $inner_html;
    }

    private static function _render_exception(Exception &$e, $show_location = TRUE, $level = 0) {
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
            $inner[] = self::_render('Context', $context, $level + 1);
        }
        if (method_exists($e, 'getData')) {
            $data = $e->getData();
            $inner[] = self::_render('Data', $data, $level + 1);
        }

        //Fields
        $inner[] = self::_render_vars(TRUE, 'Fields', $e, $level);

        //Backtrace
        $inner[] = self::_render_vars(FALSE, 'Backtrace', $analized_trace, $level);

        return self::_render_item($name, $show_location ? ($path . ':' . $e->getLine()) : '', strip_tags($message), '', '', $inner, 'exception');
    }

    private static function _render_vars($is_object, $name, &$data, $level = 0, $metadata = '') {
        //"Patch" to detect if the current array is a backtrace
        $is_backtrace = !$is_object && isset($data['function']) && is_string($data['function']) &&
                isset($data['file']) && is_string($data['file']);

        $recursive = $level > 4 && $is_object && in_array($data, self::$_recursion_objects, TRUE);
        if ($level < self::$_nesting_level && !$recursive) {
            //Render subitems
            $inner_html = array();
            if ($is_object) {
                $properties_count = 0;
                if (!($data instanceof stdClass) && class_exists('ReflectionClass', FALSE)) {
                    $current = new ReflectionClass($data);
                    $properties = array();
                    $private_data = NULL;
                    while ($current !== FALSE) {
                        foreach ($current->getProperties() as $property) {
                            /* @var $property ReflectionProperty */
                            if (in_array($property->name, $properties))
                                continue;

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
                            if ($property->isPublic()) {
                                $value = $property->getValue($data);
                            } elseif (method_exists($property, 'setAccessible')) {
                                $property->setAccessible(TRUE);
                                $value = $property->getValue($data);
                            } else {
                                if (!isset($private_data))
                                    $private_data = self::_get_private_data($data, NULL, array());
                                $value = array_key_exists($property->name, $private_data) ? $private_data[$property->name] : '?';
                            }
                            $inner_html[] = self::_render($property->name, $value, $level + 1, implode(', ', $meta));
                            $properties[] = $property->name;
                        }
                        $current = $current->getParentClass();
                        $properties_count = count($properties);
                    }
                } else {
                    $properties = get_object_vars($data);
                    foreach ($properties as $key => &$value) {
                        $inner_html[] = self::_render($key, $value, $level + 1);
                        $properties_count++;
                    }
                }
                self::$_recursion_objects[] = $data;
            } else { //Array
                foreach ($data as $key => &$value) {
                    if ($is_backtrace && $key == 'source' && is_string($value) && !empty($value)) {
                        $inner_html[] = self::_render_source_code($key, $value, $data['file'], $data['line']);
                    } else {
                        $inner_html[] = self::_render($key, $value, $level + 1);
                    }
                }
            }
        } else {
            $inner_html = '&infin;';
        }

        //Render item
        if ($is_object) {
            return self::_render_item($name, 'Object', get_class($data), $metadata, isset($properties_count) ? "$properties_count fields" : '', $inner_html);
        } else {
            if ($is_backtrace) {
                $type = $data['function'];
                $info = (isset($data['args']) ? count($data['args']) : 0) . ' parameters';
            } else {
                $type = 'Array';
                $info = count($data) . ' elements';
            }

            return self::_render_item($name, $type, '', $metadata, $info, $inner_html);
        }
    }

    private static function _get_private_data($object, $property = NULL, $default = FALSE) {
        //Try to get it using serialize()
        $class_name = get_class($object);
        $serialized = serialize($object);

        if (preg_match('/' . preg_quote($class_name) . '.\:(\d+)/', $serialized, $match)) {
            $prop_count = $match[1];
            $class_name_len = strlen($class_name);

            $serialized_array = str_replace("O:$class_name_len:\"$class_name\":$prop_count:", "a:$prop_count:", $serialized);

            if ($serialized != $serialized_array) {
                $raw_data = unserialize($serialized_array);

                if ($raw_data !== FALSE) {
                    $data = array();
                    foreach ($raw_data as $key => $value) {
                        $pos = strrpos($key, "\0");

                        if ($pos !== FALSE)//Remove special names given by php serializer ( "\0*\0" for protected fields, "\0$class_name\0" for private)
                            $key = substr($key, $pos + 1);

                        $data[$key] = $value;
                    }

                    return isset($property) ? (array_key_exists($property, $data) ? $data[$property] : $default) : $data;
                }
            }
        }

        if (isset($property)) {
            //Hack for access private properties: http://derickrethans.nl/private-properties-exposed.html
            $propname = "\0" . get_class($object) . "\0{$property}";
            $a = (array) $object;
            if (isset($a[$property]))
                return $a[$property];
        }

        return $default;
    }

    private static function _render_source_code($name, $value, $file = NULL, $line = NULL) {
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
    public static function backtrace(array $trace = NULL) {
        if ($trace === NULL) {
            $trace = debug_backtrace();
        }

        //"Special" functions
        $special_functions = array('include', 'include_once', 'require', 'require_once');

        $output = array();
        foreach ($trace as $i => $step) {
            //Get data from the current step
            foreach (array('class', 'type', 'function', 'file', 'line', 'args') as $param) {
                $$param = isset($step[$param]) ? $step[$param] : NULL;
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
                        $params = NULL;
                    } else if (class_exists('ReflectionMethod', FALSE)) {
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
     * Renders an abbreviated version of the backtrace
     * @param array $ call stack trace to be analyzed, if not use this parameter indicates the call stack before the function
     * @return string
     */
    public static function backtrace_small(array $trace = NULL) {
        if ($trace === NULL) {
            $trace = debug_backtrace();
        }

        $output = array();
        foreach ($trace as $i => $step) {

            //Get data from the current step
            foreach (array('class', 'type', 'function', 'file', 'line', 'args') as $param) {
                $$param = isset($step[$param]) ? $step[$param] : '';
            }

            //Generate HTML
            $output[] = self::_html_element('abbr', array('title' => "$file:$line"), $class . $type . $function);
        }

        return implode(' &rarr; ', array_reverse($output));
    }

    /**
     * Renders source code of an specified programming language
     * @param string $code
     * @param string $language
     * @return string
     */
    public static function source($code, $language = 'php', $theme = 'default') {
        $code = htmlspecialchars($code, ENT_NOQUOTES);
        return self::_get_static_resources() . '<pre class="dump-code dump-code-responsive" data-language="' . $language . '" data-theme="' . $theme . '">' . $code . '</pre>';
    }

    /**
     * Clean a path, replacing the special folders defined in the config. E.g.:
     *         /home/project/www/index.php -> APP_PATH/index.php
     * @param string $path
     * @param bool $restore True for restore a cleared path to its original state
     * @return string
     */
    public static function clean_path($path, $restore = FALSE) {
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
     * Read the source code from a file, centered in a line number, with a specific padding and apply a highlight it
     * @return string
     */
    private static function _get_source($file, $line_number, $padding = 10) {
        if (!$file || !is_readable($file)) { //Error de lectura
            return FALSE;
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

        return '<pre class="dump-code" data-language="php" data-from="' . $start . '" data-highlight="' . $line_number . '" data-theme="graynight">' . implode('', $source) . '</pre>';
    }

    private static function _html_element($tag_name, $attributes, $content = NULL) {
        //Check input data
        if (!isset($content)) {
            if (is_array($attributes)) {
                return '<' . $tag_name . self::_html_attributes($attributes) . ' />';
            } else {
                $content = $attributes;
                $attributes = NULL;
            }
        }

        //Prepare content
        if (is_array($content)) {
            $content_html = array();
            foreach ($content as $child_element) {
                if (is_array($child_element)) {
                    $content_html[] = self::_html_element($child_element[0], $child_element[1], count($child_element) > 2 ? $child_element[2] : NULL);
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

if (!function_exists('dump')
) :

    /**
     * Echo information about the selected variable.
     * This function can be overwrited for autoload the DUMP class, e.g.:
     * @code
     * function dump() {
     *      if (!class_exists('Dump', FALSE)) {
     *          require SYS_PATH . '/vendor/Dump.php';
     *          Dump::config(...);
     *      }
     *      call_user_func_array(array('Dump', 'show'), func_get_args());
     * }
     * @endcode
     */
    function dump() {
        call_user_func_array(array('Dump', 'show'), func_get_args());
    }

endif;

if (!function_exists('dumpdie')) :

    function dumpdie() {
        //Clean all output buffers
        while (ob_get_clean()) {
            ;
        }

        //Dump info
        call_user_func_array('dump', func_get_args());

        //Exit
        die(1);
    }































































































endif;