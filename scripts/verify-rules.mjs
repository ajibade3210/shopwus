import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");

const errors = [];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(rootDir, filePath);

  // 1. Check for interface or type definitions in src/components/, src/hooks/, and src/app/
  if (
    filePath.startsWith(path.join(srcDir, "components")) ||
    filePath.startsWith(path.join(srcDir, "hooks")) ||
    filePath.startsWith(path.join(srcDir, "app"))
  ) {
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Skip global ambient window augmentation (e.g. Google auth)
      if (line.includes("interface Window")) continue;

      // Match standalone interface or component/hook type declaration (ignore comments)
      if (
        /^(?:export\s+)?(?:interface\s+[A-Za-z0-9_]+|type\s+[A-Za-z0-9_]+(?:Props|ContextType|Options)\s*=)/i.test(
          line
        ) &&
        !line.startsWith("//") &&
        !line.startsWith("/*")
      ) {
        errors.push(
          `[RULE VIOLATION] ${relPath}:${i + 1} -> Interface or type defined outside 'src/types/'. Move interface or type definitions to 'src/types/{domain}.ts'.`
        );
      }

      // Check for inline prop type literals in component definitions e.g. Component({ ... }: { ... })
      if (
        !filePath.includes(".test.") &&
        !filePath.includes("__tests__") &&
        /\b(?:function|const)\s+[A-Z][A-Za-z0-9_]*.*?\(\s*\{[^}]+\}\s*:\s*\{/.test(line) &&
        !line.startsWith("//") &&
        !line.startsWith("/*")
      ) {
        errors.push(
          `[RULE VIOLATION] ${relPath}:${i + 1} -> Inline prop type literal on component. Declare an explicit interface in 'src/types/{domain}.ts'.`
        );
      }
    }
  }

  // 2. Check for explicit 'any' types in src/
  if (filePath.startsWith(srcDir) && !filePath.includes(".test.") && !filePath.includes("__tests__")) {
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Check for : any, as any, <any>, Promise<any>, any[]
      if (/(:\s*any\b|as\s+any\b|<any>|Promise<any>|any\[\])/.test(line) && !line.trim().startsWith("//") && !line.trim().startsWith("/*")) {
        errors.push(`[RULE VIOLATION] ${relPath}:${i + 1} -> Explicit 'any' detected. Strict zero-any policy requires explicit typing.`);
      }
    }
  }
}

function traverseDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next" && entry.name !== "dist") {
        traverseDir(fullPath);
      }
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      checkFile(fullPath);
    }
  }
}

// 3. Verify all files in src/types/ are re-exported in src/types/index.ts
function checkTypeExports() {
  const typesDir = path.join(srcDir, "types");
  const indexPath = path.join(typesDir, "index.ts");
  if (!fs.existsSync(typesDir) || !fs.existsSync(indexPath)) return;

  const indexContent = fs.readFileSync(indexPath, "utf-8");
  const typeFiles = fs.readdirSync(typesDir).filter((f) => f.endsWith(".ts") && f !== "index.ts");

  for (const file of typeFiles) {
    const baseName = file.replace(/\.ts$/, "");
    const exportPattern = new RegExp(`export\\s+\\*\\s+from\\s+['"]\\.\\/${baseName}['"]`);
    if (!exportPattern.test(indexContent)) {
      errors.push(`[RULE VIOLATION] src/types/${file} is not re-exported in src/types/index.ts.`);
    }
  }
}

console.log("🔍 Verifying AGENTS.md architectural rules...");
traverseDir(srcDir);
checkTypeExports();

if (errors.length > 0) {
  console.error("\n❌ Architecture and Rule Violations Detected:\n");
  for (const err of errors) {
    console.error(`  • ${err}`);
  }
  console.error("\nPlease resolve the above rule violations to ensure full compliance with AGENTS.md.");
  process.exit(1);
} else {
  console.log("✅ All AGENTS.md architectural rules verified successfully! 0 violations found.\n");
  process.exit(0);
}
