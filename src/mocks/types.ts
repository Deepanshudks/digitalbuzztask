export interface DateTimeWidgetProps {
  onChange?: (date: Date) => void;
}

export interface TimeState {
  hour: number;
  minute: number;
  period: "AM" | "PM";
}

export interface OptionType {
  label: string;
  value: string;
}

export interface MultiSelectDropdownProps {
  loadOptions: () => Promise<OptionType[]>;
  placeholder?: string;
  className?: string;
}

export interface FileObject {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview: string | null;
}

export interface MultiDocumentUploadProps {
  onFilesChange?: (files: FileObject[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export interface NotificationType {
  id: number;
  type: "info" | "success" | "error" | "warning";
  message: string;
  timestamp: Date;
}

export interface NotificationContextType {
  showNotification: (type: NotificationType["type"], message: string) => void;
  notifications: NotificationType[];
  removeNotification: (id: number) => void;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  sales: number;
}

export interface ChartWidgetProps {
  data?: ChartDataPoint[];
  title?: string;
  className?: string;
}

export interface DataItem {
  item: string;
  date: string;
  value: number;
  category: string;
}
