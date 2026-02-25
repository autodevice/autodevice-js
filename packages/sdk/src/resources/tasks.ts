import type { RequestFn } from "../types/common";
import type {
  TaskWithJobs,
  TaskJobDetail,
  CreateTaskParams,
  CreateTaskResponse,
  ListTasksParams,
  Task,
} from "../types/tasks";

export class TasksResource {
  constructor(private request: RequestFn) {}

  async list(
    params?: ListTasksParams
  ): Promise<{ tasks: Task[]; total_count: number; limit: number; offset: number }> {
    return this.request("GET", "/tasks", {
      query: {
        status: params?.status,
        limit: params?.limit,
        offset: params?.offset,
      },
    });
  }

  async get(taskId: string): Promise<TaskWithJobs> {
    const res = await this.request<{ task: TaskWithJobs }>(
      "GET",
      `/tasks/${taskId}`
    );
    return res.task;
  }

  async create(params: CreateTaskParams): Promise<CreateTaskResponse> {
    return this.request<CreateTaskResponse>("POST", "/tasks", {
      body: params,
    });
  }

  async job(taskId: string, jobId: string): Promise<TaskJobDetail> {
    const res = await this.request<{ job: TaskJobDetail }>(
      "GET",
      `/tasks/${taskId}/jobs/${jobId}`
    );
    return res.job;
  }

  /**
   * Poll a task until it reaches a terminal status.
   * Yields task updates as they occur.
   */
  async *watch(
    taskId: string,
    options?: { pollIntervalMs?: number; timeoutMs?: number }
  ): AsyncGenerator<TaskWithJobs> {
    const pollIntervalMs = options?.pollIntervalMs ?? 3000;
    const timeoutMs = options?.timeoutMs ?? 600_000;
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const task = await this.get(taskId);
      yield task;
      if (
        task.status === "completed" ||
        task.status === "failed" ||
        task.status === "cancelled"
      ) {
        return;
      }
      await new Promise((r) => setTimeout(r, pollIntervalMs));
    }
    throw new Error(`Timed out watching task ${taskId}`);
  }
}
