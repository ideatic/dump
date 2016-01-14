<?php

/**
 * @internal
 */
class DumpRender
{
    public $show_caller = true;
    public $html = true;

    private $_config;

    public function __construct()
    {
        $this->_config = Dump::config();
    }

    /**
     * Gets information about one or more PHP variables and return it in HTML code.
     *
     * @param mixed $name Name of the analyzed var, or dictionary with several vars and names
     * @param mixed $value
     *
     * @return string
     */
    public function render($name, $value = null)
    {
        //Prepare data
        if (is_array($name)) {
            $data = $name;
        } else {
            $data = array($name => $value);
        }

        $show_caller = $this->show_caller;
        //Render data
        if (count($data) == 1 && ($e = reset($data)) instanceof Exception) {
            $this->_recursion_objects = array();
            $inner = array($this->_render_exception($e, false));

            //Caller info
            $show_caller = true;
            $action = 'Thrown';
            $step['file'] = Dump::clean_path($e->getFile());
            $step['line'] = $e->getLine();
        } else {
            $inner = array();
            foreach ($data as $name => $value) {
                $this->_recursion_objects = array();

                $inner[] = $this->_render(empty($name) || is_numeric($name) ? ($this->html ? '...' : '') : $name, $value);

                $this->_recursion_objects = null;
            }

            //Caller info
            if ($show_caller) {
                $action = 'Called';
                $trace = debug_backtrace();
                while ($step = array_pop($trace)) {
                    if (stripos($step['function'], 'dump') === 0 ||
                        (isset($step['class']) && strToLower($step['class']) == 'dump')
                    ) {
                        break;
                    }
                }
                $step['file'] = Dump::clean_path($step['file']);
            }
        }

        $result = array();
        if ($this->html) {
            //Generate HTML
            $result[] = '<div class="dump">';

            //Loader
            $result[] = self::assets_loader('init_dump($(".dump"),{static_url:"' . $this->_config['static_url'] . '"})', $this->_config['static_url']);

            //Body
            $result[] = '<ul class="dump-node dump-firstnode"><li>';
            foreach ($inner as $item) {
                $result[] = $item;
            }
            $result[] = '</li></ul>';

            //Footer
            if (isset($step) && $show_caller) {
                $result[] = $this->html_element(
                    'div',
                    array('class' => 'dump-footer'),
                    "$action from {$step['file']}, line {$step['line']}"
                );
            }

            $result[] = '</div>';
        } else {
            //Body
            foreach ($inner as $item) {
                $result[] = $item;
            }

            //Footer
            if (isset($step) && $show_caller) {
                $result[] = "\n\n$action from {$step['file']}, line {$step['line']}";
            }
        }
        return implode('', $result);
    }

    private function _render($name, &$data, $level = 0, $metadata = null)
    {
        $memory_limit = $this->_return_bytes(ini_get('memory_limit'));
        if (memory_get_usage() > $memory_limit * 0.75) {
            $render = $this->_render_item($name, '&times;', 'Memory exhausted', $level, $metadata);
        } else {
            if ($data instanceof Exception) {
                $render = $this->_render_exception($data, true, $level);
            } elseif (is_object($data)) {
                if (method_exists($data, '__debugInfo')) {
                    $data = $data->__debugInfo();
                }

                $render = $this->_render_vars(true, $name, $data, $level, $metadata);
            } elseif (is_array($data)) {
                $render = $this->_render_vars(false, $name, $data, $level, $metadata);
            } elseif (is_resource($data)) {
                $render = $this->_render_item($name, 'Resource', get_resource_type($data), $level, $metadata);
            } elseif (is_string($data)) {
                if (preg_match('#^(\w+):\/\/([\w@][\w.:@]+)\/?[\w\.?=%&=\-@/$,]*$#', $data)) //URL
                {
                    $html = $this->html_element(
                        'a',
                        array('href' => $data, 'target' => '_blank'),
                        htmlspecialchars($data)
                    );
                } elseif (preg_match('#^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$#', $data)) {//Email
                    $html = $this->html_element(
                        'a',
                        array('href' => "mailto:$data", 'target' => '_blank'),
                        htmlspecialchars($data)
                    );
                } elseif ($this->html && (strpos($data, '<') !== false || strlen($data) > 15)) {//Only expand if is a long text or HTML code
                    $html = $this->html_element(
                        'div',
                        array('class' => 'dump-string'),
                        htmlspecialchars(str_replace(array('{', '}'), array('&#123;', '&#125;'), $data))//Proteger plantillas Angular y Twig
                    );
                }

                $render = $this->_render_item(
                    $name,
                    'String',
                    strlen($data) > 100 && $this->html ? substr($data, 0, 100) . '...' : $data,
                    $level,
                    $metadata,
                    strlen($data) . ' characters',
                    isset($html) ? $html : ''
                );
            } elseif (is_float($data)) {
                $render = $this->_render_item($name, 'Float', $data, $level, $metadata);
            } elseif (is_integer($data)) {
                $render = $this->_render_item($name, 'Integer', $data, $level, $metadata);
            } elseif (is_bool($data)) {
                $render = $this->_render_item($name, 'Boolean', $data ? 'TRUE' : 'FALSE', $level, $metadata);
            } elseif (is_null($data)) {
                $render = $this->_render_item($name, 'NULL', null, $level, $metadata);
            } else {
                $render = $this->_render_item($name, '?', '<pre>' . print_r($data, true) . '</pre>', $level, $metadata);
            }
        }

        return is_array($render) ? implode('', $render) : $render;
    }

