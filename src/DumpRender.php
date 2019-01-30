<?php

/**
 * @internal
 */
class DumpRender
{
    public $show_caller = true;
    public $show_types = true;
    public $format = 'html';

    public $count_elements = true;

    /**
     * Max nesting level to render
     * @var int
     */
    public $nesting_level;

    /**
     * URL to Dump assets
     * @var string
     */
    public $assets_url;

    private $_recursion_objects;

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
        // Prepare data
        if (is_array($name)) {
            $data = $name;
        } else {
            $data = [$name => $value];
        }

        $show_caller = $this->show_caller;
        // Render data
        if (count($data) == 1 && ($e = reset($data)) instanceof Exception) {
            $this->_recursion_objects = [];
            $inner = [$this->_render_exception('', $e)];

            // Caller info
            $show_caller = true;
            $action = 'Thrown';
            $step['file'] = Dump::clean_path($e->getFile());
            $step['line'] = $e->getLine();
        } else {
            $inner = [];
            foreach ($data as $name => $value) {
                $this->_recursion_objects = [];

                $inner[] = $this->_render(empty($name) || is_numeric($name) ? ($this->format == 'html' ? '...' : '') : $name, $value);

                $this->_recursion_objects = null;
            }

            // Caller info
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

        $result = [];
        if ($this->format == 'html') {
            // Generate HTML
            $result[] = '<div class="dump">';

            // Loader
            $result[] = self::assets_loader('init_dump($(".dump"),{static_url:"' . $this->assets_url . '"})', $this->assets_url);

            // Body
            $result[] = '<ul class="dump-node dump-firstnode"><li>';
            foreach ($inner as $item) {
                $result[] = $item;
            }
            $result[] = '</li></ul>';

            // Footer
            if (isset($step) && $show_caller) {
                $result[] = $this->html_element('div', ['class' => 'dump-footer'], "{$action} from {$step['file']}, line {$step['line']}");
            }

            $result[] = '</div>';
        } else {
            // Body
            $result = $inner;

            // Footer
            if (isset($step) && $show_caller) {
                $result[] = "\n{$action} from {$step['file']}, line {$step['line']}";
            }
        }
        return implode('', $result);
    }

