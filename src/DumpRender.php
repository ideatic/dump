<?php

/**
 * @internal
 */
class DumpRender
{
    public $show_caller = true;
    public $show_types = true;
    public $show_extra_info = true;
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
        if (count($data) == 1 && (($e = reset($data)) instanceof Exception || ($e = reset($data)) instanceof Throwable)) {
            $this->_recursion_objects = [];
            $inner = [$this->_renderException('', $e)];

            // Caller info
            $show_caller = true;
            $action = 'Thrown';
            $step['file'] = Dump::cleanPath($e->getFile());
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
                $step['file'] = Dump::cleanPath($step['file']);
            }
        }

        $result = [];
        if ($this->format == 'html') {
            // Generate HTML
            $result[] = '<div class="dump">';

            // Loader
            $result[] = self::assetsLoader('init_dump($(".dump"),{static_url:"' . $this->assets_url . '"})', $this->assets_url);

            // Body
            $result[] = '<ul class="dump-node dump-firstnode"><li>';
            foreach ($inner as $item) {
                $result[] = $item;
            }
            $result[] = '</li></ul>';

            // Footer
            if (isset($step) && $show_caller) {
                $result[] = $this->htmlElement('div', ['class' => 'dump-footer'], "{$action} from {$step['file']}, line {$step['line']}");
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
        $memory_limit = $this->_returnBytes(ini_get('memory_limit'));
        if ($memory_limit > 0 && memory_get_usage() > $memory_limit * 0.75) {
            $render = $this->_renderItem($name, '&times;', 'Memory exhausted', $level, $metadata);
        } elseif ($data instanceof Exception || $data instanceof Throwable) {
            $render = $this->_renderException($name, $data, $level);
        } elseif (is_object($data)) {
            $render = $this->_renderObject($name, $data, $level, $metadata);
        } elseif (is_array($data)) {
            $render = $this->_renderArray($name, $data, $level, $metadata);
        } elseif (is_resource($data)) {
            $render = $this->_renderItem($name, 'Resource', get_resource_type($data), $level, $metadata);
        } elseif (is_string($data)) {
            $html = '';
            if ($this->format == 'html') {
                if (preg_match('#^(\w+):\/\/([\w@][\w.:@]+)\/?[\w\.?=%&=\-@/$,]*$#', $data)) // URL
                {
                    $html = $this->htmlElement(
                        'a',
                        ['href' => $data, 'target' => '_blank'],
                        htmlspecialchars($data)
                    );
                } elseif (preg_match('#^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$#', $data)) {// Email
                    $html = $this->htmlElement(
                        'a',
                        ['href' => "mailto:$data", 'target' => '_blank'],
                        htmlspecialchars($data)
                    );
                } elseif (strpos($data, '<') !== false || strlen($data) > 15) {// Only expand if is a long text or HTML code
                    $html = $this->htmlElement(
                        'div',
                        ['class' => 'dump-string'],
                        htmlspecialchars(str_replace(['{', '}'], ['&#123;', '&#125;'], $data))// Proteger plantillas Angular y Twig
                    );
                }
            }

            $render = $this->_renderItem(
                $name,
                'String',
                strlen($data) > 100 && $this->format == 'html' ? substr($data, 0, 100) . '...' : $data,
                $level,
                $metadata,
                strlen($data) . ' characters',
                $html
            );
        } elseif (is_float($data)) {
            $render = $this->_renderItem($name, 'Float', $data, $level, $metadata);
        } elseif (is_integer($data)) {
            $render = $this->_renderItem($name, 'Integer', $data, $level, $metadata);
        } elseif (is_bool($data)) {
            $render = $this->_renderItem($name, 'Boolean', $data ? 'TRUE' : 'FALSE', $level, $metadata);
        } elseif (is_null($data)) {
            $render = $this->_renderItem($name, 'NULL', null, $level, $metadata);
        } else {
            $render = $this->_renderItem($name, '?', '<pre>' . print_r($data, true) . '</pre>', $level, $metadata);
        }

        return $render;
    }

    private function _renderItem($name, $type, $value, $level, $metadata = '', $extraInfo = '', $children = null, $class = null): string
    {
        // Variable info
        $info = '';
        if (!empty($type) && $this->show_types) {
            $content = !empty($metadata) ? "{$metadata}, {$type}" : $type;
            if ($this->format == 'html') {
                $info .= $this->htmlElement('span', ['class' => 'dump-type'], $content);
            } else {
                $info .= $content;
            }
        }
        if (!empty($extraInfo)) {
            if (!empty($info)) {
                $info .= ', ';
            }
            $info .= $this->format == 'html' ? $this->htmlElement('span', ['class' => 'dump-info'], $extraInfo) : $extraInfo;
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

            $result[] = $this->htmlElement(
                'div',
                ['class' => ['dump-header', $class, empty($children) ? '' : ' dump-collapsed']],
                [
                    ['span', ['class' => 'dump-name'], htmlspecialchars($name)],
                    empty($info) || !$this->show_extra_info ? '' : " ({$info})",
                    ' ',
                    ['span', ['class' => 'dump-value'], htmlspecialchars($value)],
                ]
            );

            if (!empty($children)) {
                $result[] = "<div class=\"dump-content {$class}\"><ul class=\"dump-node\">";

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
            $type_info = !empty($info) && $this->show_types ? $info : '';
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
                    $type_info = preg_replace('/^Object\,?\s*/i', $value . ', ', $type_info);
                } elseif ($type == 'Array') {
                    $type_info = preg_replace('/^Array\,?\s*/i', '', $type_info);// Ya se diferencian arrays de objetos
                } else {
                    $result[] = $value . ' ';
                }
            } else {
                $result[] = $value;
            }

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

    /**
     * @param                     $name
     * @param Exception|Throwable $e
     * @param int                 $level
     *
     * @return string
     */
    private function _renderException($name, $e, $level = 0)
    {
        $children = [];

        // Basic info about the exception
        $path = Dump::cleanPath($e->getFile());
        $message = Dump::cleanPath($e->getMessage());

        if ($this->format == 'html') {
            $children[] = $this->htmlElement('div', ['class' => 'dump-exception'], htmlspecialchars($message));
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
                $children[] = $this->_renderSourceCode('Source', $source, $path, $e->getLine());
            }
        } else {
            $children[] = $this->_renderItem('Location', '', $path . ':' . $e->getLine(), $level + 1);

            $backtrace = Dump::backtraceSmall($e->getTrace(), false);
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
            $children[] = $this->_renderItem('Backtrace', '', $backtrace, $level + 1);
        }

        // Fields
        // $children[] = $this->_render_object('Fields', $e, $level + 1, '', ['message', 'trace']);

        // Backtrace
        if (is_array($backtrace)) {
            $backtraceChildren = [];

            foreach ($backtrace as $step_index => $step) {
                $stepChildren = [];
                foreach ($step as $k => $v) {
                    if ($k == 'source' && is_string($v) && !empty($v)) {
                        $stepChildren[] = $this->_renderSourceCode($k, $v, $level + 1, $step['file'], $step['line']);
                    } elseif (!in_array($k, ['function', 'file', 'line'])) {
                        $stepChildren[] = $this->_render($k, $v, $level + 1);
                    }
                }


                $info = (isset($step['args']) ? count($step['args']) : 0) . ' parameters';
                $backtraceChildren[] = $this->_renderItem($step_index, $step['function'], '', $level, '', $info, $stepChildren);
            }

            $children[] = $this->_renderItem('Backtrace', count($backtrace) . ' steps', '', $level, '', '', $backtraceChildren);
        }

        if ($level == 0) {
            return $this->_renderItem(get_class($e), '', strip_tags($message), $level, '', '', $children, 'exception');
        } else {
            return $this->_renderItem($name, get_class($e), strip_tags($message), $level, '', '', $children, 'exception');
        }
    }

    private function _renderArray($name, $data, $level = 0, $metadata = '', $ignoredKeys = [])
    {
        if ($level < $this->nesting_level || empty($data)) {// Render items
            $children = [];

            $ignoreKeys = false;
            $allScalar = false;
            if ($this->format == 'json') {// Ignore keys in normal zero-based indexed arrays
                $i = 0;
                $ignoreKeys = true;
                $allScalar = true;
                foreach ($data as $key => $value) {
                    if ($i !== $key) {
                        $ignoreKeys = false;
                        break;
                    }
                    if (!is_scalar($value)) {
                        $allScalar = false;
                    }
                    $i++;
                }
            }

            foreach ($data as $key => &$value) {
                if (in_array($key, $ignoredKeys)) {
                    continue;
                }

                $children[] = $this->_render($ignoreKeys ? '' : $key, $value, $level + 1);
            }

            if ($this->format == 'json' && $ignoreKeys && $allScalar) {
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
        return $this->_renderItem($name, 'Array', '', $level, $metadata, $this->count_elements ? (count($data) . ' items') : '', $children);
    }

    private function _renderObject($name, $data, $level = 0, $metadata = '', $ignored_properties = [])
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
                            $value = null;
                            try {
                                $propertyName = $property->name;
                                if ($property->isPublic() && isset($data->$propertyName)) {
                                    $value = $property->getValue($data);
                                } elseif (method_exists($property, 'setAccessible') && isset($data->$propertyName)) {
                                    $property->setAccessible(true);
                                    $value = $property->getValue($data);
                                } else {
                                    if (!isset($private_data)) { // Initialize object private data
                                        $private_data = $this->_getPrivateData($data, []);
                                    }

                                    if (array_key_exists($property->name, $private_data)) {
                                        $value = $private_data[$property->name];
                                    } else {
                                        $value = '?';
                                    }
                                }
                            } catch (Throwable $err) {
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

            if (!is_array($properties)) {
                $properties = [];
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
        return $this->_renderItem($name, 'Object', get_class($data), $level, $metadata, "{$properties_count} fields", $children);
    }

    private function _getPrivateData($object, $default = false)
    {
        for ($method = 0; $method < 2; $method++) {
            try {
                $raw_data = false;
                if ($method == 0) {
                    // Based on a hack to access private properties: http://derickrethans.nl/private-properties-exposed.html
                    $raw_data = (array)$object;
                } elseif ($method == 1) {
                    // Try to get it using serialize()
                    $class_name = get_class($object);
                    $serialized = serialize($object);

                    if (preg_match('/' . preg_quote($class_name) . '.\:(\d+)/', $serialized, $match)) {
                        $prop_count = $match[1];
                        $class_name_len = strlen($class_name);

                        $serialized_array = str_replace(
                            "O:{$class_name_len}:\"{$class_name}\":{$prop_count}:",
                            "a:{$prop_count}:",
                            $serialized
                        );

                        if ($serialized != $serialized_array) {
                            $raw_data = unserialize($serialized_array);
                        }
                    }
                }

                if ($raw_data !== false) {
                    $data = [];
                    foreach ($raw_data as $key => $value) {
                        $pos = strrpos($key, "\0");

                        if ($pos !== false) // Remove special names given by php ( "\0*\0" for protected fields, "\0$class_name\0" for private)
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
     */
    private function _returnBytes($val): int
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

    private function _renderSourceCode($name, $value, $level, $file = null, $line = null)
    {
        $edit_link = '';
        return $this->_renderItem(
            $name,
            '',
            "$file:$line",
            $level,
            '',
            '',
            $this->htmlElement('div', ['class' => 'dump-source'], $edit_link . $value)
        );
    }

    /* Helpers */

    /**
     * Read the source code from a file, centered in a line number, with a specific padding and applying a highlight
     * @return string
     * @internal
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


    public static function assetsLoader($onLoad, $staticURL): string
    {
        ob_start();
        ?>
        <script>
            window.jQuery || document.write('<script src="<?= $staticURL ?>/jquery.js"><\/script>');</script>
        <script>
            var _dumpq = _dumpq || [];
            _dumpq.push(function () {
                <?= $onLoad ?>;
            });
            (function ($, init) {
                var loadq = function () {
                    while ((i = _dumpq.shift()) !== undefined) {
                        i();
                    }
                    init = true;
                };

                if (!init) {
                    $.getScript("<?= $staticURL ?>/dump.js", loadq);
                    $("head").append($("<link rel='stylesheet' type='text/css' href='<?= $staticURL ?>/dump.css' />"));
                    init = 'loading';
                } else if (init !== 'loading') {
                    loadq();
                }
            })(window.jQuery, window.init_dump);
        </script>
        <noscript>
            <style>@import url("<?= $staticURL ?>/dump.css");

                .dump-firstnode > li > .dump-content {
                    display: block;
                }</style>
        </noscript>
        <?php

        return ob_get_clean();
    }

    /**
     * @deprecated use assetsLoader
     */
    public static function assets_loader($on_load, $static_url)
    {
        return self::assetsLoader($on_load, $static_url);
    }

    public static function htmlAttributes($attributes = ''): string
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

    /**
     * @deprecated use htmlAttributes
     */
    public static function html_attributes($attributes = '')
    {
        return self::htmlAttributes($attributes);
    }

    public static function htmlElement(string $tagName, $attributes, $content = null): string
    {
        // Check input data
        if (!isset($content)) {
            if (is_array($attributes)) {
                return '<' . $tagName . self::htmlAttributes($attributes) . ' />';
            } else {
                $content = $attributes;
                $attributes = null;
            }
        }

        // Prepare content
        if (is_array($content)) {
            $contentHTML = [];
            foreach ($content as $childElement) {
                if (is_array($childElement)) {
                    $contentHTML[] = self::htmlElement(
                        $childElement[0],
                        $childElement[1],
                        count($childElement) > 2 ? $childElement[2] : null
                    );
                } else {
                    if (!empty($childElement)) {
                        $contentHTML[] = $childElement;
                    }
                }
            }
            $content = implode('', $contentHTML);
        }

        // Build element
        if (empty($attributes)) {
            return "<{$tagName}>{$content}</{$tagName}>";
        } else {
            return "<{$tagName}" . self::htmlAttributes($attributes) . ">{$content}</{$tagName}>";
        }
    }

    /**
     * @deprecated use htmlElement
     */
    public static function html_element($tag_name, $attributes, $content = null)
    {
        return self::htmlElement($tag_name, $attributes, $content);
    }
}