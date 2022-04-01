import { execa } from "execa";
import glob from "fast-glob";
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
  }).then((files) =>
    execa("grep", ["-roPh", "-e", "process\\.env\\.\\K[0-9a-zA-Z_]*", ...files])
      .then((result) => {
        const { stdout } = result;

        return Array.from(new Set<string>(stdout.split("\n"))).filter(
          (variable) => variable.trim().length > 0,
        );
      })
      .catch((error) => {
        // EXIT STATUS Normally the exit status is 0 if a line is selected,
        // 1 if no lines were selected, and 2 if an error occurred.
        if (error.exitCode === 1) {
          const { stdout } = error;

          return Array.from(new Set<string>(stdout.split("\n"))).filter(
            (variable) => variable.trim().length > 0,
          );
        }

        throw error;
      }),
  );
};
