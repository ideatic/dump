var init_dump;

(function($) {
    "use strict";

    //Double click plugin
    $.fn.single_double_click = function(single_click_callback, double_click_callback, timeout) {
        return this.each(function() {
            var clicks = 0,
                    self = this;
            var isIE = (function()
            {
                var div = document.createElement('div');
                div.innerHTML = '<!--[if IE]><i></i><![endif]-->';
                return (div.getElementsByTagName('i').length === 1);
            });
            if (isIE()) { // ie triggers dblclick instead of click if they are fast
                $(this).bind("dblclick", function(event) {
                    clicks = 2;
                    double_click_callback.call(self, event);
                });
                $(this).bind("click", function(event) {
                    setTimeout(function() {
                        if (clicks != 2) {
                            single_click_callback.call(self, event);
                        }
                        clicks = 0;
                    }, timeout || 300);
                });
            } else {
                $(this).bind("click", function(event) {
                    clicks++;
                    if (clicks == 1) {
                        setTimeout(function() {
                            if (clicks == 1) {
                                single_click_callback.call(self, event);
                            } else {
                                double_click_callback.call(self, event);
                            }
                            clicks = 0;
                        }, timeout || 300);
                    }
                });
            }
        });
    };

    //Dump
    init_dump = function(element, settings) {
        return $(element).each(function() {
            initialize($(this), settings);
        });

    };

    var initialize = function($dump, settings) {
        if (!$dump.data('dump-settings')) {
            $dump.data('dump-settings', settings);

            //Set mechanism of expansion and contraction of nodes through mouse clicks
            init_toggles($dump, settings);

            //Init overlay
            init_overlay($dump, settings);

            //Add dynamic HTML viewer for text strings
            init_string_viewer($dump, settings);

            //Load code viewer
            init_source_code_viewer($dump, settings);
        }
    }


    function init_toggles($dump, settings) {
        $dump.find('.dump-collapsed').single_double_click(function() { //Click, alternar solo el nodo actual
            toggle_element(this, null, 'fast', false);
        }, function() { //Doble click, alternar todos los nodos hijo
            toggle_element(this, null, 'fast', true);
        }, 200);
    }

    function toggle_element(element, show, speed, apply_children) {
        var $element = $(element);
        var $dump = $element.closest('.dump');

        if ($element.hasClass('dump-collapsed') == false)
            $element = $element.find('.dump-collapsed:first');

        var content = $element.next('.dump-content');
        show = show == null ? !$(content).is(':visible') : show; //Si está oculto, mostrar
        $element.toggleClass('dump-expanded', show);

        if (!show) { //Primero ocultar el actual y luego los hijos
            $(content).hide(speed);
        }
        if (apply_children) {
            $(content).find('.dump-collapsed').each(function() {
                toggle_element(this, show, '', false);
            });
        }
        if (show) { //Primero expandir los hijos y luego el actual
            $(content).show(speed, function() {
                //Fix CodeMirror error, not working properly when the element is hidden
                $(this).find('.CodeMirror').each(function() {
                    this.editor.refresh();
                });
            });
            init_source_code_viewer($dump, $dump.data('dump-settings')); //Update codemirror on new source elements
        }
    }

    function init_overlay($dump, settings) {
        //Añadir botón para mostrar los datos superpuestos al resto de elementos
        $('<div class="dump-expand" />').click(function() {
            //Crear capa de superposición a todo el body (tipo 'fancybox')
            var overlay = $('<div id="dump-overlay" />').hide().appendTo("body");
            $(document).resize(
                    function() {
                        $(overlay).height($(document).height());
                    }).trigger('resize');

            //Insertar señuelo con el mismo tamaño que el elemento original
            var dummy = $('<div>').addClass('dump').width($dump.width()).height($dump.height());
            $dump.before(dummy);

            //Close button
            var close_button = $('<div>').addClass('dump-close').appendTo($dump);

            $(close_button).add(overlay).click(function() {
                $dump.fadeOut('fast', function() {
                    $(overlay).fadeOut('fast', function() {
                        $(overlay).remove();
                    });
                    $(close_button).remove();
                    $(dummy).replaceWith($dump);
                    $dump.removeClass('overlay').css('top', '').show();

                    //contract dump
                    toggle_element($dump, false, '', true);
                });
            });

            //Show overlay
            $dump.addClass('overlay').css('top', $(window).scrollTop() + 125).appendTo('body');
            toggle_element($dump, true, '', false); //Expandir nodo

            $(overlay).fadeTo('fast', 0.7);
            $dump.fadeTo('fast', 1);
        }).appendTo($dump);
    }

    function init_string_viewer($dump, settings) {
        $dump.find('.dump-string').each(function() {
            $(this).html('<div class="dump-string-tools"><span class="dump-string-format-plain dump-selected">PLAIN</span> <span class="dump-string-format-html">HTML</span></div><div class="dump-string-text">' + $(this).html() + '</div>');
        });
        $dump.find('.dump-string-format-plain,.dump-string-format-html').click(function() {
            if ($(this).hasClass('dump-selected'))
                return;

            //   $(this).parents('.dump-string-tools').children().removeClass('dump-selected');
            $(this).siblings().removeClass('dump-selected');
            $(this).addClass('dump-selected');

            var textDiv = $(this).closest('.dump-string').find('.dump-string-text');
            if ($(this).hasClass('dump-string-format-plain')) { //Mostrar texto plano
                $(textDiv).text($(textDiv).data('text'));
            } else { //Mostrar HTML
                var text = $(textDiv).text();
                $(textDiv).data('text', text).html('');
                $('<iframe style="background:#fff" />').load(
                        function() {
                            $(this).contents().get(0).write(text);
                        }).appendTo(textDiv);
            }
        });
    }

    function init_source_code_viewer($dump, settings) {
        var $code = $dump.find('.dump-code:visible').add($dump.filter('.dump-code'));

        if ($code.length <= 0)
            return;

        var highlight_code = function() {
            $code.each(function() {
                var $code_element = $(this);

                var first_line = parseInt($code_element.data('from') || 1);

                var editor = CodeMirror(function(editor) {
                    $code_element.replaceWith(editor);
                }, {
                    value: $code_element.text(),
                    mode: $code_element.data('language') == "php" ? "text/x-php" : $code_element.data('language'),
                    theme: $code_element.data('theme') || "graynight",
                    lineNumbers: true,
                    matchBrackets: true,
                    readOnly: !$code_element.data('editable'),
                    firstLineNumber: first_line
                });
                if ($code_element.data('highlight')) {
                    editor.setLineClass($code_element.data('highlight') - first_line, "highlighted");
                }

                editor.getWrapperElement().editor = editor;//Used for direct access from DOM element
                $(editor.getWrapperElement()).attr('name', $code_element.attr('name'));
            });
        };

        //Load Codemirror
        if (typeof CodeMirror !== 'function') {
            $(document).on('codemirror_loaded', highlight_code);

            if (window.loading_codemirror)
                return;
            window.loading_codemirror = true;
            $([
                settings.static_url + "/CodeMirror/codemirror.css",
                settings.static_url + "/CodeMirror/theme/graynight.css"
            ]).each(function() {
                $("<link/>", {
                    rel: "stylesheet",
                    type: "text/css",
                    href: this
                }).appendTo("head");
            });

            $.ajax({
                dataType: "script",
                cache: true,
                url: settings.static_url + "/CodeMirror/codemirror.js",
                success: function() {
                    $(document).trigger('codemirror_loaded');
                }
            });
        } else {
            highlight_code();
        }
    }

})(jQuery);