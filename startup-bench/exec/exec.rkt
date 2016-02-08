#lang racket

(match-define (list stdout stdin pid stderr control) (process* "/bin/bash" "-c" "echo Hi"))
(control 'wait)
(printf "~a ~a" (control 'exit-code) (port->string stdout))
