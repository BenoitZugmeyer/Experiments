use std::process::Command;

fn main() {
    let child = Command::new("bash")
        .arg("-c")
        .arg("echo Hi")
        .output()
        .unwrap_or_else(|e| panic!("failed to execute child: {}", e));

    print!("{} {}", child.status.code().unwrap(), String::from_utf8_lossy(&child.stdout));
}
