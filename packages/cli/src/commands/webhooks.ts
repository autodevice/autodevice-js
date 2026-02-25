import { Command } from "commander";
import { getClient } from "../client";
import { output, errorOutput } from "../output";

export function registerWebhooksCommand(program: Command) {
  const webhooks = program
    .command("webhooks")
    .description("Manage webhooks");

  webhooks
    .command("list <suite-id>")
    .description("List webhooks for a suite")
    .action(async (suiteId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.webhooks.list(suiteId);
        output(cmd, result, {
          table: {
            columns: ["id", "name", "type", "is_active", "url"],
            truncate: { url: 40 },
          },
        });
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  webhooks
    .command("get <suite-id> <webhook-id>")
    .description("Get webhook detail")
    .action(async (suiteId, webhookId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.webhooks.get(suiteId, webhookId);
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  webhooks
    .command("create <suite-id>")
    .description("Create a webhook")
    .requiredOption("--name <name>", "Webhook name")
    .requiredOption("--type <slack|github|generic>", "Webhook type")
    .option("--url <url>", "Webhook URL")
    .option("--events <events>", "Comma-separated event list")
    .action(async (suiteId, opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.webhooks.create(suiteId, {
          name: opts.name,
          type: opts.type,
          url: opts.url,
          events: opts.events ? opts.events.split(",") : undefined,
        });
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  webhooks
    .command("update <suite-id> <webhook-id>")
    .description("Update a webhook")
    .option("--name <name>", "Webhook name")
    .option("--url <url>", "Webhook URL")
    .option("--events <events>", "Comma-separated event list")
    .option("--active", "Activate webhook")
    .option("--no-active", "Deactivate webhook")
    .action(async (suiteId, webhookId, opts, cmd) => {
      try {
        const client = getClient(cmd);
        const params: Record<string, unknown> = {};
        if (opts.name) params.name = opts.name;
        if (opts.url) params.url = opts.url;
        if (opts.events) params.events = opts.events.split(",");
        if (opts.active !== undefined) params.is_active = opts.active;
        const result = await client.webhooks.update(
          suiteId,
          webhookId,
          params
        );
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  webhooks
    .command("delete <suite-id> <webhook-id>")
    .description("Delete a webhook")
    .action(async (suiteId, webhookId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        await client.webhooks.delete(suiteId, webhookId);
        console.log(`Webhook ${webhookId} deleted.`);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  webhooks
    .command("test <suite-id> <webhook-id>")
    .description("Send a test webhook delivery")
    .action(async (suiteId, webhookId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.webhooks.test(suiteId, webhookId);
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  webhooks
    .command("deliveries <suite-id> <webhook-id>")
    .description("List webhook deliveries")
    .option("--limit <n>", "Limit results")
    .option("--offset <n>", "Offset results")
    .action(async (suiteId, webhookId, opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.webhooks.deliveries(suiteId, webhookId, {
          limit: opts.limit ? parseInt(opts.limit) : undefined,
          offset: opts.offset ? parseInt(opts.offset) : undefined,
        });
        output(cmd, result.deliveries, {
          table: {
            columns: ["id", "event", "status", "response_status", "attempts", "created_at"],
          },
        });
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });
}
