startup bench
=============

A small experiment to benchmark startup times of simple commands developped with various programming
languages.

Two types of commands are provided:

* **hello**: Prints "Hello world".
* **exec**: Execute a subprocess, collect the whole output in a string, then print its exit code and the output.

Results
-------

Note: `-c` suffix indicates the command has been compiled first in case the programming language
supports both interpreted and compiled execution.

Linux 4.3.3, Intel Core i7 K875 @ 2.93GHz, on a SSD

```
hello command
Bash          7ms
C             2ms
Go          290ms
Go-c          3ms
Java         55ms
Node         57ms
Python       29ms
Racket      308ms
Racket-c    290ms
Ruby         43ms
Rust          3ms

exec command
Bash         11ms
C             3ms
Go          373ms
Go-c          8ms
Java        128ms
Node         74ms
Python       55ms
Racket      404ms
Racket-c    303ms
Ruby         51ms
Rust         10ms
```
