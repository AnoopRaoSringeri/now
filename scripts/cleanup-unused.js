const { execSync } = require("child_process");
const depcheck = require("depcheck");
const fs = require("fs");

async function run() {
    console.log("🔎 Checking for unused dependencies...");

    const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));

    const result = await depcheck(process.cwd(), {
        ignorePatterns: ["dist", "build"], // ignore build folders
        ignoreMatches: ["*eslint*"] // ignore eslint plugins (can be tricky)
    });

    const unused = [...result.dependencies, ...result.devDependencies];

    if (unused.length === 0) {
        console.log("✅ No unused packages found!");
        return;
    }

    console.log("📦 Unused packages found:", unused);

    // uninstall safely
    for (const dep of unused) {
        console.log(`❌ Removing ${dep}...`);
        try {
            execSync(`npm uninstall ${dep}`, { stdio: "inherit" });
        } catch (err) {
            console.error(`⚠️ Failed to remove ${dep}`, err);
        }
    }

    console.log("✨ Cleanup complete!");
}

run();
