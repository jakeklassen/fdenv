import type { Argv } from "yargs";
import yargs from "yargs";
import { crawl } from "./glob";
import { CommonOptions } from "./types";

function commonOptions(
  args: Argv<Record<string, unknown>>,
): Argv<CommonOptions> {
  return args
    .option("append", {
      alias: "a",
      type: "string",
      default: "",
      description: "Append string to variable output (e.g. '=')",
    })
    .option("cwd", {
      alias: "c",
      type: "string",
      default: ".",
      description: "Path to search",
    });
}

const args = yargs
  .scriptName("fdenv")
  .usage("$0 [args]")
  .command("$0", "", commonOptions)
  .showHelpOnFail(false)
  .alias("h", "help")
  .alias("v", "version")
  .help()
  .parseSync();

crawl({ cwd: args.cwd })
  .then((results) => {
    const { append } = args;

    console.log(
      results
        .sort()
        .map((env) => `${env}${append}`)
        .join("\n"),
    );
  })
  .catch(console.error);
