import { Command } from "commander";
import ora from "ora";
import chalk from "chalk";
import { getClient } from "../client";
import { output, errorOutput } from "../output";

export function registerTasksCommand(program: Command) {
  const tasks = program.command("tasks").description("Manage AI task agents");

  tasks
    .command("create")
    .description("Start an AI task agent")
    .requiredOption("--app <app-id>", "App ID")
    .requiredOption("--goal <goal>", "Task goal")
    .option("--device <device-id>", "Device ID")
    .option("--play-limit <seconds>", "Time limit (default: 60, max: 300)")
    .action(async (opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.tasks.create({
          app_id: opts.app,
          goal: opts.goal,
          device_id: opts.device,
          play_limit: opts.playLimit ? parseInt(opts.playLimit) : undefined,
        });
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  tasks
    .command("list")
    .description("List tasks")
    .option("--status <status>", "Filter by status")
    .option("--limit <n>", "Limit results")
    .option("--offset <n>", "Offset results")
    .action(async (opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.tasks.list({
          status: opts.status,
          limit: opts.limit ? parseInt(opts.limit) : undefined,
          offset: opts.offset ? parseInt(opts.offset) : undefined,
        });
        output(cmd, result.tasks, {
          table: {
            columns: ["id", "status", "prompt", "created_at"],
            truncate: { prompt: 50 },
          },
        });
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  tasks
    .command("get <task-id>")
    .description("Get task with jobs")
    .action(async (taskId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.tasks.get(taskId);
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  tasks
    .command("job <task-id> <job-id>")
    .description("Get job detail with messages")
    .action(async (taskId, jobId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.tasks.job(taskId, jobId);
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  tasks
    .command("watch <task-id>")
    .description("Stream task progress")
    .option("--timeout <ms>", "Timeout in milliseconds", "600000")
    .action(async (taskId, opts, cmd) => {
      try {
        const client = getClient(cmd);
        const spinner = ora("Watching task...").start();

        for await (const task of client.tasks.watch(taskId, {
          timeoutMs: parseInt(opts.timeout),
        })) {
          spinner.text = `Task ${task.id}: ${task.status}`;
          if (task.jobs?.length) {
            const job = task.jobs[task.jobs.length - 1];
            spinner.text += ` | Job: ${job.status}`;
          }
        }
        spinner.stop();

        const finalTask = await client.tasks.get(taskId);
        const statusColor =
          finalTask.status === "completed" ? chalk.green : chalk.red;
        console.log(`Task ${finalTask.id}: ${statusColor(finalTask.status)}`);

        if (finalTask.jobs?.length) {
          for (const job of finalTask.jobs) {
            console.log(
              `  Job ${job.id}: ${job.status}${job.result_summary ? ` - ${job.result_summary}` : ""}`
            );
          }
        }

        output(cmd, finalTask);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });
}
