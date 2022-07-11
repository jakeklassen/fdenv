import glob from "fast-glob";
import { createReadStream } from "node:fs";
import readline from "node:readline";
import { CommonOptions } from "./types";

export const crawl = async ({ cwd = process.cwd() }: CommonOptions) => {
  return glob("**/*.{js,ts}", {
    cwd,
    onlyFiles: true,
    braceExpansion: true,
    dot: true,
    globstar: true,
    absolute: true,
    ignore: [
      "**/*.d.ts/**",
      "**/*.log/**",
      "**/.atom/**",
      "**/.cache/**",
      "**/.docusaurus/**",
      "**/.dynamodb/**",
      "**/.eslintcache/**",
      "**/.fusebox/**",
      "**/.grunt/**",
      "**/.lcov/**",
      "**/.next/**",
      "**/.nuxt/**",
      "**/.nyc_output/**",
      "**/.parcel-cache/**",
      "**/.pulumi/**",
      "**/.serverless/**",
      "**/.stylelintcache/**",
      "**/.svelte-kit/**",
      "**/.temp/**",
      "**/.vscode-server*/**",
      "**/.vuepress/**",
      "**/.webpack/**",
      "**/.yarn/**",
      "**/bower_components/**",
      "**/build/Release/**",
      "**/coverage/**",
      "**/dist/**",
      "**/jspm_packages/**",
      "**/lib-cov/**",
      "**/node_modules/**",
      "**/out/**",
    ].map((pattern) => pattern.replace(/\/$/, "")),
  }).then(async (files) => {
    const variables = new Set<string>();
    const regex = /process\.env\.(?<env>[0-9a-zA-Z_]*)/gim;

    for (const file of files) {
      await new Promise((resolve) => {
        readline
          .createInterface({
            input: createReadStream(file),
            terminal: false,
          })
          .on("line", (line) => {
            const matches = [...line.matchAll(regex)]
              .map((match) => match.groups?.env)
              .filter((match): match is string => match != null);

            for (const match of matches) {
              variables.add(match);
            }
          })
          .on("close", resolve);
      });
    }

    return Array.from(variables);
  });
};
