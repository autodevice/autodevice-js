export interface Task {
  id: string;
  source: string;
  prompt: string;
  status: string;
  created_at: string;
  completed_at: string | null;
}

export interface TaskJob {
  id: string;
  goal: string;
  platform: string;
  device_model: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  result_summary: string | null;
  error_message: string | null;
}

export interface TaskJobMessage {
  id: string;
  message_type: string;
  content: string;
  screenshot_url: string | null;
  metadata: object;
  created_at: string;
}

export interface TaskWithJobs extends Task {
  jobs: TaskJob[];
}

export interface TaskJobDetail extends TaskJob {
  messages: TaskJobMessage[];
}

export interface CreateTaskParams {
  app_id: string;
  goal: string;
  play_limit?: number;
  device_id?: string;
}

export interface CreateTaskResponse {
  task_id: string;
  task_job_id: string;
  status: string;
  session_uuid: string;
}

export interface ListTasksParams {
  status?: string;
  limit?: number;
  offset?: number;
}
