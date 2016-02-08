#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

char* read_all(int fp) {
    size_t output_size = 1;
    size_t buffer_size = 1024;
    char *output = NULL;
    char *previous_output = NULL;
    size_t previous_output_size = 0;

    while (1) {
        output_size = previous_output_size + sizeof(char) * buffer_size;
        output = malloc(output_size + 1);

        if (previous_output != NULL) {
            memcpy(output, previous_output, previous_output_size);
            free(previous_output);
        }

        int read_size = read(fp, output + previous_output_size, buffer_size);
        if (read_size != buffer_size) {
            output[previous_output_size + read_size] = '\0';
            break;
        }

        previous_output = output;
        previous_output_size = output_size;
    }

    return output;
}

int main(int argc, char* argv[]) {

    int pipefd[2];
    if (pipe(pipefd) < 0) {
        perror("Faile to create pipe");
        exit(1);
    }

    pid_t pid = fork();
    if (pid < 0) {
        perror("Failed to fork");
        exit(1);
    }

    if (pid == 0) {
        close(pipefd[0]);
        dup2(pipefd[1], 1);
        execl("/bin/bash", "bash", "-c", "echo Hi", NULL);
        perror("Failed to exec");
        exit(1);
    } else {
        close(pipefd[1]);

        char *output = read_all(pipefd[0]);
        int code;
        int ret = waitpid(pid, &code, 0);
        if (ret < 0) {
            perror("Failed to wait");
        }

        printf("%d %s", code, output);
    }

}