    private function _render_item(
        $name,
        $type,
        $value,
        $level,
        $metadata = '',
        $extra_info = '',
        $inner_html = null,
        $class = null
    ) {
        $result = array();

        //Variable info
        $info = '';
        if (!empty($type)) {
            $info .= $this->html_element(
                'span',
                array('class' => 'dump-type'),
                !empty($metadata) ? "$metadata, $type" : $type
            );
        }
        if (!empty($extra_info)) {
            if (!empty($info)) {
                $info .= ', ';
            }
            $info .= $this->html_element('span', array('class' => 'dump-info'), $extra_info);
        }

        //Child data
        if (!empty($inner_html) && !is_array($inner_html)) {
            $inner_html = array($inner_html);
        }


        if ($this->html) {
            if (!isset($class)) {
                $class = strtolower($type);
            }

            $result[] = $this->html_element(
                'div',
                array('class' => array('dump-header', $class, empty($inner_html) ? '' : ' dump-collapsed')),
                array(
                    array('span', array('class' => 'dump-name'), htmlspecialchars($name)),
                    empty($info) ? '' : " ($info)",
                    ' ',
                    array('span', array('class' => 'dump-value'), htmlspecialchars($value)),
                )
            );

            if (!empty($inner_html)) {
                $result[] = "<div class=\"dump-content $class\"><ul class=\"dump-node\">";

                foreach ($inner_html as $item) {
                    $result[] = '<li>';
                    $result[] = $item;
                    $result[] = '</li>';
                }

                $result[] = "</ul></div>";
            }


        } else {
            $pad = str_pad('', $level * 4, ' ');

            if ($name !== '' || $value !== '') {
                $header = "$name => $value";
            } else {
                $header = '';
            }

            if (!empty($info)) {
                $header = trim($header) . " (" . html_entity_decode(strip_tags($info), ENT_QUOTES, 'UTF-8') . ")";
            }

            $result[] = $pad . trim($header) . "\n";

            if (!empty($inner_html)) {
                $result[] = $pad . '(' . "\n";

                foreach ($inner_html as $item) {
                    $result[] = str_pad('', ($level + 1) * 4, ' ') . trim(html_entity_decode(strip_tags($item), ENT_QUOTES, 'UTF-8')) . "\n";
                }

                $result[] = $pad . ')' . "\n";
            }
        }
        return implode('', $result);
    }

    private function _render_exception(Exception &$e, $show_location = true, $level = 0)
    {
        $inner = array();
        $path = Dump::clean_path($e->getFile());

        //Exception name
        $name = get_class($e);

        //Basic info about the exception
        $message = Dump::clean_path($e->getMessage());
        $inner[] = $this->html_element('div', array('class' => 'dump-exception'), htmlspecialchars($message));

        //Source code
        if ($this->html) {
            $backtrace = Dump::backtrace($e->getTrace());
            foreach ($backtrace as $step) {
                if ($step['file'] == $path && $step['line'] == $e->getLine()) {
                    $source = $step['source'];
                    break;
                }
            }
            if (!isset($source)) {
                $source = self::get_source($e->getFile(), $e->getLine());
            }
            if (!empty($source)) {
                $inner[] = $this->_render_source_code('Source', $source, $path, $e->getLine());
            }
        } else {
            $backtrace = Dump::backtrace_small($e->getTrace());
        }

        //Context and data
        if (method_exists($e, 'getContext')) {
            $context = $e->getContext();
            $inner[] = $this->_render('Context', $context, $level + 1);
        }
        if (method_exists($e, 'getData')) {
            $data = $e->getData();
            $inner[] = $this->_render('Data', $data, $level + 1);
        }

        //Backtrace (en modo texto)
        if (!is_array($backtrace)) {
            $inner[] = $this->_render_item('Backtrace', '', $backtrace, $level);
        }

        //Fields
        $inner[] = $this->_render_vars(true, 'Fields', $e, $level + 1);

        //Backtrace
        if (is_array($backtrace)) {
            $inner[] = $this->_render_vars(false, 'Backtrace', $backtrace, $level);
        }

        return $this->_render_item(
            $name,
            $show_location ? ($path . ':' . $e->getLine()) : '',
            strip_tags($message),
            $level,
            '',
            '',
            $inner,
            'exception'
        );
    }

