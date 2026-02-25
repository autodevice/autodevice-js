export interface TestSuiteRun {
  id: string;
  status: "running" | "completed" | "failed";
  test_suite_id: string;
  test_suite_target_id: string;
  initiated_by: string;
  initiated_at: string;
  completed_at: string | null;
  outcome: "pass" | "fail" | null;
  outcome_summary: string | null;
  total_flows: number;
  passed_flows: number;
  failed_flows: number;
  skipped_flows: number;
  duration_ms: number | null;
  commit_sha: string | null;
  repo_full_name: string | null;
  branch: string | null;
  test_suite?: { id: string; name: string };
}

export interface ListRunsParams {
  test_suite_id?: string;
  status?: string;
  outcome?: string;
  limit?: number;
  offset?: number;
}

export interface WaitOptions {
  pollIntervalMs?: number;
  timeoutMs?: number;
}
