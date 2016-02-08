package main

import (
    "os/exec"
    "fmt"
    "syscall"
    "log"
)

func main() {
    output, err := exec.Command("bash", "-c", "echo Hi").Output()
    exitStatus := 0

    if err != nil {
        exiterr, ok := err.(*exec.ExitError)
        if ok {
            status, ok := exiterr.Sys().(syscall.WaitStatus)
            if ok {
                exitStatus = status.ExitStatus()
            }
        } else {
            log.Fatal(err)
        }
    }

    fmt.Printf("%d %s", exitStatus, output)

}
