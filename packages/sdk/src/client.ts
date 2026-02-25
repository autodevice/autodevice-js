import { AppsResource } from "./resources/apps";
import { DevicesResource } from "./resources/devices";
import { SuitesResource } from "./resources/suites";
import { TargetsResource } from "./resources/targets";
import { FlowsResource } from "./resources/flows";
import { FlowStepsResource } from "./resources/flow-steps";
import { RunsResource } from "./resources/runs";
import { FlowRunsResource } from "./resources/flow-runs";
import { WebhooksResource } from "./resources/webhooks";
import { TasksResource } from "./resources/tasks";
import { SnapshotsResource } from "./resources/snapshots";
import {
  AutoDeviceError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
} from "./errors";

export interface ClientOptions {
  /** API key (sk_live_... or sk_test_...). Falls back to AUTODEVICE_API_KEY env var. */
  apiKey?: string;
  /** Base URL. Defaults to https://autodevice.io/api/v1. Falls back to AUTODEVICE_BASE_URL env var. */
  baseUrl?: string;
  /** Request timeout in ms. Default: 30000 */
  timeout?: number;
  /** Custom fetch implementation (for testing or non-Node environments) */
  fetch?: typeof globalThis.fetch;
}

export class AutoDeviceClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly _fetch: typeof globalThis.fetch;

  readonly apps: AppsResource;
  readonly devices: DevicesResource;
  readonly suites: SuitesResource;
  readonly targets: TargetsResource;
  readonly flows: FlowsResource;
  readonly flowSteps: FlowStepsResource;
  readonly runs: RunsResource;
  readonly flowRuns: FlowRunsResource;
  readonly webhooks: WebhooksResource;
  readonly tasks: TasksResource;
  readonly snapshots: SnapshotsResource;

  constructor(options: ClientOptions = {}) {
    this.apiKey =
      options.apiKey ?? process.env.AUTODEVICE_API_KEY ?? "";

    if (!this.apiKey) {
      throw new Error(
        "API key required. Pass { apiKey } or set AUTODEVICE_API_KEY env var."
      );
    }

    this.baseUrl = (
      options.baseUrl ??
      process.env.AUTODEVICE_BASE_URL ??
      "https://autodevice.io/api/v1"
    ).replace(/\/+$/, "");

    this.timeout = options.timeout ?? 30_000;
    this._fetch = options.fetch ?? globalThis.fetch;

    const req = this.request.bind(this);
    this.apps = new AppsResource(req);
    this.devices = new DevicesResource(req);
    this.suites = new SuitesResource(req);
    this.targets = new TargetsResource(req);
    this.flows = new FlowsResource(req);
    this.flowSteps = new FlowStepsResource(req);
    this.runs = new RunsResource(req);
    this.flowRuns = new FlowRunsResource(req);
    this.webhooks = new WebhooksResource(req);
    this.tasks = new TasksResource(req);
    this.snapshots = new SnapshotsResource(req);
  }

  async request<T>(
    method: string,
    path: string,
    options?: {
      body?: unknown;
      query?: Record<string, string | number | boolean | undefined>;
      timeout?: number;
    }
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);

    if (options?.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      options?.timeout ?? this.timeout
    );

    try {
      const response = await this._fetch(url.toString(), {
        method,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "autodevice-sdk/0.1.0",
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
          (errorBody as Record<string, string>).error ||
          `HTTP ${response.status}`;

        if (response.status === 401) throw new AuthenticationError(message);
        if (response.status === 404) throw new NotFoundError(message);
        if (response.status === 429) throw new RateLimitError(message);
        throw new AutoDeviceError(message, response.status, errorBody);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof AutoDeviceError) throw error;
      if ((error as Error).name === "AbortError") {
        throw new AutoDeviceError("Request timed out", 0);
      }
      throw error;
    }
  }
}
