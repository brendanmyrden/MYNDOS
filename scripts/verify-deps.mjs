import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const packageJsonPath = join(rootDir, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

const missing = [];

if (!existsSync(join(rootDir, "node_modules"))) {
  missing.push("node_modules/");
}

for (const packageName of Object.keys(dependencies).sort()) {
  const packagePath = join(rootDir, "node_modules", ...packageName.split("/"), "package.json");
  if (!existsSync(packagePath)) {
    missing.push(packagePath.replace(`${rootDir}/`, ""));
  }
}

const requiredFiles = [
  "node_modules/.bin/tsc",
  "node_modules/.bin/vite",
  "node_modules/typescript/bin/tsc",
  "node_modules/vite/bin/vite.js",
  "node_modules/@vitejs/plugin-react/dist/index.js",
  "node_modules/react/package.json",
  "node_modules/react-dom/package.json",
];

for (const requiredFile of requiredFiles) {
  if (!existsSync(join(rootDir, requiredFile))) {
    missing.push(requiredFile);
  }
}

if (missing.length > 0) {
  console.error("Dependency integrity check failed. Missing expected install artifacts:");
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  console.error("\nRun `npm ci` to rebuild node_modules from package-lock.json.");
  process.exit(1);
}

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(npmCommand, ["ls", "--depth=0"], {
  cwd: rootDir,
  encoding: "utf8",
  stdio: "pipe",
});

if (result.status !== 0) {
  console.error("Dependency tree check failed. npm reported an invalid install:");
  if (result.stdout.trim()) {
    console.error(result.stdout.trim());
  }
  if (result.stderr.trim()) {
    console.error(result.stderr.trim());
  }
  console.error("\nRun `npm ci` to refresh node_modules.");
  process.exit(result.status ?? 1);
}

console.log("Dependency integrity check passed.");
