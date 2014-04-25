# Dump

Debugging tool which displays information about any PHP variable, class or exception.

Inspired in the tool [Krumo developed by mrasnika](http://krumo.sourceforge.net/).

### Usage

For using `Dump`, you only need to include the script, and configure it with the URL of the static resources, and, optionally, with the special paths that your application use:

	include 'Dump.php';
	Dump::config('/url/to/dump-static', array(
	    'APP_PATH' => '/home/app/www',
	    'SYSTEM_PATH' => '/home/app/src'
	  )
	);

And then, for dump information about any variable, resource or exception you only need to do:
	
	dump($var)

### Features

- Interactive dump of almost types of variables.
- Source code viewer with syntax highlighting.
- Object reflection.
- String viewer with plain and html mode.
- Comprehensive analysis of exceptions.
- Dynamic overlay that floats over top of web page. 

### Screenshots

![](https://github.com/javiermarinros/dump/raw/master/screenshot.png)