    private function _render($name, &$data, $level = 0, $metadata = null)
    {
        $memory_limit = $this->_return_bytes(ini_get('memory_limit'));
        if (memory_get_usage() > $memory_limit * 0.75) {
            $render = $this->_render_item($name, '&times;', 'Memory exhausted', $level, $metadata);
        } elseif ($data instanceof Exception) {
            $render = $this->_render_exception($name, $data, $level);
        } elseif (is_object($data)) {
            $render = $this->_render_object($name, $data, $level, $metadata);
        } elseif (is_array($data)) {
            $render = $this->_render_array($name, $data, $level, $metadata);
        } elseif (is_resource($data)) {
            $render = $this->_render_item($name, 'Resource', get_resource_type($data), $level, $metadata);
        } elseif (is_string($data)) {
            $html = '';
            if ($this->format == 'html') {
                if (preg_match('#^(\w+):\/\/([\w@][\w.:@]+)\/?[\w\.?=%&=\-@/$,]*$#', $data)) // URL
                {
                    $html = $this->html_element(
                        'a',
                        ['href' => $data, 'target' => '_blank'],
                        htmlspecialchars($data)
                    );
                } elseif (preg_match('#^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$#', $data)) {// Email
                    $html = $this->html_element(
                        'a',
                        ['href' => "mailto:$data", 'target' => '_blank'],
                        htmlspecialchars($data)
                    );
                } elseif (strpos($data, '<') !== false || strlen($data) > 15) {// Only expand if is a long text or HTML code
                    $html = $this->html_element(
                        'div',
                        ['class' => 'dump-string'],
                        htmlspecialchars(str_replace(['{', '}'], ['&#123;', '&#125;'], $data))// Proteger plantillas Angular y Twig
                    );
                }
            }

            $render = $this->_render_item(
                $name,
                'String',
                strlen($data) > 100 && $this->format == 'html' ? substr($data, 0, 100) . '...' : $data,
                $level,
                $metadata,
                strlen($data) . ' characters',
                $html
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

        return $render;
    }

    private function _render_item($name, $type, $value, $level, $metadata = '', $extra_info = '', $children = null, $class = null)
    {
        // Variable info
        $info = '';
        if (!empty($type)) {
            $content = !empty($metadata) ? "{$metadata}, {$type}" : $type;
            if ($this->format == 'html') {
                $info .= $this->html_element('span', ['class' => 'dump-type'], $content);
            } else {
                $info .= $content;
            }
        }
        if (!empty($extra_info)) {
            if (!empty($info)) {
                $info .= ', ';
            }
            $info .= $this->format == 'html' ? $this->html_element('span', ['class' => 'dump-info'], $extra_info) : $extra_info;
        }

        // Child data
        if (!empty($children) && !is_array($children)) {
            $children = [$children];
        }

        $result = [];
        if ($this->format == 'html') {
            if (!isset($class)) {
                $class = strtolower($type);
            }

            $result[] = $this->html_element(
                'div',
                ['class' => ['dump-header', $class, empty($children) ? '' : ' dump-collapsed']],
                [
                    ['span', ['class' => 'dump-name'], htmlspecialchars($name)],
                    empty($info) ? '' : " ({$info})",
                    ' ',
                    ['span', ['class' => 'dump-value'], htmlspecialchars($value)],
                ]
            );

            if (!empty($children)) {
                $result[] = "<div class=\"dump-content $class\"><ul class=\"dump-node\">";

                foreach ($children as $item) {
                    $result[] = '<li>';
                    $result[] = $item;
                    $result[] = '</li>';
                }

                $result[] = "</ul></div>";
            }
        } else {
            if ($name !== '') {
                if ($this->format == 'json') {
                    $result[] = "{$name}: ";
                } else {
                    $result[] = "[{$name}] => ";
                }
            }

            // Value
            $type_info = !empty($info) && $this->show_types ? $info: '';
            if ($this->format == 'json') {
                if ($type == 'String') {
                    $result[] = "\"{$value}\"";
                    $type_info = false;
                } elseif ($type == 'NULL') {
                    $result[] = 'NULL';
                    $type_info = false;
                } elseif ($type == 'Integer' || $type == 'Boolean' || $type == 'Float') {
                    $result[] = $value;

                    if (!($type == 'Float' && ctype_digit("{$value}"))) {// Si es float pero sin decimales, mostrar el tipo
                        $type_info = false;
                    }
                } elseif ($type == 'Object') {
                    $type_info =  preg_replace('/^Object\,?\s*/i', $value . ', ', $type_info);
                } elseif ($type == 'Array') {
                    $type_info = preg_replace('/^Array\,?\s*/i', '', $type_info);// Ya se diferencian arrays de objetos
                } else {
                    $result[] = $value . ' ';
                }
            } else {
                $result[] = $value;
            }

            /* $header_offset = strlen($header);// Pad value line breaks
             $header .= str_replace("\n", "\n" . str_pad('', ($level * 4) + $header_offset, ' '), $value);;*/

            // Value info
            if ($type_info && $this->format != 'json') {
                $result[] = " ({$type_info})";
            }

            if ($this->format != 'json') {
                $result[] = "\n";
            }

            if (!empty($children)) {
                $opener = $type == 'Array' ? '[' : '{';

                if ($this->format == 'json') {
                    $result[] = $opener;
                    if ($type_info) {
                        $result[] = " // {$type_info}";
                    }
                } else {
                    $result[] = $opener;
                }

                $result[] = "\n";


                $pad = "\t";// $pad = '    ';
                foreach ($children as $k => $item) {
                    $children[$k] = $pad . str_replace("\n", "\n{$pad}", trim($item));
                }
                $result[] = implode($this->format == 'json' ? ",\n" : "\n", $children);

                $result[] = "\n" . ($type == 'Array' ? ']' : '}') . "\n";
            } elseif ($this->format == 'json') {
                if ($type == 'Array') {
                    $result[] = "[]\n";
                } elseif ($type == 'Object') {
                    $result[] = "{} // {$type_info}\n";
                } elseif ($type_info) {
                    $result[] = " // {$type_info}";
                }
            }
        }

        return implode('', $result);
    }

    private function _render_exception($name, Exception $e, $level = 0)
    {
        $children = [];

        // Basic info about the exception
        $path = Dump::clean_path($e->getFile());
        $message = Dump::clean_path($e->getMessage());

        if ($this->format == 'html') {
            $children[] = $this->html_element('div', ['class' => 'dump-exception'], htmlspecialchars($message));
        }

        // Source code
        if ($this->format == 'html') {
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
                $children[] = $this->_render_source_code('Source', $source, $path, $e->getLine());
            }
        } else {
            $children[] = $this->_render_item('Location', '', $path . ':' . $e->getLine(), $level + 1);

            $backtrace = Dump::backtrace_small($e->getTrace(), false);
        }

        // Context and data
        if (method_exists($e, 'getContext')) {
            $context = $e->getContext();
            $children[] = $this->_render('Context', $context, $level + 1);
        }
        if (method_exists($e, 'getData')) {
            $data = $e->getData();
            $children[] = $this->_render('Data', $data, $level + 1);
        }
        if (method_exists($e, 'getPrevious')) {
            $data = $e->getPrevious();
            $children[] = $this->_render('Previous', $data, $level + 1);
        }
        if (method_exists($e, 'getUserMessage')) {
            $data = $e->getUserMessage();
            $children[] = $this->_render('UserMessage', $data, $level + 1);
        }

        // Backtrace (en modo texto)
        if (!is_array($backtrace)) {
            $children[] = $this->_render_item('Backtrace', '', $backtrace, $level + 1);
        }

        // Fields
        // $children[] = $this->_render_object('Fields', $e, $level + 1, '', ['message', 'trace']);

        // Backtrace
        if (is_array($backtrace)) {
            $backtrace_children = [];

            foreach ($backtrace as $step_index => $step) {
                $step_children = [];
                foreach ($step as $k => $v) {
                    if ($k == 'source' && is_string($v) && !empty($v)) {
                        $step_children[] = $this->_render_source_code($k, $v, $level + 1, $step['file'], $step['line']);
                    } elseif (!in_array($k, ['function', 'file', 'line'])) {
                        $step_children[] = $this->_render($k, $v, $level + 1);
                    }
                }


                $info = (isset($step['args']) ? count($step['args']) : 0) . ' parameters';
                $backtrace_children[] = $this->_render_item($step_index, $step['function'], '', $level, '', $info, $step_children);
            }

            $children[] = $this->_render_item('Backtrace', count($backtrace) . ' steps', '', $level, '', '', $backtrace_children);
        }

        if ($level == 0) {
            return $this->_render_item(get_class($e), '', strip_tags($message), $level, '', '', $children, 'exception');
        } else {
            return $this->_render_item($name, get_class($e), strip_tags($message), $level, '', '', $children, 'exception');
        }
    }

    private function _render_array($name, $data, $level = 0, $metadata = '', $ignored_keys = [])
    {
        if ($level < $this->nesting_level || empty($data)) {// Render items
            $children = [];

            $ignore_keys = false;
            $all_scalar = false;
            if ($this->format == 'json') {// Ignore keys in normal zero-based indexed arrays
                $i = 0;
                $ignore_keys = true;
                $all_scalar = true;
                foreach ($data as $key => $value) {
                    if ($i !== $key) {
                        $ignore_keys = false;
                        break;
                    }
                    if (!is_scalar($value)) {
                        $all_scalar = false;
                    }
                    $i++;
                }
            }

            foreach ($data as $key => &$value) {
                if (in_array($key, $ignored_keys)) {
                    continue;
                }

                $children[] = $this->_render($ignore_keys ? '' : $key, $value, $level + 1);
            }

            if ($this->format == 'json' && $ignore_keys && $all_scalar) {
                $total_length = 0;
                foreach ($children as $child) {
                    $total_length += strlen($child);
                }

                if ($total_length < 450) {
                    return "{$name}: [" . str_replace(["\n", "\t"], '', implode(', ', $children)) . ']';
                }
            }
        } else {
            $children = '∞';
        }

        // Render item
        return $this->_render_item($name, 'Array', '', $level, $metadata, $this->count_elements ? (count($data) . ' items') : '', $children);
    }

    private function _render_object($name, $data, $level = 0, $metadata = '', $ignored_properties = [])
    {
        $recursive = $level > 4 && in_array($data, $this->_recursion_objects, true);

        $properties_count = 0;
        if ($level < $this->nesting_level && !$recursive) {
            // Render object fields
            $children = [];

            if (method_exists($data, '__debugInfo')) {
                $properties = $data->__debugInfo();

                if (!is_array($properties)) {
                    $properties = ['' => $properties];
                }
            } else {
                if (!($data instanceof stdClass) && class_exists('ReflectionClass', false)) {
                    $current = new ReflectionClass($data);
                    $private_data = null;
                    while ($current !== false) {
                        foreach ($current->getProperties() as $property) {
                            /* @var $property ReflectionProperty */
                            if (in_array($property->name, $ignored_properties)) {
                                continue;
                            }

                            // Get metadata
                            $meta = [];
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

                            // Build field
                            try {
                                if ($property->isPublic()) {
                                    $value = $property->getValue($data);
                                } else {
                                    if (method_exists($property, 'setAccessible')) {
                                        $property->setAccessible(true);
                                        $value = $property->getValue($data);
                                    } else {
                                        if (!isset($private_data)) { // Initialize object private data
                                            $private_data = $this->_get_private_data($data, []);
                                        }

                                        if (array_key_exists($property->name, $private_data)) {
                                            $value = $private_data[$property->name];
                                        } else {
                                            $value = '?';
                                        }
                                    }
                                }
                            } catch (Exception $err) {
                                $value = '##ERROR##';
                            }

                            $children[] = $this->_render($property->name, $value, $level + 1, implode(', ', $meta));
                            $ignored_properties[] = $property->name;
                        }
                        $current = $current->getParentClass();
                        $properties_count = count($ignored_properties);
                    }
                }

                // Find runtime properties
                $properties = get_object_vars($data);
            }

            // Add properties as child of the current node
            foreach ($properties as $key => $value) {
                if (in_array($key, $ignored_properties)) {
                    continue;
                }

                $children[] = $this->_render($key, $value, $level + 1);
                $properties_count++;
            }

            $this->_recursion_objects[] = $data;
        } else {
            $children = '∞';
        }

        // Render item
        return $this->_render_item($name, 'Object', get_class($data), $level, $metadata, "{$properties_count} fields", $children);
    }

    private function _get_private_data($object, $default = false)
    {
        for ($method = 0; $method < 2; $method++) {
            try {
                $raw_data = false;
                if ($method == 0) {
                    // Based on a hack to access private properties: http://derickrethans.nl/private-properties-exposed.html
                    $raw_data = (array)$object;
                } else {
                    if ($method == 1) {
                        // Try to get it using serialize()
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
                    $data = [];
                    foreach ($raw_data as $key => $value) {
                        $pos = strrpos($key, "\0");

                        if ($pos !== false
                        ) // Remove special names given by php ( "\0*\0" for protected fields, "\0$class_name\0" for private)
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
     * @param string $val
     *
     * @return int
     */
    private function _return_bytes($val)
    {
        $val = trim($val);
        $last = strtolower($val[strlen($val) - 1]);

        if (is_numeric($last)) {
            return $val;
        }

        $val = substr($val, 0, -1);
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
            $this->html_element('div', ['class' => 'dump-source'], $edit_link . $value)
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
        if (!$file || !is_readable($file)) { // Error de lectura
            return false;
        }

        // Open file
        $file = fopen($file, 'r');

        // Set padding
        $start = max(1, $line_number - $padding);
        $end = $line_number + $padding;

        $source = [];
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
        // Check input data
        if (!isset($content)) {
            if (is_array($attributes)) {
                return '<' . $tag_name . self::html_attributes($attributes) . ' />';
            } else {
                $content = $attributes;
                $attributes = null;
            }
        }

        // Prepare content
        if (is_array($content)) {
            $content_html = [];
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

        // Build element
        if (empty($attributes)) {
            return "<$tag_name>$content</$tag_name>";
        } else {
            return '<' . $tag_name . self::html_attributes($attributes) . ">$content</$tag_name>";
        }
    }
}