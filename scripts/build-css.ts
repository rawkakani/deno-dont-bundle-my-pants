// Panda CSS build script for Deno using PostCSS
// First run codegen to generate styled-system JS files, then build CSS
import postcss from "npm:postcss@8.4.0";
// No need for external exec - use Deno.run directly

await Deno.mkdir("dist", { recursive: true });
await Deno.mkdir("styled-system", { recursive: true });

// First, run codegen using PandaCSS CLI
console.log("Running Panda CSS codegen...");
try {
  const codegenProcess = Deno.run({
    cmd: [
      "deno",
      "run",
      "-A",
      "npm:@pandacss/dev@1.4.3/panda",
      "codegen",
      "--config",
      "panda.config.js",
    ],
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await codegenProcess.status();
  const stdout = new TextDecoder().decode(await codegenProcess.output());
  const stderr = new TextDecoder().decode(await codegenProcess.stderrOutput());
  codegenProcess.close();

  if (code !== 0) {
    console.error("Codegen failed:", stderr);
    Deno.exit(1);
  }
  console.log(stdout);
} catch (error) {
  console.error("Codegen error:", error);
  Deno.exit(1);
}

// Then build CSS with PostCSS
const pandaPostcssModule = await import("npm:@pandacss/dev@1.4.3/postcss");
const pandaPostcss = pandaPostcssModule.default;

// Read the source CSS file (contains @layer directives)
const input = await Deno.readTextFile("./src/styles.css");

// Configure Panda PostCSS plugin with explicit config
const plugin = pandaPostcss({
  configPath: "./panda.config.js",
});

// Process with PostCSS (generates CSS from the codegen'd system)
const result = await postcss([plugin]).process(input, {
  from: "./src/styles.css",
  to: "./dist/styles.css",
});

// Write the processed CSS
await Deno.writeTextFile("./dist/styles.css", result.css);

if (result.map) {
  await Deno.writeTextFile("./dist/styles.css.map", result.map.toString());
}

console.log("? CSS built with Panda CSS");
