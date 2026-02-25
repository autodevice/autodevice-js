import Table from "cli-table3";
import chalk from "chalk";

interface TableConfig {
  columns: string[];
  truncate?: Record<string, number>;
}

interface OutputOptions {
  table?: TableConfig;
  formatter?: (data: unknown) => string;
}

export function output(
  cmd: { optsWithGlobals(): Record<string, unknown> },
  data: unknown,
  options?: OutputOptions
): void {
  const opts = cmd.optsWithGlobals();

  if (opts.json) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  if (options?.formatter) {
    console.log(options.formatter(data));
    return;
  }

  if (options?.table && Array.isArray(data)) {
    printTable(data, options.table);
    return;
  }

  console.log(JSON.stringify(data, null, 2));
}

function printTable(data: Record<string, unknown>[], config: TableConfig): void {
  if (data.length === 0) {
    console.log(chalk.dim("No results found."));
    return;
  }

  const table = new Table({
    head: config.columns.map((c) => chalk.bold(c)),
    style: { head: [], border: [] },
  });

  for (const row of data) {
    const values = config.columns.map((col) => {
      let val = String(row[col] ?? "");
      const maxLen = config.truncate?.[col];
      if (maxLen && val.length > maxLen) {
        val = val.slice(0, maxLen - 1) + "\u2026";
      }
      return val;
    });
    table.push(values);
  }

  console.log(table.toString());
}

export function errorOutput(error: unknown): void {
  if (error instanceof Error) {
    console.error(chalk.red(`Error: ${error.message}`));
  } else {
    console.error(chalk.red("An unknown error occurred"));
  }
}
