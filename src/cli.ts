import { oraPromise } from "ora";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import pkg from "../package.json";
import { crawl } from "./glob";

const args = yargs(hideBin(process.argv))
  .scriptName("fdenv")
  .usage("$0 [args]")
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
  })
  .command("$0", "")
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
