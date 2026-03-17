import { execSync } from "child_process";
import fs from "fs";

try {
  const out = execSync("npm run build", { stdio: "pipe" });
  fs.writeFileSync("error.log", "SUCCESS\n" + out.toString());
} catch (error) {
  fs.writeFileSync(
    "error.log",
    "STDOUT: " +
      (error.stdout ? error.stdout.toString() : "") +
      "\nSTDERR: " +
      (error.stderr ? error.stderr.toString() : "") +
      "\nMESSAGE: " +
      error.message
  );
}
