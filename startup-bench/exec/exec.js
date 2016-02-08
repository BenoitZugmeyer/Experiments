const child_process = require("child_process");

const p = child_process.spawn("bash", ["-c", "echo Hi"]);

const output = [];
p.stdout.on("data", (data) => output.push(data));
p.on("close", (code) => {
  process.stdout.write(`${code} ${Buffer.concat(output)}`);
});