    private function _render_vars($is_object, $name, &$data, $level = 0, $metadata = '')
    {
        //"Patch" to detect if the current array is a backtrace
        $is_backtrace = !$is_object && isset($data['function']) && is_string($data['function']) &&
                        isset($data['file']) && is_string($data['file']);

        $recursive = $level > 4 && $is_object && in_array($data, $this->_recursion_objects, true);
        if ($level < $this->_config['nesting_level'] && !$recursive) {
            //Render subitems
            $inner_html = array();
            if ($is_object) {
                $properties_count = 0;
                $properties = array();
                if (!($data instanceof stdClass) && class_exists('ReflectionClass', false)) {
                    $current = new ReflectionClass($data);
                    $private_data = null;
                    while ($current !== false) {
                        foreach ($current->getProperties() as $property) {
                            /* @var $property ReflectionProperty */
                            if (in_array($property->name, $properties)) {
                                continue;
                            }

                            //Get metadata
                            $meta = array();
                            if ($property->isStatic()) {
                                $meta[] = 'Static';
                            }
                            if ($property->isPrivate()) {
                                $meta[] = 'Private';
                            }
                            if ($property->isProtected()) {
                                $meta[] = 'Protected';
                            }
                            if ($property->isPublic()) {
                                $meta[] = 'Public';
                            }

                            //Build field
                            if ($property->isPublic()) {
                                $value = $property->getValue($data);
                            } else {
                                if (method_exists($property, 'setAccessible')) {
                                    $property->setAccessible(true);
                                    $value = $property->getValue($data);
                                } else {
                                    if (!isset($private_data)) { //Initialize object private data
                                        $private_data = $this->_get_private_data($data, array());
                                    }

                                    if (array_key_exists($property->name, $private_data)) {
                                        $value = $private_data[$property->name];
                                    } else {
                                        $value = '?';
                                    }
                                }
                            }
                            $inner_html[] = $this->_render($property->name, $value, $level + 1, implode(', ', $meta));
                            $properties[] = $property->name;
                        }
                        $current = $current->getParentClass();
                        $properties_count = count($properties);
                    }
                }

                //Find runtime properties
                foreach (get_object_vars($data) as $key => $value) {
                    if (in_array($key, $properties)) {
                        continue;
                    }

                    $inner_html[] = $this->_render($key, $value, $level + 1);
                    $properties_count++;
                }

                $this->_recursion_objects[] = $data;
            } else { //Array
                foreach ($data as $key => &$value) {
                    if ($is_backtrace && $key == 'source' && is_string($value) && !empty($value)) {
                        $inner_html[] = $this->_render_source_code($key, $value, $level, $data['file'], $data['line']);
                    } else {
                        if (!$is_backtrace || !in_array($key, array('function', 'file', 'line'))) {
                            $inner_html[] = $this->_render($key, $value, $level + 1);
                        }
                    }
                }
            }
        } else {
            $inner_html = '&infin;';
        }

        //Render item
        if ($is_object) {
            return $this->_render_item(
                $name,
                'Object',
                get_class($data),
                $level,
                $metadata,
                isset($properties_count) ? "$properties_count fields" : '',
                $inner_html
            );
        } else {
            if ($is_backtrace) {
                $type = $data['function'];
                $info = (isset($data['args']) ? count($data['args']) : 0) . ' parameters';
            } else {
                $type = 'Array';
                $info = count($data) . ' elements';
            }

            return $this->_render_item($name, $type, '', $level, $metadata, $info, $inner_html);
        }
    }

    private function _get_private_data($object, $default = false)
    {
        for ($method = 0; $method < 2; $method++) {
            try {
                $raw_data = false;
                if ($method == 0) {
                    //Based on a hack to access private properties: http://derickrethans.nl/private-properties-exposed.html
                    $raw_data = (array)$object;
                } else {
                    if ($method == 1) {
                        //Try to get it using serialize()
                        $class_name = get_class($object);
                        $serialized = serialize($object);

                        if (preg_match('/' . preg_quote($class_name) . '.\:(\d+)/', $serialized, $match)) {
                            $prop_count = $match[1];
                            $class_name_len = strlen($class_name);

                            $serialized_array = str_replace(
                                "O:$class_name_len:\"$class_name\":$prop_count:",
                                "a:$prop_count:",
                                $serialized
                            );

                            if ($serialized != $serialized_array) {
                                $raw_data = unserialize($serialized_array);
                            }
                        }
                    }
                }

                if ($raw_data !== false) {
                    $data = array();
                    foreach ($raw_data as $key => $value) {
                        $pos = strrpos($key, "\0");

                        if ($pos !== false
                        ) //Remove special names given by php ( "\0*\0" for protected fields, "\0$class_name\0" for private)
                        {
                            $key = substr($key, $pos + 1);
                        }

                        $data[$key] = $value;
                    }

                    if (!empty($data)) {
                        return $data;
                    }
                }
            } catch (Exception $err) {

            }
        }

        return $default;
    }

