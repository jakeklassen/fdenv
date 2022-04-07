import { oraPromise } from "ora";
import type { Argv } from "yargs";
import yargs from "yargs";
import pkg from "../package.json";
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

const args = yargs(process.argv.slice(2))
  .scriptName("fdenv")
  .usage("$0 [args]")
  .command("$0", "", commonOptions)
  .showHelpOnFail(false)
  .version(pkg.version)
  .alias("h", "help")
  .alias("v", "version")
  .help()
  .parseSync();

oraPromise(crawl({ cwd: args.cwd }), {
  text: "Searching for variables...",
})
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
