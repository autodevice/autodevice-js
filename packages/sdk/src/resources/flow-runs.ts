import type { RequestFn } from "../types/common";
import type {
  FlowRun,
  FlowRunDetail,
  FlowRunStep,
  ListFlowRunsParams,
} from "../types/flow-runs";

export class FlowRunsResource {
  constructor(private request: RequestFn) {}

  async list(
    params?: ListFlowRunsParams
  ): Promise<{ flow_runs: FlowRun[]; total_count: number; limit: number; offset: number }> {
    return this.request("GET", "/flow-runs", {
      query: {
        flow_id: params?.flow_id,
        test_suite_run_id: params?.test_suite_run_id,
        status: params?.status,
        outcome: params?.outcome,
        limit: params?.limit,
        offset: params?.offset,
      },
    });
  }

  async get(runId: string): Promise<FlowRunDetail> {
    const res = await this.request<{ flow_run: FlowRunDetail }>(
      "GET",
      `/flow-runs/${runId}`
    );
    return res.flow_run;
  }

  async steps(runId: string): Promise<FlowRunStep[]> {
    const res = await this.request<{ steps: FlowRunStep[] }>(
      "GET",
      `/flow-runs/${runId}/steps`
    );
    return res.steps;
  }
}
