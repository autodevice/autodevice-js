export interface Flow {
  id: string;
  name: string;
  description: string | null;
  status: "draft" | "active" | "archived";
  test_suite_id: string;
  setup_test_target: string | null;
  execution_order: number;
  deep_link: string | null;
  model_choice: string | null;
  created_at: string;
  updated_at: string;
}

export interface FlowStep {
  id: string;
  flow_id: string;
  step_no: number;
  instruction: string;
  action_type_hint: string | null;
  target_element_hint: string | null;
  expected_outcome: string | null;
  timeout_ms: number | null;
  is_optional: boolean;
  continue_on_failure: boolean;
  created_at: string;
  updated_at: string;
}

export interface FlowWithSteps extends Flow {
  steps: FlowStep[];
}

export interface CreateFlowParams {
  name: string;
  test_suite_id: string;
  target_id: string;
  description?: string;
}

export interface UpdateFlowParams {
  name?: string;
  description?: string;
  status?: "draft" | "active" | "archived";
  setup_test_target?: string;
  execution_order?: number;
  deep_link?: string;
  model_choice?: string;
}

export interface ListFlowsParams {
  test_suite_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface RunFlowResponse {
  flow_run_id: string;
  status: string;
  session_uuid: string;
}

export interface CreateFlowStepParams {
  instruction: string;
  action_type_hint?: string;
  target_element_hint?: string;
  expected_outcome?: string;
  timeout_ms?: number;
  is_optional?: boolean;
  continue_on_failure?: boolean;
}

export interface UpdateFlowStepParams {
  instruction?: string;
  action_type_hint?: string;
  target_element_hint?: string;
  expected_outcome?: string;
  timeout_ms?: number;
  is_optional?: boolean;
  continue_on_failure?: boolean;
}
