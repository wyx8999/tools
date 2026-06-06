interface Env {
  XIAOYU_API_KEY: string;
  XIAOYU_API_BASE?: string;
  ENABLE_RESTRICTED_TOOLS?: string;
}

interface ProxyRequestBody {
  tool?: string;
  params?: Record<string, unknown>;
}

interface ToolRoute {
  endpoint: string;
  method: 'GET' | 'POST';
  allowedParams: string[];
  requiredAll?: string[];
  requiredAny?: string[];
  restricted?: boolean;
  bodyMode?: 'query' | 'syai-json';
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
    requiredAll: ['ip'],
  },
  oil: {
    endpoint: 'yjcx.php',
    method: 'GET',
    allowedParams: ['city'],
    requiredAll: ['city'],
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
    requiredAll: ['type'],
  },
  'text-check': {
    endpoint: 'txtjc.php',
    method: 'GET',
    allowedParams: ['text'],
    requiredAll: ['text'],
  },
  tts: {
    endpoint: 'xytts.php',
    method: 'GET',
    allowedParams: ['type', 'word', 'id'],
    requiredAll: ['type', 'word'],
  },
  'ai-chat': {
    endpoint: 'aichat.php',
    method: 'GET',
    allowedParams: ['message', 'id', 'system'],
    requiredAll: ['message'],
  },
  'ai-image': {
    endpoint: 'aist.php',
    method: 'GET',
    allowedParams: ['msg', 'style', 'size', 'aibc'],
    requiredAll: ['msg'],
  },
  'qq-info': {
    endpoint: 'qqcx.php',
    method: 'GET',
    allowedParams: ['qq', 'type'],
    requiredAll: ['qq'],
  },
  'icp-record': {
    endpoint: 'xyicp.php',
    method: 'GET',
    allowedParams: ['type', 'data'],
    requiredAll: ['type', 'data'],
  },
  whois: {
    endpoint: 'ymhs.php',
    method: 'GET',
    allowedParams: ['domain'],
    requiredAll: ['domain'],
  },
  'domain-price': {
    endpoint: 'ymcj.php',
    method: 'GET',
    allowedParams: ['domain'],
    requiredAll: ['domain'],
  },
  'site-info': {
    endpoint: 'wzxx.php',
    method: 'GET',
    allowedParams: ['url'],
    requiredAll: ['url'],
  },
  snapshot: {
    endpoint: 'wykz.php',
    method: 'GET',
    allowedParams: ['url', 'ratio'],
    requiredAll: ['url'],
  },
  subdomain: {
    endpoint: 'domain.php',
    method: 'GET',
    allowedParams: ['url'],
    requiredAll: ['url'],
  },
  bilibili: {
    endpoint: 'bz.php',
    method: 'GET',
    allowedParams: ['type', 'url', 'uid'],
    requiredAll: ['type'],
  },
  'netease-music': {
    endpoint: 'wyydg_new.php',
    method: 'GET',
    allowedParams: ['type', 'word', 'id', 'choose', 'order'],
    requiredAll: ['type'],
  },
  'emoji-search': {
    endpoint: 'bqb.php',
    method: 'GET',
    allowedParams: ['word', 'page', 'num'],
    requiredAll: ['word'],
  },
  'phone-status': { endpoint: 'sjhjc.php', method: 'GET', allowedParams: ['num'], requiredAll: ['num'], restricted: true },
  'lanzou-parse': { endpoint: 'lzy1.php', method: 'GET', allowedParams: ['url', 'pwd', 'type'], requiredAll: ['url'], restricted: true },
  'zepp-steps': { endpoint: 'shuabu.php', method: 'GET', allowedParams: ['user', 'pwd', 'num'], requiredAll: ['user', 'pwd', 'num'], restricted: true },
  'image-review': { endpoint: 'tpjh.php', method: 'GET', allowedParams: ['url', 'data', 'type', 'task_id'], requiredAny: ['url', 'data', 'task_id'] },
  'domain-check': { endpoint: 'ymjj.php', method: 'GET', allowedParams: ['url'], requiredAll: ['url'] },
  'watermark-remove': { endpoint: 'qsy.php', method: 'GET', allowedParams: ['type', 'url'], requiredAll: ['type', 'url'], restricted: true },
  'emoji-maker': { endpoint: 'bqbjh.php', method: 'GET', allowedParams: ['type', 'word', 'key', 'urls', 'qqs', 'texts'], requiredAll: ['type'], restricted: true },
  'smtp-send': { endpoint: 'smtp.php', method: 'GET', allowedParams: ['smtp', 'port', 'user', 'pwd', 'to', 'title', 'sendname', 'sendcontent', 'content_type'], requiredAll: ['smtp', 'user', 'pwd', 'to', 'title', 'sendname', 'sendcontent'], restricted: true },
  'advanced-ai': { endpoint: 'syai.php', method: 'POST', allowedParams: ['model', 'system', 'message', 'temperature'], requiredAll: ['message'], restricted: true, bodyMode: 'syai-json' },
  miyoushe: { endpoint: 'mys.php', method: 'GET', allowedParams: ['type', 'keyword', 'uid'], requiredAll: ['type'], restricted: true },
  'lol-record': { endpoint: 'yxlm.php', method: 'GET', allowedParams: ['type', 'word', 'id', 'scene'], requiredAll: ['type'], restricted: true },
  'valorant-record': { endpoint: 'wwqy.php', method: 'GET', allowedParams: ['type', 'word', 'id'], requiredAll: ['type'], restricted: true },
  'peace-record': { endpoint: 'hpyd.php', method: 'GET', allowedParams: ['type', 'word', 'id', 'roleid'], requiredAll: ['type'], restricted: true },
  'wz-record': { endpoint: 'wzyd.php', method: 'GET', allowedParams: ['type', 'word', 'id', 'roleId', 'heroid', 'name', 'gameseq', 'num', 'backtype'], requiredAll: ['type'], restricted: true },
  'uin-to-uid': { endpoint: 'uintoid.php', method: 'GET', allowedParams: ['qq'], requiredAll: ['qq'], restricted: true },
  'port-scan': { endpoint: 'ddsm.php', method: 'GET', allowedParams: ['ip'], requiredAll: ['ip'], restricted: true },
  'qq-group': { endpoint: 'qun.php', method: 'GET', allowedParams: ['num'], requiredAll: ['num'], restricted: true },
  'idc-search': { endpoint: 'idcjk.php', method: 'GET', allowedParams: ['type', 'word', 'domain'], requiredAll: ['type'] },
  'text-image': { endpoint: 'wzzt.php', method: 'GET', allowedParams: ['text', 'img', 'imgmode', 'imgtds', 'txtm', 'color', 'srgb', 'ergb', 'imgm', 'imgbm', 'txtl'], requiredAll: ['text'] },
  'king-power': { endpoint: 'wzzl.php', method: 'GET', allowedParams: ['name', 'pingtai'], requiredAll: ['name', 'pingtai'] },
  'llm-sign': { endpoint: 'llm.php', method: 'GET', allowedParams: ['type', 'qq', 'title'], requiredAll: ['type', 'qq'], restricted: true },
  pixiv: { endpoint: 'pz.php', method: 'GET', allowedParams: ['type', 'word'], requiredAll: ['type'] },
  'kugou-music': { endpoint: 'kgdg.php', method: 'GET', allowedParams: ['type', 'word', 'choose'], requiredAll: ['type', 'word'] },
  'ai-draw': { endpoint: 'aiht.php', method: 'GET', allowedParams: ['word', 'img1', 'img2'], requiredAll: ['word'] },
  'video-parse': { endpoint: 'spjx.php', method: 'GET', allowedParams: ['url'], requiredAll: ['url'], restricted: true },
  'international-express': { endpoint: 'kdcx.php', method: 'GET', allowedParams: ['number'], requiredAll: ['number'] },
  'ip-clean': { endpoint: 'ipcjd.php', method: 'GET', allowedParams: ['ip'], requiredAll: ['ip'] },
  seo: { endpoint: 'seo.php', method: 'GET', allowedParams: ['url'], requiredAll: ['url'] },
  'parse-query': { endpoint: 'yycx.php', method: 'GET', allowedParams: ['url'], requiredAll: ['url'] },
  'qq-music': { endpoint: 'qwdg.php', method: 'GET', allowedParams: ['type', 'word', 'choose', 'id'], requiredAll: ['type'] },
  'icp-domain': { endpoint: 'icp.php', method: 'GET', allowedParams: ['domain'], requiredAll: ['domain'] },
  ping: { endpoint: 'ping.php', method: 'GET', allowedParams: ['url'], requiredAll: ['url'] },
  'random-4399': { endpoint: '4399xh.php', method: 'GET', allowedParams: [], restricted: true },
  'random-mihoyo-cos': { endpoint: 'cpt.php', method: 'GET', allowedParams: ['type'] },
  'random-anime-image': { endpoint: 'sjdmt.php', method: 'GET', allowedParams: ['type'] },
  'anime-quote': { endpoint: 'dmyy.php', method: 'GET', allowedParams: ['type'] },
  'random-cat-meme': { endpoint: 'hm.php', method: 'GET', allowedParams: ['type'] },
  'random-wsm': { endpoint: 'wsm.php', method: 'GET', allowedParams: ['type'] },
  'random-cheshire': { endpoint: 'cd.php', method: 'GET', allowedParams: ['type'] },
  'random-doro': { endpoint: 'doro.php', method: 'GET', allowedParams: ['type'] },
  'random-cos': { endpoint: 'cp.php', method: 'GET', allowedParams: ['type'] },
  'ip-basic': { endpoint: 'ip.php', method: 'GET', allowedParams: ['ip'], requiredAll: ['ip'] },
  'get-rkey': { endpoint: 'get_rkey.php', method: 'GET', allowedParams: [], restricted: true },
  'image-to-png': { endpoint: 'pic.php', method: 'GET', allowedParams: ['url'], requiredAll: ['url'], restricted: true },
  'itdog-ping': { endpoint: 'itping.php', method: 'GET', allowedParams: ['url'], requiredAll: ['url'], restricted: true },
  'indexed-query': { endpoint: 'slcx.php', method: 'GET', allowedParams: ['word'], requiredAll: ['word'], restricted: true },
  'old-netease-music': { endpoint: 'wyydg.php', method: 'GET', allowedParams: ['type', 'word', 'choose', 'id'], requiredAll: ['type'], restricted: true },
  'qq-card-sign': { endpoint: 'qqkq.php', method: 'GET', allowedParams: ['title', 'desc', 'prompt', 'url', 'pic', 'i'], requiredAll: ['title', 'desc', 'pic'], restricted: true },
  qqsgk: { endpoint: 'qqsgk.php', method: 'GET', allowedParams: ['type', 'qq', 'points'], requiredAll: ['qq'], restricted: true },
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

