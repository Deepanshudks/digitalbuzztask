import type { DataItem } from "./types";

export interface OptionType {
  label: string;
  value: string;
}

export const dropdownLoadOptions: OptionType[] = [
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Office Space", value: "office_space" },
  { label: "Retail Shop", value: "retail_shop" },
  { label: "Warehouse", value: "warehouse" },
];

export interface DocumentType {
  name: string;
  file: File;
}

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const sampleData: DataItem[] = [
  { item: "Item 1", date: "2025-09-01", value: 400, category: "A" },
  { item: "Item 2", date: "2025-09-05", value: 300, category: "B" },
  { item: "Item 3", date: "2025-09-10", value: 200, category: "A" },
  { item: "Item 4", date: "2025-09-15", value: 278, category: "B" },
  { item: "Item 5", date: "2025-09-20", value: 189, category: "A" },
  { item: "Item 6", date: "2025-09-25", value: 239, category: "B" },
];
