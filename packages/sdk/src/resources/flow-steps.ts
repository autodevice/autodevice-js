import type { RequestFn } from "../types/common";
import type {
  FlowStep,
  CreateFlowStepParams,
  UpdateFlowStepParams,
} from "../types/flows";

export class FlowStepsResource {
  constructor(private request: RequestFn) {}

  async list(flowId: string): Promise<FlowStep[]> {
    const res = await this.request<{ steps: FlowStep[] }>(
      "GET",
      `/flows/${flowId}/steps`
    );
    return res.steps;
  }

  async create(
    flowId: string,
    params: CreateFlowStepParams
  ): Promise<FlowStep> {
    const res = await this.request<{ step: FlowStep }>(
      "POST",
      `/flows/${flowId}/steps`,
      { body: params }
    );
    return res.step;
  }

  async update(
    flowId: string,
    stepId: string,
    params: UpdateFlowStepParams
  ): Promise<FlowStep> {
    const res = await this.request<{ step: FlowStep }>(
      "PUT",
      `/flows/${flowId}/steps/${stepId}`,
      { body: params }
    );
    return res.step;
  }

  async delete(flowId: string, stepId: string): Promise<void> {
    await this.request("DELETE", `/flows/${flowId}/steps/${stepId}`);
  }
}
