import type { RequestFn } from "../types/common";
import type {
  TestSuite,
  CreateSuiteParams,
  UpdateSuiteParams,
  RunSuiteParams,
  RunSuiteResponse,
} from "../types/suites";
import type { TestSuiteRun } from "../types/runs";
import type { FlowRun } from "../types/flow-runs";

export class SuitesResource {
  constructor(private request: RequestFn) {}

  async list(): Promise<TestSuite[]> {
    const res = await this.request<{ test_suites: TestSuite[] }>(
      "GET",
      "/test-suites"
    );
    return res.test_suites;
  }

  async get(suiteId: string): Promise<TestSuite> {
    const res = await this.request<{ test_suite: TestSuite }>(
      "GET",
      `/test-suites/${suiteId}`
    );
    return res.test_suite;
  }

  async create(params: CreateSuiteParams): Promise<TestSuite> {
    const res = await this.request<{ test_suite: TestSuite }>(
      "POST",
      "/test-suites",
      { body: params }
    );
    return res.test_suite;
  }

  async update(
    suiteId: string,
    params: UpdateSuiteParams
  ): Promise<TestSuite> {
    const res = await this.request<{ test_suite: TestSuite }>(
      "PUT",
      `/test-suites/${suiteId}`,
      { body: params }
    );
    return res.test_suite;
  }

  async delete(suiteId: string): Promise<void> {
    await this.request("DELETE", `/test-suites/${suiteId}`);
  }

  async run(
    suiteId: string,
    params: RunSuiteParams
  ): Promise<RunSuiteResponse> {
    return this.request<RunSuiteResponse>(
      "POST",
      `/test-suites/${suiteId}/run`,
      {
        body: {
          target_id: params.targetId,
          commit_sha: params.commitSha,
          repo_full_name: params.repoFullName,
          branch: params.branch,
        },
      }
    );
  }

  async runAndWait(
    suiteId: string,
    params: RunSuiteParams & {
      pollIntervalMs?: number;
      timeoutMs?: number;
    }
  ): Promise<{ run: TestSuiteRun; flowRuns: FlowRun[] }> {
    const {
      pollIntervalMs = 3000,
      timeoutMs = 600_000,
      ...runParams
    } = params;
    const result = await this.run(suiteId, runParams);

    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, pollIntervalMs));
      const run = await this.request<{ test_suite_run: TestSuiteRun }>(
        "GET",
        `/test-suite-runs/${result.test_suite_run_id}`
      );
      if (
        run.test_suite_run.status === "completed" ||
        run.test_suite_run.status === "failed"
      ) {
        const flowRunsRes = await this.request<{ flow_runs: FlowRun[] }>(
          "GET",
          `/test-suite-runs/${result.test_suite_run_id}/flows`
        );
        return { run: run.test_suite_run, flowRuns: flowRunsRes.flow_runs };
      }
    }
    throw new Error(
      `Timed out waiting for suite run ${result.test_suite_run_id}`
    );
  }
}
