import type { ProxyResponse } from '../types';

export async function callTool(tool: string, params: Record<string, string>): Promise<ProxyResponse> {
  const response = await fetch('/api/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool, params }),
  });

  const payload = (await response.json()) as ProxyResponse;
  return payload;
}
