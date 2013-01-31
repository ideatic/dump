$(document).ready(function () {
    //Establecer mecanismo de expansión y contracción de nodos mediante clics del ratón
    load_toggles();

    //Cargar botones para mostrar los datos encima del resto de elementos de la página
    load_overlay();

    //Añadir visor HTML dinámico para las cadenas de texto
    load_string_viewer();

    //Añadir visor de código
    load_source_code_viewer();

    //Marcar nodos como procesados
    $('.dump-main').removeClass('dump-pending');
});

function load_toggles() {
    //Plugin de doble clic
    $.fn.single_double_click = function (single_click_callback, double_click_callback, timeout) {
        return this.each(function () {
            var clicks = 0,
                self = this;
            if ($.browser.msie) { // ie triggers dblclick instead of click if they are fast
                $(this).bind("dblclick", function (event) {
                    clicks = 2;
                    double_click_callback.call(self, event);
                });
                $(this).bind("click", function (event) {
                    setTimeout(function () {
                        if (clicks != 2) {
                            single_click_callback.call(self, event);
                        }
                        clicks = 0;
                    }, timeout || 300);
                });
            } else {
                $(this).bind("click", function (event) {
                    clicks++;
                    if (clicks == 1) {
                        setTimeout(function () {
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

    //Activar mecanismos de expansión de nodos
    $('.dump-pending .dump-item-collapsed').single_double_click(function () { //Click, alternar solo el nodo actual
        toggle_element_content(this, null, 'fast', false);
    }, function () { //Doble click, alternar todos los nodos hijo
        toggle_element_content(this, null, 'fast', true);
    }, 200);
}

function toggle_element_content(element, show, speed, apply_children) {
    if ($(element).hasClass('dump-item-collapsed') == false) element = $(element).find('.dump-item-collapsed:first');

    var content = $(element).next('.dump-item-content');
    show = show == null ? !$(content).is(':visible') : show; //Si está oculto, mostrar
    $(element).toggleClass('dump-item-expanded', show);

    if (!show) { //Primero ocultar el actual y luego los hijos
        $(content).hide(speed);
    }
    if (apply_children) {
        $(content).find('.dump-item-collapsed').each(function () {
            toggle_element_content(this, show, '', false);
        });
    }
    if (show) { //Primero expandir los hijos y luego el actual
        $(content).show(speed, function () {
            //Resolver error con el resaltado de sintaxis, que no funciona cuando el div está oculto
            $(this).find('.CodeMirror').each(function () {
                this.editor.refresh();
                //     this.editor.refresh(); //Si no se hace dos veces, al altura no se calcula correctamente
            });
        });
        load_source_code_viewer(); //Update codemirror on new source elements
    }


}

function load_overlay() {
    //Añadir botón para mostrar los datos superpuestos al resto de elementos
    $('.dump-main.dump-pending').append('<div class="dump-expand"></div>');

    //Establecer delegado que procese la superposición de los elementos
    $('.dump-pending .dump-expand').click(function () {
        var dump = $(this).closest('.dump-main');

        //Crear capa de superposición a todo el body (tipo 'fancybox')
        var overlay = $('<div id="dump-overlay"></div>').hide().appendTo("body");
        $(document).resize(

        function () {
            $(overlay).height($(document).height());
        }).trigger('resize');

        //Insertar señuelo con el mismo tamaño que el elemento original
        var dummy = $('<div>').addClass('dump-main').
        width($(dump).width()).height($(dump).height());
        //  $(dump).replaceWith(dummy);
        $(dump).before(dummy);

        //Mecanismos para cerrar la superposición
        var close_button = $('<div>').addClass('dump-close');
        $(dump).append(close_button);

        $(close_button).add(overlay).click(function () {
            $(dump).fadeOut('fast', function () {
                $(overlay).fadeOut('fast', function () { //Eliminar capa de superposicion
                    $(overlay).remove();
                });
                $(close_button).remove(); //Borrar botón de cerrar
                $(dummy).replaceWith(dump); //Sustituir señuelo por el original
                $(dump).removeClass('overlay').css('top', '').show(); //Volver a colocar el elemento en su sitio
                toggle_element_content(dump, false, '', true); //Contraer nodo           
            });
        });

        //Superponer volcado de datos
        $(dump).addClass('overlay').css('top', $(window).scrollTop() + 125).appendTo('body');
        toggle_element_content(dump, true, '', false); //Expandir nodo

        //Mostrar
        $(overlay).fadeTo('fast', 0.7);
        $(dump).fadeTo('fast', 1);
    });
}

function load_string_viewer() {
    $('.dump-pending .dump-string').each(function () {
        $(this).html('<div class="dump-string-tools"><span class="dump-string-format-plain dump-selected">PLAIN</span> <span class="dump-string-format-html">HTML</span></div><div class="dump-string-text">' + $(this).html() + '</div>');
    });
    $('.dump-pending .dump-string-format-plain,.dump-pending  .dump-string-format-html').click(function () {
        if ($(this).hasClass('dump-selected')) return;

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

            function () {
                $(this).contents().get(0).write(text);
            }).appendTo(textDiv);
        }
    });
}

function load_source_code_viewer() {
    var highlight_code = function () {
        $('.dump-code:visible').each(function () {
            var code_element = this;

            var first_line = parseInt($(code_element).data('from') || 1);

            var editor = CodeMirror(function (editor) {
                code_element.parentNode.replaceChild(editor, code_element);
            }, {
                value: $(code_element).text(),
                mode: $(code_element).data('language') == "php" ? "text/x-php" : $(code_element).data('language'),
                theme: $(code_element).data('theme') || "graynight",
                lineNumbers: true,
                matchBrackets: true,
                readOnly: true,
                firstLineNumber: first_line
            });
            if ($(code_element).data('highlight'))
                editor.setLineClass($(code_element).data('highlight') - first_line, "highlighted");

            editor.getWrapperElement().editor = editor;//Used for direct access from DOM element
        });
    };

    if ($('.dump-code:visible').length > 0) {
        //Cargar Codemirror
        if (typeof CodeMirror !== 'function') {
            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: dump_static_url + "/CodeMirror/codemirror.css"
            }).appendTo("head");
            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: dump_static_url + "/CodeMirror/theme/graynight.css"
            }).appendTo("head");
            $.ajaxSetup({
                cache: true
            });
            $.getScript(dump_static_url + "/CodeMirror/codemirror.js", highlight_code);
        } else {
            highlight_code();
        }
    }
}