import { useState, useCallback, useEffect } from "react";

const API_BASE = "https://api.synoxcloud.xyz/search/mcpedl";
const PROXY = "https://corsproxy.io/?url=";

function proxied(url) {
  return PROXY + encodeURIComponent(url);
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "date", label: "Newest" },
  { value: "popular", label: "Popular" },
];

const pixelBorder = {
  boxShadow: `
    0 -2px 0 0 #000,
    0 2px 0 0 #000,
    -2px 0 0 0 #000,
    2px 0 0 0 #000
  `,
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&family=Inter:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body, #root { background: #0a0e0a; min-height: 100vh; }

  .app {
    min-height: 100vh;
    background: #0a0e0a;
    color: #e8e8d0;
    font-family: 'Inter', sans-serif;
  }

  /* Scanlines overlay */
  .app::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.08) 2px,
      rgba(0,0,0,0.08) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  .hero {
    background: linear-gradient(180deg, #0f1a0f 0%, #0a0e0a 100%);
    border-bottom: 2px solid #1a2e1a;
    padding: 32px 16px 28px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 40% at 50% 0%, rgba(94,159,43,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-title {
    font-family: 'Press Start 2P', monospace;
    font-size: clamp(13px, 3vw, 20px);
    color: #7ec850;
    text-shadow: 0 0 20px rgba(126,200,80,0.5), 2px 2px 0 #2d5a0e;
    letter-spacing: 2px;
    margin-bottom: 6px;
  }

  .hero-sub {
    font-family: 'VT323', monospace;
    font-size: 20px;
    color: #6b8a52;
    letter-spacing: 3px;
    margin-bottom: 28px;
  }

  .search-bar {
    display: flex;
    gap: 0;
    max-width: 680px;
    margin: 0 auto 16px;
    position: relative;
    z-index: 1;
  }

  .search-input {
    flex: 1;
    background: #111811;
    border: 2px solid #2a4a1a;
    border-right: none;
    color: #b8d4a0;
    font-family: 'VT323', monospace;
    font-size: 20px;
    padding: 10px 16px;
    outline: none;
    letter-spacing: 1px;
    transition: border-color 0.15s;
  }
  .search-input::placeholder { color: #3a5a2a; }
  .search-input:focus { border-color: #5d9f2b; background: #131f13; }

  .search-btn {
    background: #3a7a12;
    border: 2px solid #2a6a08;
    border-left: 2px solid #4a9a1a;
    color: #d4f4a8;
    font-family: 'Press Start 2P', monospace;
    font-size: 9px;
    padding: 10px 18px;
    cursor: pointer;
    transition: background 0.1s, transform 0.05s;
    white-space: nowrap;
    letter-spacing: 1px;
  }
  .search-btn:hover { background: #4a9a1a; }
  .search-btn:active { transform: scale(0.97); }
  .search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .sort-row {
    display: flex;
    justify-content: center;
    gap: 8px;
    position: relative;
    z-index: 1;
  }

  .sort-chip {
    background: transparent;
    border: 1px solid #2a4a1a;
    color: #6b8a52;
    font-family: 'VT323', monospace;
    font-size: 16px;
    padding: 3px 14px;
    cursor: pointer;
    letter-spacing: 1px;
    transition: all 0.1s;
  }
  .sort-chip.active {
    background: #1a3a0a;
    border-color: #5d9f2b;
    color: #a0d870;
  }
  .sort-chip:hover:not(.active) { border-color: #3a6a1a; color: #8aaa72; }

  .main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 28px 16px;
  }

  .results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid #1a2e1a;
  }

  .results-label {
    font-family: 'VT323', monospace;
    font-size: 18px;
    color: #5d7a40;
    letter-spacing: 2px;
  }
  .results-label span { color: #7ec850; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .card {
    background: #0d150d;
    border: 2px solid #1a2e1a;
    cursor: pointer;
    transition: border-color 0.15s, transform 0.1s, background 0.15s;
    position: relative;
    overflow: hidden;
  }
  .card:hover {
    border-color: #5d9f2b;
    background: #101a10;
    transform: translateY(-2px);
  }
  .card:hover .card-overlay { opacity: 1; }

  .card-thumb {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    display: block;
    background: #0a100a;
    image-rendering: pixelated;
  }
  .card-thumb-placeholder {
    width: 100%;
    aspect-ratio: 16/9;
    background: #0d150d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
  }

  .card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 40%, rgba(10,20,10,0.9) 100%);
    opacity: 0;
    transition: opacity 0.15s;
    pointer-events: none;
  }

  .card-body {
    padding: 12px 14px 14px;
  }

  .card-title {
    font-family: 'VT323', monospace;
    font-size: 20px;
    color: #c8e8a8;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-author {
    font-size: 12px;
    color: #4a6a32;
    margin-bottom: 8px;
    font-family: 'VT323', monospace;
    font-size: 15px;
    letter-spacing: 1px;
  }
  .card-author span { color: #6b9a4a; }

  .card-desc {
    font-size: 12px;
    color: #5a7a48;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .tag {
    background: #0a1a08;
    border: 1px solid #1e3e12;
    color: #5a8040;
    font-family: 'VT323', monospace;
    font-size: 13px;
    padding: 1px 8px;
    letter-spacing: 0.5px;
  }

  .views-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0,0,0,0.75);
    border: 1px solid #2a4a1a;
    color: #7ec850;
    font-family: 'VT323', monospace;
    font-size: 14px;
    padding: 2px 8px;
    letter-spacing: 1px;
  }

  /* Detail Modal */
  .modal-bg {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    z-index: 1000;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 24px 16px;
    overflow-y: auto;
    backdrop-filter: blur(4px);
  }

  .modal {
    background: #0d150d;
    border: 2px solid #3a6a1a;
    width: 100%;
    max-width: 760px;
    position: relative;
    animation: slideIn 0.15s ease-out;
  }

  @keyframes slideIn {
    from { transform: translateY(-16px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #1a0a0a;
    border: 2px solid #4a1a1a;
    color: #d46060;
    font-family: 'Press Start 2P', monospace;
    font-size: 10px;
    padding: 6px 10px;
    cursor: pointer;
    z-index: 10;
    transition: background 0.1s;
  }
  .modal-close:hover { background: #2a1212; }

  .modal-hero {
    width: 100%;
    max-height: 320px;
    object-fit: cover;
    display: block;
  }

  .modal-hero-placeholder {
    width: 100%;
    height: 200px;
    background: #0a120a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 56px;
    border-bottom: 2px solid #1a2e1a;
  }

  .modal-content {
    padding: 20px 24px 28px;
  }

  .modal-title {
    font-family: 'Press Start 2P', monospace;
    font-size: clamp(11px, 2.5vw, 16px);
    color: #a0d870;
    text-shadow: 2px 2px 0 #2d5a0e;
    margin-bottom: 8px;
    line-height: 1.6;
    padding-right: 60px;
  }

  .modal-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #1a2e1a;
  }

  .meta-item {
    font-family: 'VT323', monospace;
    font-size: 16px;
    color: #5a7a48;
    letter-spacing: 1px;
  }
  .meta-item span { color: #8ac060; }

  .modal-section-title {
    font-family: 'Press Start 2P', monospace;
    font-size: 9px;
    color: #3a6a1a;
    letter-spacing: 2px;
    margin-bottom: 10px;
    margin-top: 18px;
  }

  .modal-desc {
    font-size: 13px;
    color: #7a9a68;
    line-height: 1.7;
    white-space: pre-wrap;
  }

  .modal-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 18px;
  }

  .modal-links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
  }

  .btn-link {
    background: #1a3a0a;
    border: 2px solid #2a5a10;
    color: #90d060;
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    padding: 10px 16px;
    cursor: pointer;
    text-decoration: none;
    letter-spacing: 1px;
    transition: background 0.1s;
    display: inline-block;
  }
  .btn-link:hover { background: #253e13; border-color: #5d9f2b; }

  .btn-link.secondary {
    background: transparent;
    border-color: #1a2e1a;
    color: #5a7a48;
  }
  .btn-link.secondary:hover { border-color: #2a4a1a; color: #7a9a68; }

  /* States */
  .state-center {
    text-align: center;
    padding: 64px 16px;
  }

  .state-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .state-text {
    font-family: 'VT323', monospace;
    font-size: 22px;
    color: #3a5a2a;
    letter-spacing: 2px;
  }

  .state-sub {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #2a3a22;
    margin-top: 8px;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #1a2e1a;
    border-top-color: #5d9f2b;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin: 0 auto 16px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Pagination */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 32px;
    flex-wrap: wrap;
  }

  .page-btn {
    background: transparent;
    border: 2px solid #1a2e1a;
    color: #5a7a48;
    font-family: 'VT323', monospace;
    font-size: 18px;
    padding: 4px 14px;
    cursor: pointer;
    transition: all 0.1s;
    letter-spacing: 1px;
  }
  .page-btn:hover:not(:disabled) { border-color: #3a5a1a; color: #8aaa72; }
  .page-btn.active { background: #1a3a0a; border-color: #5d9f2b; color: #a0d870; }
  .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .error-box {
    background: #150a0a;
    border: 2px solid #4a1a1a;
    color: #d46060;
    font-family: 'VT323', monospace;
    font-size: 16px;
    padding: 12px 16px;
    text-align: center;
    letter-spacing: 1px;
    max-width: 680px;
    margin: 8px auto 0;
  }
`;

function formatNum(n) {
  if (!n) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

function ModCard({ mod, onClick }) {
  const thumb = mod.image;
  const views = mod.download_count;
  const author = mod.user?.name || mod.user?.username || "Unknown";

  return (
    <div className="card" onClick={() => onClick(mod)}>
      {thumb ? (
        <img
          className="card-thumb"
          src={thumb}
          alt={mod.title}
          loading="lazy"
          onError={(e) => { e.target.style.display = "none"; }}
        />
      ) : (
        <div className="card-thumb-placeholder">🧱</div>
      )}
      <div className="card-overlay" />
      {views > 0 && (
        <div className="views-badge">⬇ {formatNum(views)}</div>
      )}
      <div className="card-body">
        <div className="card-title">{mod.title || "Unknown Mod"}</div>
        <div className="card-author">
          by <span>{author}</span>
        </div>
        {mod.summary && (
          <div className="card-desc">{mod.summary}</div>
        )}
        <div className="card-tags">
          {(mod.categories || []).slice(0, 3).map((t, i) => (
            <span className="tag" key={i}>{t}</span>
          ))}
          {mod.type && <span className="tag">{mod.type}</span>}
        </div>
      </div>
    </div>
  );
}

function DetailModal({ mod, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const slug = mod.slug || mod.url || mod.link;
    if (!slug) {
      setDetail(mod);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const detailUrl = `${API_BASE}?action=detail&query=${encodeURIComponent(slug)}`;
        const res = await fetch(proxied(detailUrl));
        const data = await res.json();
        setDetail(data?.result || data?.data || data || mod);
      } catch {
        setDetail(mod);
      } finally {
        setLoading(false);
      }
    })();
  }, [mod]);

  const d = detail || mod;
  const thumb = d.image;
  const views = null; // no view count in API
  const downloads = d.download_count;
  const date = d.updated_at || d.created_at;
  const author = d.user?.name || d.user?.username;

  return (
    <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕ CLOSE</button>

        {loading ? (
          <div className="state-center" style={{ padding: "80px 16px" }}>
            <div className="spinner" />
            <div className="state-text">LOADING...</div>
          </div>
        ) : (
          <>
            {thumb ? (
              <img className="modal-hero" src={thumb} alt={d.title}
                onError={(e) => { e.target.style.display = "none"; }} />
            ) : (
              <div className="modal-hero-placeholder">🧱</div>
            )}

            <div className="modal-content">
              <div className="modal-title">{d.title || "Unknown"}</div>

              <div className="modal-meta">
                {author ? (
                  <div className="meta-item">👤 <span>{author}</span></div>
                ) : null}
                {downloads > 0 ? <div className="meta-item">⬇ <span>{formatNum(downloads)}</span></div> : null}
                {d.rating ? <div className="meta-item">⭐ <span>{Number(d.rating).toFixed(1)}</span></div> : null}
                {date ? <div className="meta-item">📅 <span>{new Date(date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}</span></div> : null}
                {d.type && <div className="meta-item">📦 <span>{d.type}</span></div>}
              </div>

              {(d.summary || d.description) && (
                <>
                  <div className="modal-section-title">// DESCRIPTION</div>
                  <div className="modal-desc">
                    {(d.summary || d.description || "").replace(/<[^>]+>/g, "").slice(0, 800)}
                    {(d.summary || d.description || "").length > 800 ? "..." : ""}
                  </div>
                </>
              )}

              {(d.categories || []).length > 0 && (
                <div className="modal-tags">
                  {(d.categories || []).map((t, i) => (
                    <span className="tag" key={i} style={{ fontSize: "14px", padding: "2px 10px" }}>{t}</span>
                  ))}
                </div>
              )}

              <div className="modal-links">
                {d.url && (
                  <a className="btn-link" href={d.url} target="_blank" rel="noopener noreferrer">
                    ▶ OPEN IN MCPEDL
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [selectedMod, setSelectedMod] = useState(null);
  const [totalPagesOverride, setTotalPagesOverride] = useState(null);

  const doSearch = useCallback(async (q, s, p) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE}?action=search&query=${encodeURIComponent(q)}&sort=${s}&page=${p}`;
      const res = await fetch(proxied(url));

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Normalize response shape
      const result = data?.result || {};
      const items = result?.results || [];

      setResults(items);
      setTotal(result?.total || items.length);
      // store total_pages too
      setTotalPagesOverride(result?.total_pages || null);
      setSearched(true);
    } catch (e) {
      setError(`Gagal fetch: ${e.message}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => {
    setPage(1);
    doSearch(query, sort, 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSort = (s) => {
    setSort(s);
    if (searched && query.trim()) {
      setPage(1);
      doSearch(query, s, 1);
    }
  };

  const handlePage = (p) => {
    setPage(p);
    doSearch(query, sort, p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = totalPagesOverride || (total ? Math.ceil(total / 20) : 0);
  const pageNums = [];
  if (totalPages > 1) {
    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
      pageNums.push(i);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="hero">
          <div className="hero-title">⛏ MCPEDL SEARCH</div>
          <div className="hero-sub">MINECRAFT MODS · ADDONS · MAPS · RESOURCE PACKS</div>

          <div className="search-bar">
            <input
              className="search-input"
              placeholder="Cari mod, addon, map..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="search-btn" onClick={handleSearch} disabled={loading || !query.trim()}>
              {loading ? "..." : "SEARCH"}
            </button>
          </div>

          {error && <div className="error-box">⚠ {error}</div>}

          <div className="sort-row">
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.value}
                className={`sort-chip${sort === o.value ? " active" : ""}`}
                onClick={() => handleSort(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="main">
          {!searched && !loading && (
            <div className="state-center">
              <div className="state-icon">🧊</div>
              <div className="state-text">SEARCH FOR MODS</div>
              <div className="state-sub">Ketik kata kunci di atas dan tekan Search</div>
            </div>
          )}

          {loading && (
            <div className="state-center">
              <div className="spinner" />
              <div className="state-text">SEARCHING...</div>
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="state-center">
              <div className="state-icon">🕳</div>
              <div className="state-text">NO RESULTS FOUND</div>
              <div className="state-sub">Coba kata kunci lain</div>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="results-header">
                <div className="results-label">
                  <span>{results.length}</span> RESULTS
                  {total && total > results.length ? ` OF ${total}` : ""}
                  {" · PAGE "}<span>{page}</span>
                </div>
              </div>

              <div className="grid">
                {results.map((mod, i) => (
                  <ModCard key={mod.id || mod.slug || i} mod={mod} onClick={setSelectedMod} />
                ))}
              </div>

              {pageNums.length > 0 && (
                <div className="pagination">
                  <button className="page-btn" disabled={page <= 1} onClick={() => handlePage(page - 1)}>◀</button>
                  {pageNums[0] > 1 && (
                    <>
                      <button className="page-btn" onClick={() => handlePage(1)}>1</button>
                      {pageNums[0] > 2 && <span style={{ color: "#2a4a1a", fontFamily: "VT323", fontSize: 18 }}>···</span>}
                    </>
                  )}
                  {pageNums.map((n) => (
                    <button key={n} className={`page-btn${page === n ? " active" : ""}`} onClick={() => handlePage(n)}>{n}</button>
                  ))}
                  {pageNums[pageNums.length - 1] < totalPages && (
                    <>
                      {pageNums[pageNums.length - 1] < totalPages - 1 && <span style={{ color: "#2a4a1a", fontFamily: "VT323", fontSize: 18 }}>···</span>}
                      <button className="page-btn" onClick={() => handlePage(totalPages)}>{totalPages}</button>
                    </>
                  )}
                  <button className="page-btn" disabled={page >= totalPages} onClick={() => handlePage(page + 1)}>▶</button>
                </div>
              )}
            </>
          )}
        </div>

        {selectedMod && (
          <DetailModal mod={selectedMod} onClose={() => setSelectedMod(null)} />
        )}
      </div>
    </>
  );
}
