import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageRoot = path.resolve(__dirname, "..");
const sourcePolicyDir = path.resolve(packageRoot, "..", "yl-commit-policy");
const targetPolicyDir = path.resolve(packageRoot, "dist", "default-policy");

const requiredFiles = [
  "commit-regex.json",
  "commit-types.json",
];

if (!fs.existsSync(sourcePolicyDir)) {
  throw new Error(`Missing source policy directory: ${sourcePolicyDir}`);
}

fs.mkdirSync(targetPolicyDir, { recursive: true });

for (const fileName of requiredFiles) {
  const sourceFile = path.join(sourcePolicyDir, fileName);
  const targetFile = path.join(targetPolicyDir, fileName);

  if (!fs.existsSync(sourceFile)) {
    throw new Error(`Missing policy file: ${sourceFile}`);
  }

  fs.copyFileSync(sourceFile, targetFile);
  console.log(`Copied ${sourceFile} -> ${targetFile}`);
}

console.log(`Bundled default policy copied successfully from: ${sourcePolicyDir}`);