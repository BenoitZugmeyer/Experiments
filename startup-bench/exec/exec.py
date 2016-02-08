import subprocess

process = subprocess.run(["bash", "-c", "echo Hi"], stdout=subprocess.PIPE)
print("{} {}".format(process.returncode, process.stdout.decode()), end="")
