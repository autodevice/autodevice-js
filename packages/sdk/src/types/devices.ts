export interface DeviceOption {
  id: string;
  value: string;
  label: string;
  height: number;
  width: number;
  supportedVersions: string[];
  imageVariantsByVersion: Record<string, string[]>;
}

export interface DeviceList {
  android?: DeviceOption[];
  ios?: DeviceOption[];
}
