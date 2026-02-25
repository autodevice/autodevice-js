import type { RequestFn } from "../types/common";
import type {
  Flow,
  FlowWithSteps,
  CreateFlowParams,
  UpdateFlowParams,
  ListFlowsParams,
  RunFlowResponse,
} from "../types/flows";

export class FlowsResource {
  constructor(private request: RequestFn) {}

  async list(
    params?: ListFlowsParams
  ): Promise<{ flows: Flow[]; total_count: number; limit: number; offset: number }> {
    return this.request("GET", "/flows", {
      query: {
        test_suite_id: params?.test_suite_id,
        status: params?.status,
        limit: params?.limit,
        offset: params?.offset,
      },
    });
  }

  async get(flowId: string): Promise<FlowWithSteps> {
    const res = await this.request<{ flow: FlowWithSteps }>(
      "GET",
      `/flows/${flowId}`
    );
    return res.flow;
  }

  async create(params: CreateFlowParams): Promise<Flow> {
    const res = await this.request<{ flow: Flow }>("POST", "/flows", {
      body: params,
    });
    return res.flow;
  }

  async update(flowId: string, params: UpdateFlowParams): Promise<Flow> {
    const res = await this.request<{ flow: Flow }>(
      "PUT",
      `/flows/${flowId}`,
      { body: params }
    );
    return res.flow;
  }

  async delete(flowId: string): Promise<void> {
    await this.request("DELETE", `/flows/${flowId}`);
  }

  async run(
    flowId: string,
    params: { target_id: string }
  ): Promise<RunFlowResponse> {
    return this.request<RunFlowResponse>("POST", `/flows/${flowId}/run`, {
      body: params,
    });
  }
}
