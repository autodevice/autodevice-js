import type { RequestFn } from "../types/common";
import type {
  Webhook,
  WebhookDelivery,
  CreateWebhookParams,
  UpdateWebhookParams,
  TestWebhookResponse,
} from "../types/webhooks";

export class WebhooksResource {
  constructor(private request: RequestFn) {}

  async list(suiteId: string): Promise<Webhook[]> {
    const res = await this.request<{ webhooks: Webhook[] }>(
      "GET",
      `/test-suites/${suiteId}/webhooks`
    );
    return res.webhooks;
  }

  async get(suiteId: string, webhookId: string): Promise<Webhook> {
    const res = await this.request<{ webhook: Webhook }>(
      "GET",
      `/test-suites/${suiteId}/webhooks/${webhookId}`
    );
    return res.webhook;
  }

  async create(
    suiteId: string,
    params: CreateWebhookParams
  ): Promise<Webhook> {
    const res = await this.request<{ webhook: Webhook }>(
      "POST",
      `/test-suites/${suiteId}/webhooks`,
      { body: params }
    );
    return res.webhook;
  }

  async update(
    suiteId: string,
    webhookId: string,
    params: UpdateWebhookParams
  ): Promise<Webhook> {
    const res = await this.request<{ webhook: Webhook }>(
      "PUT",
      `/test-suites/${suiteId}/webhooks/${webhookId}`,
      { body: params }
    );
    return res.webhook;
  }

  async delete(suiteId: string, webhookId: string): Promise<void> {
    await this.request(
      "DELETE",
      `/test-suites/${suiteId}/webhooks/${webhookId}`
    );
  }

  async test(
    suiteId: string,
    webhookId: string
  ): Promise<TestWebhookResponse> {
    return this.request<TestWebhookResponse>(
      "POST",
      `/test-suites/${suiteId}/webhooks/${webhookId}/test`
    );
  }

  async deliveries(
    suiteId: string,
    webhookId: string,
    params?: { limit?: number; offset?: number }
  ): Promise<{ deliveries: WebhookDelivery[]; total_count: number; limit: number; offset: number }> {
    return this.request(
      "GET",
      `/test-suites/${suiteId}/webhooks/${webhookId}/deliveries`,
      {
        query: {
          limit: params?.limit,
          offset: params?.offset,
        },
      }
    );
  }
}