    /**
     * Convert PHP config size to bytes (11M -> 11*1024*1024)
     *
     * @param type $val
     *
     * @return int
     */
    private function _return_bytes($val)
    {
        $val = trim($val);
        $last = strtolower($val[strlen($val) - 1]);
        switch ($last) {
            // The 'G' modifier is available since PHP 5.1.0
            case 'g':
                $val *= 1024;
            case 'm':
                $val *= 1024;
            case 'k':
                $val *= 1024;
        }

        return $val;
    }

    private function _render_source_code($name, $value, $level, $file = null, $line = null)
    {
        $edit_link = '';
        return $this->_render_item(
            $name,
            '',
            "$file:$line",
            $level,
            '',
            '',
            $this->html_element('div', array('class' => 'dump-source'), $edit_link . $value)
        );
    }

    /* Helpers */

    /**
     * Read the source code from a file, centered in a line number, with a specific padding and applying a highlight
     * @internal
     * @return string
     */
    public static function get_source($file, $line_number, $padding = 10)
    {
        if (!$file || !is_readable($file)) { //Error de lectura
            return false;
        }

        // Open file
        $file = fopen($file, 'r');

        // Set padding
        $start = max(1, $line_number - $padding);
        $end = $line_number + $padding;

        $source = array();
        for ($line = 1; ($row = fgets($file)) !== false && $line < $end; $line++) {
            if ($line >= $start) {
                $source[] = trim($row) == '' ? "&nbsp;\n" : htmlspecialchars($row, ENT_NOQUOTES);
            }
        }

        // Close file
        fclose($file);

        return '<pre class="dump-code" data-language="php" data-from="' . $start . '" data-highlight="' . $line_number .
               '" data-theme="graynight">' . implode('', $source) . '</pre>';
    }


    public static function assets_loader($on_load, $static_url)
    {
        ob_start();
        ?>
        <script>
            window.jQuery || document.write('<script src="<?php echo $static_url ?>/jquery.js"><\/script>');</script>
        <script>
            var _dumpq = _dumpq || [];
            _dumpq.push(function () {
                <?php echo $on_load ?>;
            });
            (function ($, init) {
                var loadq = function () {
                    while ((i = _dumpq.shift()) !== undefined) {
                        i();
                    }
                    init = true;
                };

                if (!init) {
                    $.getScript("<?php echo $static_url ?>/dump.js", loadq);
                    $("head").append($("<link rel='stylesheet' type='text/css' href='<?php echo $static_url ?>/dump.css' />"));
                    init = 'loading';
                } else if (init !== 'loading') {
                    loadq();
                }
            })(window.jQuery, window.init_dump);
        </script>
        <noscript>
            <style>@import url("<?php echo $static_url ?>/dump.css");

                .dump-firstnode > li > .dump-content {
                    display: block;
                }</style>
        </noscript>
        <?php
        return ob_get_clean();
    }

    public static function html_attributes($attributes = '')
    {
        if (is_array($attributes)) {
            $atts = '';
            foreach ($attributes as $key => $val) {
                if ($key == 'class' && is_array($val)) {
                    $val = implode(' ', array_filter($val));
                } elseif ($key == 'style' && is_array($val)) {
                    $val = implode(';', array_filter($val));
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

    public static function html_element($tag_name, $attributes, $content = null)
    {
        //Check input data
        if (!isset($content)) {
            if (is_array($attributes)) {
                return '<' . $tag_name . self::html_attributes($attributes) . ' />';
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
                    $content_html[] = self::html_element(
                        $child_element[0],
                        $child_element[1],
                        count($child_element) > 2 ? $child_element[2] : null
                    );
                } else {
                    if (!empty($child_element)) {
                        $content_html[] = $child_element;
                    }
                }
            }
            $content = implode('', $content_html);
        }

        //Build element
        if (empty($attributes)) {
            return "<$tag_name>$content</$tag_name>";
        } else {
            return '<' . $tag_name . self::html_attributes($attributes) . ">$content</$tag_name>";
        }
    }
}