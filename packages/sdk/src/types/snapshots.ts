export interface Snapshot {
  id: string;
  name: string;
  description: string | null;
  snapshot_id: string;
  device_type: string;
  os_version: string;
  platform: string;
  created_at: string;
}
