export interface TestSuite {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "archived";
  parallel_execution: boolean;
  stop_on_failure: boolean;
  timeout_ms: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSuiteParams {
  name: string;
  description?: string;
  parallel_execution?: boolean;
  stop_on_failure?: boolean;
  timeout_ms?: number;
}

export interface UpdateSuiteParams {
  name?: string;
  description?: string;
  parallel_execution?: boolean;
  stop_on_failure?: boolean;
  timeout_ms?: number;
}

export interface RunSuiteParams {
  targetId: string;
  commitSha?: string;
  repoFullName?: string;
  branch?: string;
}

export interface RunSuiteResponse {
  test_suite_run_id: string;
  status: string;
  flow_run_ids: string[];
  dashboard_url: string;
}
