export interface Webhook {
  id: string;
  name: string;
  type: "slack" | "github" | "generic";
  url: string | null;
  events: string[];
  is_active: boolean;
  config: object | null;
  last_delivery_at: string | null;
  last_delivery_status: string | null;
  consecutive_failures: number;
  created_at: string;
  updated_at: string;
}

export interface WebhookDelivery {
  id: string;
  event: string;
  test_suite_run_id: string | null;
  request_payload: object;
  response_status: number | null;
  status: string;
  attempts: number;
  created_at: string;
  delivered_at: string | null;
}

export interface CreateWebhookParams {
  name: string;
  type: "slack" | "github" | "generic";
  url?: string;
  config?: object;
  events?: string[];
}

export interface UpdateWebhookParams {
  name?: string;
  url?: string;
  config?: object;
  events?: string[];
  is_active?: boolean;
}

export interface TestWebhookResponse {
  success: boolean;
  status_code: number;
  error?: string;
}
