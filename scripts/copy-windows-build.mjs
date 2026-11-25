import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const bundleDir = join(root, "src-tauri", "target", "release", "bundle");
const outDir = join(root, "build", "windows");

mkdirSync(outDir, { recursive: true });

const copied = [];

for (const kind of ["nsis", "msi"]) {
  const source = join(bundleDir, kind);
  if (!existsSync(source)) continue;
  cpSync(source, join(outDir, kind), { recursive: true });
  copied.push(kind);
}

const exe = join(root, "src-tauri", "target", "release", "color-studio.exe");
if (existsSync(exe)) {
  cpSync(exe, join(outDir, "color-studio.exe"));
  copied.push("color-studio.exe");
}

if (copied.length === 0) {
  throw new Error(`No Windows build artifacts found in ${bundleDir}`);
}

console.log(`Windows build copied to ${outDir}`);
console.log(`Artifacts: ${copied.join(", ")}`);
console.log(readdirSync(outDir).join("\n"));
