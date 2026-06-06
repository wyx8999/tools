export type ToolCategory = 'query' | 'content' | 'ai' | 'entertainment' | 'hot';

export type FieldType = 'text' | 'textarea' | 'select' | 'number';

export interface ToolField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: Array<{ label: string; value: string }>;
}

export interface ToolConfig {
  id: string;
  name: string;
  shortName: string;
  category: ToolCategory;
  description: string;
  accent: string;
  fields: ToolField[];
  resultHint: string;
  risk?: 'normal' | 'caution' | 'restricted';
  hiddenByDefault?: boolean;
}

export interface ProxyResponse {
  ok: boolean;
  status: number;
  contentType: string;
  data: unknown;
  error?: string;
}
