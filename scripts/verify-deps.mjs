import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const packageJsonPath = join(rootDir, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const shouldRepair = process.argv.includes("--repair") || process.argv.includes("--fix");

const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const nativePackagesByPlatform = {
  "darwin:arm64": ["@esbuild/darwin-arm64", "@rollup/rollup-darwin-arm64"],
  "darwin:x64": ["@esbuild/darwin-x64", "@rollup/rollup-darwin-x64"],
  "win32:arm64": ["@esbuild/win32-arm64", "@rollup/rollup-win32-arm64-msvc"],
  "win32:x64": ["@esbuild/win32-x64", "@rollup/rollup-win32-x64-msvc"],
  "linux:arm64": ["@esbuild/linux-arm64"],
  "linux:x64": ["@esbuild/linux-x64"],
};

function packageJsonFor(packageName) {
  return join(rootDir, "node_modules", ...packageName.split("/"), "package.json");
}

function relativeToRoot(path) {
  return path.replace(`${rootDir}/`, "");
}

function runCommand(command, args) {
  return spawnSync(command, args, {
    cwd: rootDir,
    encoding: "utf8",
    stdio: "pipe",
  });
}

function collectInstallProblems() {
  const problems = [];

  if (!existsSync(join(rootDir, "node_modules"))) {
    problems.push("node_modules/");
  }

  for (const packageName of Object.keys(dependencies).sort()) {
    const packagePath = packageJsonFor(packageName);
    if (!existsSync(packagePath)) {
      problems.push(relativeToRoot(packagePath));
    }
  }

  const platformKey = `${process.platform}:${process.arch}`;
  const nativePackages = nativePackagesByPlatform[platformKey] ?? [];
  for (const packageName of nativePackages) {
    const packagePath = packageJsonFor(packageName);
    if (!existsSync(packagePath)) {
      problems.push(relativeToRoot(packagePath));
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
      problems.push(requiredFile);
    }
  }

  const esbuildResult = runCommand(process.execPath, [
    "-e",
    "require('esbuild').transformSync('const ok = true')",
  ]);
  if (esbuildResult.status !== 0) {
    problems.push("esbuild native binary smoke test failed");
  }

  const npmLsResult = runCommand(npmCommand, ["ls", "--depth=0"]);
  if (npmLsResult.status !== 0) {
    problems.push("npm ls --depth=0 reported an invalid dependency tree");
  }

  return { problems, npmLsResult, esbuildResult };
}

function printProblems({ problems, npmLsResult, esbuildResult }) {
  console.error("Dependency integrity check failed:");
  for (const item of problems) {
    console.error(`- ${item}`);
  }
  if (esbuildResult?.status !== 0 && esbuildResult.stderr.trim()) {
    console.error("\nesbuild error:");
    console.error(esbuildResult.stderr.trim());
  }
  if (npmLsResult?.status !== 0) {
    console.error("\nnpm dependency tree:");
    if (npmLsResult.stdout.trim()) {
      console.error(npmLsResult.stdout.trim());
    }
    if (npmLsResult.stderr.trim()) {
      console.error(npmLsResult.stderr.trim());
    }
  }
}

let checkResult = collectInstallProblems();

if (checkResult.problems.length > 0 && shouldRepair) {
  printProblems(checkResult);
  console.error("\nRunning `npm ci` to repair node_modules before continuing...");

  const repairResult = spawnSync(npmCommand, ["ci"], {
    cwd: rootDir,
    stdio: "inherit",
  });

  if (repairResult.status !== 0) {
    console.error("\nDependency repair failed.");
    process.exit(repairResult.status ?? 1);
  }

  checkResult = collectInstallProblems();
}

if (checkResult.problems.length > 0) {
  printProblems(checkResult);
  console.error("\nRun `npm ci` to rebuild node_modules from package-lock.json.");
  process.exit(1);
}

console.log("Dependency integrity check passed.");
