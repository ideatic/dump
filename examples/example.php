<?php

function dump() {
    if (!class_exists('Dump')) {
        require '../src/Dump.php';
        //Configuration
        Dump::config('../assets/', array(
            'APP_PATH' => dirname(__FILE__)
                )
        );
    }
    call_user_func_array(array('Dump', 'show'), func_get_args());
}

function do_test() {
    foo('dummy', 2);
}

function foo($a, $b) {
    baz(mt_rand(), array('a' => array('a1', 'a2'), 'b'));
}

function baz($a, $b) {
    echo '<h2>Class inhertance</h2>';
    $foo = new Foo();
    dump($foo);

    echo '<h2>PHP Global variables</h2>';
    dump(array('$_SERVER'=>$_SERVER, '$_REQUEST'=>$_REQUEST));

    echo '<h2>Exception</h2>';
    dump(new ErrorException('Dummy exception'));

    echo '<h2>Debug backtrace</h2>';
    dump(debug_backtrace());

    echo '<h2>Debug backtrace (processed)</h2>';
    dump(Dump::backtrace(debug_backtrace()));

    echo '<h2>Recursion</h2>';
    //array
    $a = array('a', 'b');
    $a['c'] = &$a;
    //objects
    $b = new DummyClass();
    $b->field = $b;
    $b->field->field = &$b;
    dump($a, $b);

    echo '<h2>Test source code</h2>';
    echo Dump::source(file_get_contents(__FILE__));
}

class Baz {

    protected $primer_proc = 'hola';
    private $other = 69;
    public $publico = 'hehe';

}

class Foo extends Baz {

    private $_handle;

    public function __construct() {
        $this->_handle = fopen(__FILE__, 'r');
    }

    protected $segundo_proc = 'adios';
    private $other_priv = array();
    public $Fooque = 'publico';

}

class DummyClass {

    public $field;

}
?>
<!doctype html>
<html>
    <head>
        <title>Dump test</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body>
        <h1>Dump test</h1>
        <?php do_test(); ?>
    </body>
</html>