function hasRequiredParams(params: Record<string, string>, route: ToolRoute) {
  if (route.requiredAll?.some((name) => !params[name])) {
    return false;
  }

  if (!route.requiredAny || route.requiredAny.length === 0) {
    return true;
  }

  return route.requiredAny.some((name) => params[name]);
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

  if (route.restricted && env.ENABLE_RESTRICTED_TOOLS !== 'true') {
    return jsonResponse({ ok: false, status: 403, contentType: 'application/json', data: null, error: '该工具属于高风险、计费、维护或敏感接口，默认不允许公开调用。' }, 403);
  }

  const params = cleanParams(body.params ?? {}, route.allowedParams);

  if (!hasRequiredParams(params, route)) {
    return jsonResponse({ ok: false, status: 400, contentType: 'application/json', data: null, error: '缺少必要参数' }, 400);
  }

  const base = (env.XIAOYU_API_BASE || 'https://api.xiaoyu17love.top/API').replace(/\/$/, '');
  const url = new URL(`${base}/${route.endpoint}`);
  let upstreamInit: RequestInit = { method: route.method };

  if (route.bodyMode === 'syai-json') {
    const messages = [
      { role: 'system', content: params.system || '你是一个有帮助的助手。' },
      { role: 'user', content: params.message },
    ];

    upstreamInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: env.XIAOYU_API_KEY,
      },
      body: JSON.stringify({
        model: params.model || undefined,
        messages,
        temperature: params.temperature ? Number(params.temperature) : 0.7,
      }),
    };
  } else {
    url.searchParams.set('apikey', env.XIAOYU_API_KEY);

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  try {
    const upstream = await fetchWithTimeout(url.toString(), upstreamInit, 18000);
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
