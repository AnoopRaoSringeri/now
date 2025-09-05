const depcheck = require("depcheck");
const fs = require("fs");
const { execSync } = require("child_process");

async function run() {
  console.log("🔎 Checking for unused dependencies...");

  const pkgPath = "package.json";
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  const result = await depcheck(process.cwd(), {
    ignorePatterns: ["dist", "build"],
    ignoreMatches: ["*eslint*", "*prettier*"], // ignore linters
  });

  const unused = [...result.dependencies, ...result.devDependencies];

  if (unused.length === 0) {
    console.log("✅ No unused packages found!");
    return;
  }

  console.log("📦 Unused packages found:", unused);

  // save backup
  fs.writeFileSync("unused-deps.json", JSON.stringify(unused, null, 2));
  console.log("📝 Saved list to unused-deps.json");

  // uninstall
  for (const dep of unused) {
    console.log(`❌ Removing ${dep}...`);
    try {
      execSync(`yarn remove ${dep}`, { stdio: "inherit" });
    } catch (err) {
      console.error(`⚠️ Failed to remove ${dep}`, err);
    }
  }

  console.log("✨ Cleanup done! If something breaks, reinstall with:");
  console.log("   yarn add " + unused.join(" "));
}

run();
