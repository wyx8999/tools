import { FormEvent, useMemo, useState } from 'react';
import { callTool } from './lib/api';
import { categoryLabels, tools } from './lib/tools';
import type { ProxyResponse, ToolCategory, ToolConfig } from './types';

type CategoryFilter = ToolCategory | 'all';

const categories = Object.keys(categoryLabels) as CategoryFilter[];

function getInitialValues(tool: ToolConfig) {
  return Object.fromEntries(tool.fields.map((field) => [field.name, field.defaultValue ?? '']));
}

function renderResult(result: ProxyResponse | null) {
  if (!result) {
    return <div className="empty-state">选择一个工具并提交后，结果会显示在这里。</div>;
  }

  if (!result.ok) {
    return (
      <div className="result-error">
        <strong>请求失败</strong>
        <span>{result.error || `状态码 ${result.status}`}</span>
      </div>
    );
  }

  if (typeof result.data === 'string') {
    const trimmed = result.data.trim();
    const isImage = /^https?:\/\/.*\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i.test(trimmed) || trimmed.startsWith('data:image/');

    if (isImage) {
      return <img className="result-image" src={trimmed} alt="工具返回图片" />;
    }

    return <pre className="result-pre">{result.data}</pre>;
  }

  return <pre className="result-pre">{JSON.stringify(result.data, null, 2)}</pre>;
}

export default function App() {
  const showHiddenTools = new URLSearchParams(window.location.search).get('showRestricted') === 'true';
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');
  const [selectedToolId, setSelectedToolId] = useState(tools[0].id);
  const [values, setValues] = useState<Record<string, string>>(getInitialValues(tools[0]));
  const [result, setResult] = useState<ProxyResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedTool = tools.find((tool) => tool.id === selectedToolId) ?? tools[0];

  const filteredTools = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return tools.filter((tool) => {
      if (tool.hiddenByDefault && !showHiddenTools) {
        return false;
      }

      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      const matchesKeyword = !keyword || `${tool.name} ${tool.description}`.toLowerCase().includes(keyword);
      return matchesCategory && matchesKeyword;
    });
  }, [activeCategory, query, showHiddenTools]);

  function selectTool(tool: ToolConfig) {
    setSelectedToolId(tool.id);
    setValues(getInitialValues(tool));
    setResult(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const params = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value.trim() !== ''),
    );

    try {
      setResult(await callTool(selectedTool.id, params));
    } catch (error) {
      setResult({
        ok: false,
        status: 0,
        contentType: 'application/json',
        data: null,
        error: error instanceof Error ? error.message : '网络请求失败',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="hero-section">
        <nav className="topbar">
          <div className="brand-mark">万</div>
          <span>万能工具箱</span>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Cloudflare Pages Ready</span>
            <h1>把常用 API 做成一个干净、好用、可部署的工具站。</h1>
            <p>首版聚合天气、IP、油价、热榜、内容生成、TTS 和 AI 工具。API 密钥只在 Cloudflare Pages Functions 中使用，不暴露给浏览器。</p>
          </div>
          <div className="hero-card">
            <span>已接入工具</span>
            <strong>{tools.length}</strong>
            <p>默认展示适合公开调用的工具。高风险、计费、维护和敏感接口已加入配置，但需要显式开启后才可显示和调用。</p>
          </div>
        </div>
      </section>

      <section className="workspace">
        <aside className="tool-panel">
          <div className="search-box">
            <label htmlFor="toolSearch">搜索工具</label>
            <input
              id="toolSearch"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="天气、热榜、AI..."
            />
          </div>

          <div className="category-list">
            {categories.map((category) => (
              <button
                className={activeCategory === category ? 'active' : ''}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>

          {showHiddenTools ? (
            <div className="hidden-tools-note">已显示隐藏工具。受限工具仍需后端环境变量允许调用。</div>
          ) : null}

          <div className="tool-list">
            {filteredTools.map((tool) => (
              <button
                className={selectedTool.id === tool.id ? 'tool-item selected' : 'tool-item'}
                key={tool.id}
                onClick={() => selectTool(tool)}
                type="button"
              >
                <span className={`tool-icon bg-gradient-to-br ${tool.accent}`}>{tool.shortName}</span>
                <span>
                  <strong>{tool.name}</strong>
                  <small>{tool.description}</small>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="runner-card">
          <div className="runner-header">
            <span className={`tool-icon large bg-gradient-to-br ${selectedTool.accent}`}>{selectedTool.shortName}</span>
            <div>
              <h2>{selectedTool.name}</h2>
              <p>{selectedTool.description}</p>
              {selectedTool.risk && selectedTool.risk !== 'normal' ? (
                <strong className="risk-note">{selectedTool.risk === 'restricted' ? '高风险功能，请谨慎使用。' : '请勿频繁调用，避免触发限速。'}</strong>
              ) : null}
            </div>
          </div>

          <form className="tool-form" onSubmit={handleSubmit}>
            {selectedTool.fields.map((field) => (
              <label className="field" key={field.name}>
                <span>
                  {field.label}
                  {field.required ? <em>*</em> : null}
                </span>
                {field.type === 'textarea' ? (
                  <textarea
                    value={values[field.name] ?? ''}
                    onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={4}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={values[field.name] ?? field.defaultValue ?? ''}
                    onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                    required={field.required}
                  >
                    {(field.options ?? []).map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={values[field.name] ?? ''}
                    onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                )}
              </label>
            ))}

            <div className="form-footer">
              <p>{selectedTool.resultHint}</p>
              <button type="submit" disabled={loading}>{loading ? '调用中...' : '立即调用'}</button>
            </div>
          </form>

          <section className="result-card">
            <div className="result-title">
              <span>返回结果</span>
              {result ? <small>HTTP {result.status}</small> : null}
            </div>
            {renderResult(result)}
          </section>
        </section>
      </section>
    </main>
  );
}
