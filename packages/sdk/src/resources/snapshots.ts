import type { RequestFn } from "../types/common";
import type { Snapshot } from "../types/snapshots";

export class SnapshotsResource {
  constructor(private request: RequestFn) {}

  async list(): Promise<Snapshot[]> {
    const res = await this.request<{ snapshots: Snapshot[] }>(
      "GET",
      "/snapshots"
    );
    return res.snapshots;
  }

  async get(snapshotId: string): Promise<Snapshot> {
    const res = await this.request<{ snapshot: Snapshot }>(
      "GET",
      `/snapshots/${snapshotId}`
    );
    return res.snapshot;
  }

  async delete(snapshotId: string): Promise<void> {
    await this.request("DELETE", `/snapshots/${snapshotId}`);
  }
}
