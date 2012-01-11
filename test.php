<?php
require 'Dump.php';

//Configuration
Dump::config('dump-static', array(
    dirname(__FILE__) => 'APP_PATH')
);

function do_test() {
    foo('dummy', 2);
}

function foo($a, $b) {
    baz(mt_rand(), array('a' => array('a1', 'a2'), 'b'));
}

function baz($a, $b) {
    echo '<h2>PHP Global variables</h2>';
    dump($_SERVER, $_REQUEST);

    echo '<h2>Exception</h2>';
    dump(new ErrorException('Dummy exception'));

    echo '<h2>Debug backtrace</h2>';
    dump(debug_backtrace());
    
    echo '<h2>Debug backtrace (processed)</h2>';
    dump(Dump::analize_trace(debug_backtrace()));

    echo '<h2>Recursion</h2>';
    //array
    $a = array('a', 'b');
    $a['c'] = &$a;
    //objects
    $b = new DummyClass();
    $b->field = $b;
    $b->field->field = &$b;
    dump($a, $b);
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