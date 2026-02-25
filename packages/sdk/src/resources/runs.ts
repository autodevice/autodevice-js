import type { RequestFn } from "../types/common";
import type { TestSuiteRun, ListRunsParams, WaitOptions } from "../types/runs";
import type { FlowRun } from "../types/flow-runs";

export class RunsResource {
  constructor(private request: RequestFn) {}

  async list(
    params?: ListRunsParams
  ): Promise<{ test_suite_runs: TestSuiteRun[]; total_count: number; limit: number; offset: number }> {
    return this.request("GET", "/test-suite-runs", {
      query: {
        test_suite_id: params?.test_suite_id,
        status: params?.status,
        outcome: params?.outcome,
        limit: params?.limit,
        offset: params?.offset,
      },
    });
  }

  async get(runId: string): Promise<TestSuiteRun> {
    const res = await this.request<{ test_suite_run: TestSuiteRun }>(
      "GET",
      `/test-suite-runs/${runId}`
    );
    return res.test_suite_run;
  }

  async flows(runId: string): Promise<FlowRun[]> {
    const res = await this.request<{ flow_runs: FlowRun[] }>(
      "GET",
      `/test-suite-runs/${runId}/flows`
    );
    return res.flow_runs;
  }

  async wait(
    runId: string,
    options?: WaitOptions
  ): Promise<TestSuiteRun> {
    const pollIntervalMs = options?.pollIntervalMs ?? 3000;
    const timeoutMs = options?.timeoutMs ?? 600_000;
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const run = await this.get(runId);
      if (run.status === "completed" || run.status === "failed") {
        return run;
      }
      await new Promise((r) => setTimeout(r, pollIntervalMs));
    }
    throw new Error(`Timed out waiting for run ${runId}`);
  }
}
