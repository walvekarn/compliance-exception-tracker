import type { Vendor } from "@/types/vendor";
import { seedVendors } from "./seed";

const vendors: Vendor[] = [...seedVendors];

export function getAllVendors(): Vendor[] {
  return [...vendors];
}

export function getVendorById(id: string): Vendor | undefined {
  return vendors.find((v) => v.id === id);
}
