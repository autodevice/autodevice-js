import type { RequestFn } from "../types/common";
import type {
  Target,
  CreateTargetParams,
  UpdateTargetParams,
} from "../types/targets";

export class TargetsResource {
  constructor(private request: RequestFn) {}

  async list(suiteId: string): Promise<Target[]> {
    const res = await this.request<{ targets: Target[] }>(
      "GET",
      `/test-suites/${suiteId}/targets`
    );
    return res.targets;
  }

  async create(
    suiteId: string,
    params: CreateTargetParams
  ): Promise<Target> {
    const res = await this.request<{ target: Target }>(
      "POST",
      `/test-suites/${suiteId}/targets`,
      { body: params }
    );
    return res.target;
  }

  async update(
    suiteId: string,
    targetId: string,
    params: UpdateTargetParams
  ): Promise<Target> {
    const res = await this.request<{ target: Target }>(
      "PUT",
      `/test-suites/${suiteId}/targets/${targetId}`,
      { body: params }
    );
    return res.target;
  }

  async delete(suiteId: string, targetId: string): Promise<void> {
    await this.request(
      "DELETE",
      `/test-suites/${suiteId}/targets/${targetId}`
    );
  }
}
