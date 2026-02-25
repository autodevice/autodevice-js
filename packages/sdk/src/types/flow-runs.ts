export interface FlowRun {
  id: string;
  status: string;
  flow_id: string;
  test_suite_run_id: string | null;
  test_suite_target_id: string | null;
  initiated_by: string;
  initiated_at: string;
  completed_at: string | null;
  outcome: "pass" | "fail" | null;
  outcome_summary: string | null;
  duration_ms: number | null;
  device_type: string | null;
  device_os: string | null;
  screenshot_url: string | null;
  flow?: { id: string; name: string };
}

export interface FlowRunDetail extends FlowRun {
  steps?: FlowRunStep[];
}

export interface Subaction {
  id: string;
  step_id: string;
  step_number: number;
  total_steps: number | null;
  action_type: string;
  action_description: string;
  action_parameters: object | null;
  reasoning: string | null;
  action_success: boolean;
  error_message: string | null;
  screenshot_url: string | null;
  screen_change_detected: boolean | null;
  created_at: string;
}

export interface FlowRunStep {
  id: string;
  status: string;
  flow_run_id: string;
  flow_step_id: string | null;
  step_no: number;
  duration_ms: number | null;
  created_at: string;
  completed_at: string | null;
  error_message: string | null;
  original_instruction: string | null;
  action_type: string | null;
  action_descriptor: string | null;
  screenshot_url: string | null;
  subactions: Subaction[];
}

export interface ListFlowRunsParams {
  flow_id?: string;
  test_suite_run_id?: string;
  status?: string;
  outcome?: string;
  limit?: number;
  offset?: number;
}
