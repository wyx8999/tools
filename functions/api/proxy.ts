interface Env {
  XIAOYU_API_KEY: string;
  XIAOYU_API_BASE?: string;
}

interface ProxyRequestBody {
  tool?: string;
  params?: Record<string, unknown>;
}

interface ToolRoute {
  endpoint: string;
  method: 'GET' | 'POST';
  allowedParams: string[];
  requiredAny?: string[];
}

const routes: Record<string, ToolRoute> = {
  weather: {
    endpoint: 'weather.php',
    method: 'GET',
    allowedParams: ['city', 'lat', 'lon'],
    requiredAny: ['city', 'lat'],
  },
  ip: {
    endpoint: 'ipxx.php',
    method: 'GET',
    allowedParams: ['ip'],
    requiredAny: ['ip'],
  },
  oil: {
    endpoint: 'yjcx.php',
    method: 'GET',
    allowedParams: ['city'],
    requiredAny: ['city'],
  },
  daily60s: {
    endpoint: '60s.php',
    method: 'GET',
    allowedParams: ['type'],
  },
  history: {
    endpoint: 'lssdjt.php',
    method: 'GET',
    allowedParams: ['type'],
  },
  hot: {
    endpoint: 'jhrs.php',
    method: 'GET',
    allowedParams: ['type', 'backtype'],
    requiredAny: ['type'],
  },
  'text-check': {
    endpoint: 'txtjc.php',
    method: 'GET',
    allowedParams: ['text'],
    requiredAny: ['text'],
  },
  tts: {
    endpoint: 'xytts.php',
    method: 'GET',
    allowedParams: ['type', 'word', 'id'],
    requiredAny: ['type', 'word'],
  },
  'ai-chat': {
    endpoint: 'aichat.php',
    method: 'GET',
    allowedParams: ['message', 'id', 'system'],
    requiredAny: ['message'],
  },
  'ai-image': {
    endpoint: 'aist.php',
    method: 'GET',
    allowedParams: ['msg', 'style', 'size', 'aibc'],
    requiredAny: ['msg'],
  },
};

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });
}

function cleanParams(input: Record<string, unknown>, allowedParams: string[]) {
  const params: Record<string, string> = {};

  for (const key of allowedParams) {
    const value = input[key];
    if (typeof value === 'string' && value.trim() !== '') {
      params[key] = value.trim();
    }
  }

  return params;
}

function hasRequiredParams(params: Record<string, string>, requiredAny?: string[]) {
  if (!requiredAny || requiredAny.length === 0) {
    return true;
  }

  return requiredAny.some((name) => params[name]);
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: jsonHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, status: 405, contentType: 'application/json', data: null, error: '仅支持 POST 请求' }, 405);
  }

  if (!env.XIAOYU_API_KEY) {
    return jsonResponse({
      ok: false,
      status: 500,
      contentType: 'application/json',
      data: null,
      error: '服务端未配置 XIAOYU_API_KEY。请在 Cloudflare Pages 的环境变量中添加该变量并重新部署。',
    }, 500);
  }

  let body: ProxyRequestBody;

  try {
    body = await request.json<ProxyRequestBody>();
  } catch {
    return jsonResponse({ ok: false, status: 400, contentType: 'application/json', data: null, error: '请求体不是有效 JSON' }, 400);
  }

  const route = body.tool ? routes[body.tool] : undefined;

  if (!route) {
    return jsonResponse({ ok: false, status: 404, contentType: 'application/json', data: null, error: '工具不存在或未开放' }, 404);
  }

  const params = cleanParams(body.params ?? {}, route.allowedParams);

  if (!hasRequiredParams(params, route.requiredAny)) {
    return jsonResponse({ ok: false, status: 400, contentType: 'application/json', data: null, error: '缺少必要参数' }, 400);
  }

  const base = (env.XIAOYU_API_BASE || 'https://api.xiaoyu17love.top/API').replace(/\/$/, '');
  const url = new URL(`${base}/${route.endpoint}`);
  url.searchParams.set('apikey', env.XIAOYU_API_KEY);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  try {
    const upstream = await fetchWithTimeout(url.toString(), { method: route.method }, 18000);
    const contentType = upstream.headers.get('content-type') || 'text/plain';

    if (contentType.startsWith('image/')) {
      const buffer = await upstream.arrayBuffer();
      const data = `data:${contentType};base64,${arrayBufferToBase64(buffer)}`;

      return jsonResponse({
        ok: upstream.ok,
        status: upstream.status,
        contentType,
        data,
        error: upstream.ok ? undefined : mapStatusToMessage(upstream.status),
      }, upstream.ok ? 200 : upstream.status);
    }

    const text = await upstream.text();

    let data: unknown = text;
    if (contentType.includes('application/json') || text.trim().startsWith('{') || text.trim().startsWith('[')) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    return jsonResponse({
      ok: upstream.ok,
      status: upstream.status,
      contentType,
      data,
      error: upstream.ok ? undefined : mapStatusToMessage(upstream.status),
    }, upstream.ok ? 200 : upstream.status);
  } catch (error) {
    return jsonResponse({
      ok: false,
      status: 0,
      contentType: 'application/json',
      data: null,
      error: error instanceof Error && error.name === 'AbortError' ? '上游接口超时' : '上游接口请求失败',
    }, 502);
  }
};

function mapStatusToMessage(status: number) {
  switch (status) {
    case 403:
      return 'API 密钥无效或无权限';
    case 404:
      return '上游接口不存在';
    case 429:
      return '调用过于频繁，请稍后再试';
    case 500:
      return '上游服务异常';
    default:
      return `上游接口返回 ${status}`;
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}
