import glob from "fast-glob";
import { execa } from "execa";

const cwd = process.env.ENVR_CWD ?? process.cwd();

glob("**/*.{js,ts}", {
  cwd,
  onlyFiles: true,
  braceExpansion: true,
  dot: true,
  globstar: true,
  absolute: true,
  ignore: [
    "**/.cache/**",
    "**/.docusaurus/**",
    "**/.dynamodb/**",
    "**/.eslintcache/**",
    "**/.fusebox/**",
    "**/.next/**",
    "**/.nuxt/**",
    "**/.nyc_output/**",
    "**/.parcel-cache/**",
    "**/.serverless/**",
    "**/.stylelintcache/**",
    "**/.svelte-kit/**",
    "**/.temp/**",
    "**/.vuepress/**",
    "**/.webpack/**",
    "**/.yarn/**",
    "**/coverage/**",
    "**/dist/**",
    "**/jspm_packages/**",
    "**/lib-cov/**",
    "**/node_modules/**",
    "**/out/**",
  ].map((pattern) => pattern.replace(/\/$/, "")),
})
  .then((files) =>
    execa("grep", [
      "-roPh",
      "-e",
      "process\\.env\\.\\K[0-9a-zA-Z_]*",
      ...files,
    ]),
  )
  .then((result) => {
    const { stdout } = result;
    const variables = new Set(stdout.split("\n"));

    console.log(
      Array.from(variables)
        .sort()
        .map((env) => `${env}=`)
        .join("\n"),
    );
  })
  .catch(console.error);
