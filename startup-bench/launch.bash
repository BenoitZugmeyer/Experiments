#!/bin/bash

set -euo pipefail

compile () (
    local src="$1"
    local out="$2"
    shift 2
    local cmd
    cmd=("${@/out/$out}")
    cmd=("${cmd[@]/src/$src}")
    if ! [[ -e $out ]] && [[ $src -nt $out ]]; then
        echo "Compiling $out (${cmd[@]})"
        "${cmd[@]}"
    fi
)

monitor () {
    local lang=$1
    shift
    local start=$(date +%s%N)
    "${@}" > /dev/null
    local end=$(date +%s%N)
    printf "%-8s %6dms\n" $lang $(( ( $end - $start ) / 1000000 ))
}

launch_folder () (
    local name=$1

    cd $name

    echo "$name command"

    compile $name.rs   $name-rs    rustc -O -o out src
    compile $name.c    $name-c     gcc -O3  -o out src
    compile $name.rkt  $name-rkt   raco exe -o out src
    compile $name.go   $name-go    go build -o out src
    compile $name.java $name.class javac src

    monitor "Bash"     bash $name.bash
    monitor "C"        ./$name-c
    monitor "Go"       go run $name.go
    monitor "Go-c"     ./$name-go
    monitor "Java"     java $name
    monitor "Node"     node $name.js
    monitor "Python"   python $name.py
    monitor "Racket"   racket $name.rkt
    monitor "Racket-c" ./$name-rkt
    monitor "Ruby"     ruby $name.rb
    monitor "Rust"     ./$name-rs

    echo
)

launch_folder hello
launch_folder exec
