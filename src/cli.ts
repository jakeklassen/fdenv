import type { Argv } from "yargs";
import yargs from "yargs";
import pc from "picocolors";
import { CommonOptions } from "./types";

function commonOptions(
  args: Argv<Record<string, unknown>>,
): Argv<CommonOptions> {
  return args
    .option("recursive", {
      alias: "r",
      type: "boolean",
      default: false,
      description: "Recursively search directories",
    })
    .option("path", {
      alias: "p",
      type: "string",
      default: ".",
      description: "Path to search",
    });
}

yargs
  .scriptName("envr")
  .usage("$0 [args]")
  .command("hello", "say hello", commonOptions, (args) => {
    console.log(args);
    console.log(pc.green("hello 👋"));
  })
  .showHelpOnFail(false)
  .alias("h", "help")
  .alias("v", "version")
  .help().argv;
