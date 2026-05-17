import { useState, useEffect, useRef } from "react";

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C97A";
const GOLD_DIM = "#8B6F2E";
const ONYX = "#0D0D0D";
const ONYX2 = "#161616";
const ONYX3 = "#1E1E1E";
const BONE = "#F5F3EE";
const BONE2 = "#EDE9E0";
const MUTED = "#6B6558";
const WHITE = "#FAFAF8";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;1,6..96,400;1,6..96,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  
  .hatch-app {
    font-family: 'DM Sans', sans-serif;
    background: ${ONYX};
    color: ${WHITE};
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }

  .screen {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 60px;
    overflow-y: auto;
    overflow-x: hidden;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.35s ease, transform 0.35s ease;
    pointer-events: none;
    scrollbar-width: none;
  }
  .screen::-webkit-scrollbar { display: none; }
  .screen.active {
    opacity: 1;
    transform: translateY(0);
    pointer-events: all;
  }

  .bottom-nav {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 60px;
    background: ${ONYX2};
    border-top: 0.5px solid #2A2A22;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-bottom: env(safe-area-inset-bottom);
    z-index: 100;
  }

  .nav-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 8px 0;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .nav-btn svg { width: 20px; height: 20px; }
  .nav-label {
    font-size: 9px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 500;
    transition: color 0.2s;
  }
  .nav-btn.active .nav-label { color: ${GOLD}; }
  .nav-btn:not(.active) .nav-label { color: ${MUTED}; }
  .nav-btn.active svg path, .nav-btn.active svg circle, .nav-btn.active svg rect, .nav-btn.active svg line, .nav-btn.active svg polyline { stroke: ${GOLD}; }
  .nav-btn:not(.active) svg path, .nav-btn:not(.active) svg circle, .nav-btn:not(.active) svg rect, .nav-btn:not(.active) svg line, .nav-btn:not(.active) svg polyline { stroke: ${MUTED}; }

  .gold-text { color: ${GOLD}; }
  .bodoni { font-family: 'Bodoni Moda', serif; }
  .cormorant { font-family: 'Cormorant Garamond', serif; }

  .pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 500;
  }
  .pill-gold { background: ${GOLD_DIM}22; border: 0.5px solid ${GOLD_DIM}; color: ${GOLD_LIGHT}; }
  .pill-live { background: #8B1A1A22; border: 0.5px solid #8B1A1A; color: #E07070; }
  .pill-muted { background: #2A2A2222; border: 0.5px solid #3A3A32; color: ${MUTED}; }

  .section-title {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${MUTED};
    font-weight: 500;
    margin-bottom: 16px;
  }

  .card-dark {
    background: ${ONYX2};
    border: 0.5px solid #2A2A22;
    border-radius: 12px;
    overflow: hidden;
  }

  .modal-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.85);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }
  .modal-overlay.open { opacity: 1; pointer-events: all; }
  .modal-sheet {
    width: 100%;
    background: ${ONYX3};
    border: 0.5px solid #2A2A22;
    border-bottom: none;
    border-radius: 20px 20px 0 0;
    padding: 24px 24px 40px;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
  }
  .modal-overlay.open .modal-sheet { transform: translateY(0); }

  .waveform-bar {
    width: 3px;
    border-radius: 2px;
    background: ${GOLD};
    animation: wave 1.2s ease-in-out infinite;
  }
  @keyframes wave {
    0%, 100% { transform: scaleY(0.3); }
    50% { transform: scaleY(1); }
  }

  .range-gold {
    -webkit-appearance: none;
    width: 100%;
    height: 2px;
    background: transparent;
    outline: none;
  }
  .range-gold::-webkit-slider-runnable-track {
    height: 2px;
    background: #2A2A22;
    border-radius: 1px;
  }
  .range-gold::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px; height: 14px;
    border-radius: 50%;
    background: ${GOLD};
    margin-top: -6px;
    cursor: pointer;
  }

  .fade-in { animation: fadeUp 0.5s ease forwards; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .shimmer {
    background: linear-gradient(90deg, ${ONYX2} 25%, #1E1E1A 50%, ${ONYX2} 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .gold-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: ${GOLD};
    animation: pulse 2s ease infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.7); }
  }

  .touch-btn {
    background: none; border: none; cursor: pointer;
    transition: opacity 0.15s, transform 0.15s;
    color: inherit;
  }
  .touch-btn:active { opacity: 0.7; transform: scale(0.95); }

  .img-placeholder {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .gradient-bottom::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 60%;
    background: linear-gradient(transparent, ${ONYX});
    pointer-events: none;
  }
`;

function NavIcon({ id }) {
  const icons = {
    home: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    events: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    audio: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
    profile: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };
  return icons[id] || null;
}

function ExhibitionHero({ title, subtitle, tags, height = 220, onClick }) {
  const colors = [
    "linear-gradient(160deg, #1A0A0A 0%, #2D1A08 40%, #0D0D0D 100%)",
    "linear-gradient(160deg, #0A0F1A 0%, #0D2035 40%, #0D0D0D 100%)",
    "linear-gradient(160deg, #0F1A0A 0%, #1A2D10 40%, #0D0D0D 100%)",
  ];
  const [bg] = useState(colors[Math.floor(Math.random() * colors.length)]);

  return (
    <div onClick={onClick} style={{ cursor: onClick ? "pointer" : "default", borderRadius: 12, overflow: "hidden", position: "relative", height, background: bg, border: `0.5px solid #2A2A22` }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.15, backgroundImage: "radial-gradient(ellipse at 30% 40%, " + GOLD + " 0%, transparent 60%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 18px", background: "linear-gradient(transparent, rgba(0,0,0,0.9))" }}>
        {tags && <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          {tags.map(t => <span key={t} className="pill pill-gold">{t}</span>)}
        </div>}
        <h2 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 22, fontWeight: 500, lineHeight: 1.2, color: WHITE, marginBottom: 6 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: "#AAA090", fontWeight: 300, lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
    </div>
  );
}

function HomeScreen({ onNavigate }) {
  const announcements = [
    { id: 1, cat: "Opening", title: "Frida Kahlo: Beyond the Canvas", desc: "Our landmark exhibition explores the revolutionary artist's life through immersive audio and visual installations.", date: "Now Open", hot: true },
    { id: 2, cat: "New", title: "Digital Pavilion Launches", desc: "Three guest digital artists join Studio HATCH for an intimate showcase of generative and interactive works.", date: "May 2026" },
    { id: 3, cat: "Store", title: "Limited Edition Prints Available", desc: "Exclusive archival prints curated in collaboration with our resident artists. Gold members get 48hr early access.", date: "This Week" },
  ];
  const upcoming = [
    { id: 1, name: "Guided Tour: Frida Kahlo", date: "Sat 18 May", time: "14:00", spots: 4 },
    { id: 2, name: "Workshop: Encaustic Painting", date: "Sun 19 May", time: "11:00", spots: 12 },
    { id: 3, name: "Artist Talk: Digital Futures", date: "Thu 23 May", time: "19:00", spots: 0 },
  ];
  const [reminded, setReminded] = useState({});

  return (
    <div style={{ padding: "0 0 24px" }}>
      <div style={{ padding: "56px 24px 24px", background: `linear-gradient(${ONYX} 60%, transparent)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, fontWeight: 500 }}>Good Evening</p>
            <h1 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 30, fontWeight: 500, color: WHITE, lineHeight: 1.1 }}>Studio HATCH</h1>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: GOLD_DIM + "33", border: `1px solid ${GOLD_DIM}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: GOLD }}>GM</span>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <span className="pill pill-gold">
            <span className="gold-dot" style={{ width: 5, height: 5 }} />
            Frida Kahlo Exhibition — Live Now
          </span>
        </div>
      </div>

      <div style={{ padding: "0 24px" }}>
        <ExhibitionHero
          title="Frida Kahlo: Beyond the Canvas"
          subtitle="An immersive audio journey through pain, love, and radical self-expression"
          tags={["Featured Exhibition", "Audio Guide"]}
          height={240}
          onClick={() => onNavigate("audio")}
        />
      </div>

      <div style={{ padding: "28px 24px 0" }}>
        <p className="section-title">What's New</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {announcements.map((a, i) => (
            <div key={a.id} className="card-dark fade-in" style={{ padding: "16px 18px", animationDelay: `${i * 0.08}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span className="pill" style={{ background: a.hot ? GOLD + "18" : "#2A2A2222", border: `0.5px solid ${a.hot ? GOLD_DIM : "#3A3A32"}`, color: a.hot ? GOLD_LIGHT : MUTED }}>{a.cat}</span>
                <span style={{ fontSize: 11, color: MUTED }}>{a.date}</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: WHITE, marginBottom: 6, lineHeight: 1.3 }}>{a.title}</h3>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 24px 0" }}>
        <p className="section-title">Upcoming Events</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {upcoming.map((e, i) => (
            <div key={e.id} className="card-dark" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ textAlign: "center", minWidth: 40 }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: GOLD, fontFamily: "'Bodoni Moda', serif", lineHeight: 1 }}>{e.date.split(" ")[1]}</div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 2, letterSpacing: "0.05em" }}>{e.date.split(" ")[0].toUpperCase()}</div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: WHITE, lineHeight: 1.3 }}>{e.name}</p>
                <p style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{e.time} · {e.spots === 0 ? <span style={{ color: "#E07070" }}>Full</span> : <span style={{ color: "#8BB87A" }}>{e.spots} spots left</span>}</p>
              </div>
              <button className="touch-btn" onClick={() => setReminded(r => ({ ...r, [e.id]: !r[e.id] }))}
                style={{ border: `0.5px solid ${reminded[e.id] ? GOLD_DIM : "#3A3A32"}`, borderRadius: 8, padding: "7px 12px", fontSize: 11, color: reminded[e.id] ? GOLD : MUTED, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", background: reminded[e.id] ? GOLD + "14" : "transparent" }}>
                {reminded[e.id] ? "✓ Set" : "Remind"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventsScreen() {
  const [tab, setTab] = useState("workshops");
  const workshops = [
    { id: 1, name: "Encaustic Wax Painting", date: "Sun 19 May", time: "11:00–14:00", price: "₺850", level: "Beginner", spots: 12, desc: "Explore the ancient technique of painting with heated beeswax mixed with Damar resin and pigments." },
    { id: 2, name: "Botanical Illustration", date: "Sat 25 May", time: "10:00–13:00", price: "₺650", level: "All Levels", spots: 8, desc: "Create delicate, detailed botanical drawings using ink and watercolour. Materials provided." },
    { id: 3, name: "Lino Print Masterclass", date: "Sun 1 Jun", time: "14:00–17:00", price: "₺950", level: "Intermediate", spots: 6, desc: "A hands-on session with resident printmaker Selin Yıldız. Limited to 6 participants." },
    { id: 4, name: "Ceramic Hand Building", date: "Sat 7 Jun", time: "11:00–15:00", price: "₺1,100", level: "All Levels", spots: 10, desc: "Shape clay by hand using pinch, coil, and slab techniques. Includes glazing and firing." },
  ];
  const products = [
    { id: 1, name: "Archive Print No. 1", sub: "Frida Series — Limited to 50", price: "₺2,800", tag: "Gold Early Access" },
    { id: 2, name: "Studio HATCH Linen Tote", sub: "Natural / Onyx · Hand-printed", price: "₺480", tag: "New" },
    { id: 3, name: "Ceramic Bead Necklace", sub: "By resident artist Zara Kaya", price: "₺1,200", tag: "" },
    { id: 4, name: "Sketchbook — Gold Edition", sub: "200gsm · Handbound · 120 pages", price: "₺320", tag: "" },
  ];

  return (
    <div style={{ padding: "0 0 24px" }}>
      <div style={{ padding: "56px 24px 20px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, fontWeight: 500 }}>Discover</p>
        <h1 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 28, fontWeight: 500, color: WHITE, marginTop: 4 }}>Workshops & Store</h1>
      </div>

      <div style={{ display: "flex", padding: "0 24px", gap: 8, marginBottom: 24 }}>
        {["workshops", "products"].map(t => (
          <button key={t} className="touch-btn" onClick={() => setTab(t)}
            style={{ flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", border: `0.5px solid ${tab === t ? GOLD_DIM : "#2A2A22"}`, color: tab === t ? GOLD : MUTED, background: tab === t ? GOLD + "12" : ONYX2, transition: "all 0.25s" }}>
            {t === "workshops" ? "Workshops" : "Store"}
          </button>
        ))}
      </div>

      {tab === "workshops" && (
        <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          {workshops.map((w, i) => (
            <div key={w.id} className="card-dark fade-in" style={{ padding: "18px", animationDelay: `${i * 0.06}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 500, color: WHITE, lineHeight: 1.3 }}>{w.name}</h3>
                  <p style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{w.date} · {w.time}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: GOLD }}>{w.price}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{w.spots} spots</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 12 }}>{w.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="pill pill-muted">{w.level}</span>
                <button className="touch-btn" style={{ background: GOLD + "18", border: `0.5px solid ${GOLD_DIM}`, color: GOLD, padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>Book Now</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "products" && (
        <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
          {products.map((p, i) => (
            <div key={p.id} className="card-dark fade-in" style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", animationDelay: `${i * 0.06}s` }}>
              <div style={{ flex: 1 }}>
                {p.tag && <span className="pill pill-gold" style={{ marginBottom: 8, display: "inline-flex" }}>{p.tag}</span>}
                <h3 style={{ fontSize: 15, fontWeight: 500, color: WHITE }}>{p.name}</h3>
                <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{p.sub}</p>
              </div>
              <div style={{ textAlign: "right", marginLeft: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: GOLD }}>{p.price}</div>
                <button className="touch-btn" style={{ marginTop: 8, background: "transparent", border: `0.5px solid #3A3A32`, color: MUTED, padding: "6px 14px", borderRadius: 8, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>Add</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AudioScreen({ isPlaying, setIsPlaying, currentTrack, setCurrentTrack }) {
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(22);
  const [headphonesOptimized, setHeadphonesOptimized] = useState(true);
  const [showChapters, setShowChapters] = useState(false);
  const [showBioModal, setShowBioModal] = useState(null);
  const [activeView, setActiveView] = useState("list");
  const progressRef = useRef(null);

  const exhibitions = {
    frida: {
      id: "frida",
      type: "exhibition",
      title: "Frida Kahlo: Beyond the Canvas",
      subtitle: "The Masterpiece Gallery · Main Exhibition",
      duration: "48 min",
      chapters: [
        { id: 1, title: "Prologue — A Life in Fragments", time: "0:00" },
        { id: 2, title: "Early Life — Coyoacán", time: "4:15" },
        { id: 3, title: "The Accident", time: "9:40" },
        { id: 4, title: "The Blue House", time: "17:20" },
        { id: 5, title: "Diego & Devotion", time: "24:55" },
        { id: 6, title: "Political Awakening", time: "33:10" },
        { id: 7, title: "Legacy & Influence", time: "41:00" },
      ],
      currentChapter: 2,
    }
  };

  const installations = [
    { id: "inst1", type: "installation", title: "Memoria Viva", artist: "Laila Osei", medium: "Generative video, spatial audio", bio: "Laila Osei is a Ghanaian-British new media artist whose practice interrogates memory, loss, and the body through generative systems. Her work has been shown at the Serpentine, Tate Modern, and documenta 15.", duration: "12 min" },
    { id: "inst2", type: "installation", title: "Ruido Blanco", artist: "Kenji Mori", medium: "Interactive soundscape", bio: "Kenji Mori works at the intersection of noise music, data sculpture, and spatial computing. Based in Tokyo and Berlin, his practice treats silence as material.", duration: "8 min" },
    { id: "inst3", type: "installation", title: "Terra Incognita", artist: "Ayşe Çelik", medium: "AI-generated landscape & binaural audio", bio: "Bursa-based artist Ayşe Çelik creates immersive environments using machine learning trained on historical maps and oral histories from Anatolia.", duration: "15 min" },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => p < 100 ? p + 0.05 : p);
    }, 300);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlay = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setActiveView("player");
    setProgress(0);
  };

  const formatTime = (pct, total = 2880) => {
    const secs = Math.floor((pct / 100) * total);
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  };

  return (
    <div style={{ minHeight: "100%", background: BONE }}>
      {activeView === "list" && (
        <div style={{ padding: "0 0 24px" }}>
          <div style={{ background: ONYX, padding: "56px 24px 24px" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, fontWeight: 500 }}>Audio Experience</p>
            <h1 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 26, fontWeight: 500, color: WHITE, marginTop: 4, lineHeight: 1.2 }}>Sesli Anlatım</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
              <button onClick={() => setHeadphonesOptimized(h => !h)} className="touch-btn"
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 20, border: `0.5px solid ${headphonesOptimized ? GOLD_DIM : "#3A3A32"}`, background: headphonesOptimized ? GOLD + "18" : "transparent", color: headphonesOptimized ? GOLD_LIGHT : MUTED, fontSize: 11, letterSpacing: "0.06em", fontFamily: "'DM Sans', sans-serif" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>
                {headphonesOptimized ? "Headphones Active" : "Standard Mode"}
              </button>
            </div>
          </div>

          <div style={{ padding: "24px 20px" }}>
            <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8B7A60", fontWeight: 600, marginBottom: 14 }}>The Masterpiece Gallery</p>
            <div onClick={() => handlePlay(exhibitions.frida)}
              style={{ background: ONYX, borderRadius: 14, overflow: "hidden", position: "relative", cursor: "pointer", border: `0.5px solid #2A2A22` }}>
              <div style={{ height: 180, background: "linear-gradient(160deg, #2D1208 0%, #1A0A05 50%, #0D0D0D 100%)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, opacity: 0.2, backgroundImage: `radial-gradient(ellipse at 40% 50%, ${GOLD} 0%, transparent 65%)` }} />
                <div style={{ textAlign: "center", zIndex: 1, padding: "0 20px" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: GOLD_LIGHT, letterSpacing: "0.15em", marginBottom: 8, textTransform: "uppercase" }}>Main Exhibition</p>
                  <h2 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 24, fontWeight: 500, color: WHITE, lineHeight: 1.2, fontStyle: "italic" }}>Frida Kahlo</h2>
                  <p style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 14, color: "#AAA090", marginTop: 4 }}>Beyond the Canvas</p>
                </div>
              </div>
              <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>7 chapters · 48 min</p>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={ONYX} stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: "0 20px 24px" }}>
            <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8B7A60", fontWeight: 600, marginBottom: 14 }}>The Digital Pavilion</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {installations.map((inst, i) => (
                <div key={inst.id} style={{ background: WHITE, border: "0.5px solid #DDD8CC", borderRadius: 12, padding: "16px", display: "flex", gap: 14, alignItems: "center" }}>
                  <button onClick={() => handlePlay(inst)} className="touch-btn"
                    style={{ width: 42, height: 42, minWidth: 42, borderRadius: "50%", background: ONYX, border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={GOLD} stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </button>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 16, fontWeight: 500, color: ONYX, lineHeight: 1.2, fontStyle: "italic" }}>{inst.title}</h3>
                    <p style={{ fontSize: 12, color: "#8B7A60", marginTop: 3 }}>{inst.artist} · {inst.duration}</p>
                    <p style={{ fontSize: 11, color: "#AAA090", marginTop: 2 }}>{inst.medium}</p>
                  </div>
                  <button onClick={() => setShowBioModal(inst)} className="touch-btn"
                    style={{ padding: "6px 12px", border: `0.5px solid ${GOLD_DIM}`, borderRadius: 8, background: "transparent", color: GOLD_DIM, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>Bio</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === "player" && currentTrack && (
        <div style={{ background: ONYX, minHeight: "100%", padding: "56px 0 24px" }}>
          <div style={{ padding: "0 24px", marginBottom: 28 }}>
            <button onClick={() => setActiveView("list")} className="touch-btn"
              style={{ display: "flex", alignItems: "center", gap: 8, color: MUTED, fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back to Guide
            </button>

            <div style={{ textAlign: "center", padding: "0 16px", marginBottom: 32 }}>
              {currentTrack.type === "exhibition" ? (
                <>
                  <div style={{ width: 120, height: 120, borderRadius: "50%", background: `linear-gradient(135deg, #2D1208, #0D0D0D)`, border: `2px solid ${GOLD_DIM}33`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", opacity: 0.25, backgroundImage: `radial-gradient(circle at 50% 50%, ${GOLD}, transparent 70%)` }} />
                    <span style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 13, color: GOLD_LIGHT, textAlign: "center", lineHeight: 1.3, fontStyle: "italic", zIndex: 1, padding: "0 12px" }}>Frida Kahlo</span>
                  </div>
                  <p style={{ fontSize: 11, letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase", marginBottom: 8 }}>Main Exhibition</p>
                  <h2 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 22, fontWeight: 500, color: WHITE, lineHeight: 1.2, fontStyle: "italic" }}>{currentTrack.title}</h2>
                  <p style={{ fontSize: 13, color: MUTED, marginTop: 8 }}>Ch. {currentTrack.currentChapter} — {currentTrack.chapters[currentTrack.currentChapter - 1]?.title}</p>
                </>
              ) : (
                <>
                  <div style={{ width: 120, height: 120, borderRadius: 16, background: `linear-gradient(135deg, #0A151A, #0D0D0D)`, border: `0.5px solid #2A2A22`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GOLD_DIM} strokeWidth="0.8" strokeLinecap="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>
                  </div>
                  <p style={{ fontSize: 11, letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase", marginBottom: 8 }}>Digital Pavilion</p>
                  <h2 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 22, fontWeight: 500, color: WHITE, lineHeight: 1.2, fontStyle: "italic" }}>{currentTrack.title}</h2>
                  <p style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>{currentTrack.artist}</p>
                  <p style={{ fontSize: 11, color: "#555040", marginTop: 4 }}>{currentTrack.medium}</p>
                </>
              )}
            </div>

            {isPlaying && (
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 3, height: 32, marginBottom: 24 }}>
                {[...Array(18)].map((_, i) => (
                  <div key={i} className="waveform-bar" style={{ height: `${20 + Math.random() * 24}px`, animationDelay: `${i * 0.07}s`, opacity: 0.6 + Math.random() * 0.4 }} />
                ))}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <input type="range" min="0" max="100" value={progress} onChange={e => setProgress(+e.target.value)} className="range-gold" ref={progressRef} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 11, color: MUTED }}>{formatTime(progress)}</span>
                <span style={{ fontSize: 11, color: MUTED }}>{currentTrack.duration || "48:00"}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, marginBottom: 28 }}>
              <button className="touch-btn" onClick={() => setProgress(p => Math.max(0, p - 0.52))}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.2" strokeLinecap="round">
                  <polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/>
                </svg>
              </button>
              <button className="touch-btn" onClick={() => setIsPlaying(p => !p)}
                style={{ width: 64, height: 64, borderRadius: "50%", background: GOLD, border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {isPlaying
                  ? <svg width="24" height="24" viewBox="0 0 24 24" fill={ONYX} stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  : <svg width="24" height="24" viewBox="0 0 24 24" fill={ONYX} stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
              </button>
              <button className="touch-btn" onClick={() => setProgress(p => Math.min(100, p + 0.52))}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.2" strokeLinecap="round">
                  <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>
                </svg>
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/></svg>
              <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(+e.target.value)} className="range-gold" style={{ flex: 1 }} />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
            </div>

            {currentTrack.type === "exhibition" && (
              <button onClick={() => setShowChapters(c => !c)} className="touch-btn"
                style={{ width: "100%", marginTop: 20, padding: "12px", border: `0.5px solid ${GOLD_DIM}55`, borderRadius: 10, color: GOLD, fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: GOLD + "0C", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                Chapters
              </button>
            )}

            {currentTrack.type === "installation" && (
              <button onClick={() => setShowBioModal(currentTrack)} className="touch-btn"
                style={{ width: "100%", marginTop: 20, padding: "12px", border: `0.5px solid ${GOLD_DIM}55`, borderRadius: 10, color: GOLD, fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: GOLD + "0C" }}>
                View Artist Bio
              </button>
            )}
          </div>

          {showChapters && currentTrack.type === "exhibition" && (
            <div style={{ padding: "0 24px", marginTop: 8 }}>
              <p className="section-title" style={{ color: MUTED }}>Chapters</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {currentTrack.chapters.map((ch) => (
                  <button key={ch.id} className="touch-btn" onClick={() => { setProgress((ch.id - 1) * 14); }}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 8, border: `0.5px solid ${currentTrack.currentChapter === ch.id ? GOLD_DIM : "#2A2A22"}`, background: currentTrack.currentChapter === ch.id ? GOLD + "12" : "transparent", textAlign: "left", fontFamily: "'DM Sans', sans-serif", width: "100%", transition: "all 0.2s" }}>
                    <span style={{ fontSize: 13, color: currentTrack.currentChapter === ch.id ? GOLD_LIGHT : WHITE }}>{ch.title}</span>
                    <span style={{ fontSize: 12, color: MUTED }}>{ch.time}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showBioModal && (
        <div className={`modal-overlay open`} onClick={() => setShowBioModal(null)} style={{ position: "fixed", zIndex: 500 }}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 3, background: "#3A3A32", borderRadius: 2, margin: "0 auto 24px" }} />
            <div style={{ border: `1px solid ${GOLD_DIM}55`, borderRadius: 10, padding: "16px 18px", marginBottom: 20 }}>
              <p style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 11, fontStyle: "italic", color: GOLD_DIM, letterSpacing: "0.1em", marginBottom: 6 }}>Digital Pavilion</p>
              <h3 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 22, fontWeight: 500, color: WHITE, fontStyle: "italic" }}>{showBioModal.title}</h3>
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: GOLD_LIGHT, marginBottom: 4 }}>{showBioModal.artist}</p>
            <p style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>{showBioModal.medium}</p>
            <p style={{ fontSize: 14, color: "#AAA090", lineHeight: 1.7 }}>{showBioModal.bio}</p>
            <button onClick={() => setShowBioModal(null)} className="touch-btn"
              style={{ width: "100%", marginTop: 24, padding: "14px", border: `0.5px solid #3A3A32`, borderRadius: 12, color: MUTED, fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: ONYX2 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileScreen() {
  const [loggedIn, setLoggedIn] = useState(true);
  const stats = [
    { label: "Workshops", value: "3" },
    { label: "Events Attended", value: "11" },
    { label: "Tracks Played", value: "24" },
  ];
  const perks = [
    "48hr early access to exclusive products",
    "Priority workshop booking",
    "Private curator events & preview evenings",
    "10% off all Studio HATCH purchases",
    "Monthly Gold Member newsletter",
  ];

  return (
    <div style={{ padding: "0 0 32px", background: ONYX, minHeight: "100%" }}>
      <div style={{ background: ONYX2, padding: "56px 24px 28px", borderBottom: "0.5px solid #2A2A22" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: GOLD_DIM + "33", border: `1.5px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 22, color: GOLD, fontStyle: "italic" }}>GM</span>
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 18, height: 18, borderRadius: "50%", background: GOLD, border: `2px solid ${ONYX2}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill={ONYX} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
          </div>
          <div>
            <h2 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 22, fontWeight: 500, color: WHITE }}>Gül Melis</h2>
            <p style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>Member since March 2024</p>
            <span className="pill pill-gold" style={{ marginTop: 6, display: "inline-flex" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill={GOLD} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Gold Member
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: ONYX, border: "0.5px solid #2A2A22", borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: GOLD, fontFamily: "'Bodoni Moda', serif" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: MUTED, marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 24px 0" }}>
        <div style={{ background: `linear-gradient(135deg, #1E1505 0%, #0D0D08 100%)`, border: `1px solid ${GOLD_DIM}55`, borderRadius: 14, padding: "20px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, fontWeight: 500 }}>Gold Membership</span>
          </div>
          <p style={{ fontSize: 13, color: "#AAA090", lineHeight: 1.6, marginBottom: 16 }}>Your exclusive access to the heart of Studio HATCH.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {perks.map(p => (
              <div key={p} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD_DIM} strokeWidth="2" strokeLinecap="round" style={{ marginTop: 2, flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontSize: 13, color: "#8B7A60", lineHeight: 1.4 }}>{p}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `0.5px solid ${GOLD_DIM}33`, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: MUTED }}>Renews 12 Jun 2026</span>
            <span style={{ fontSize: 12, color: GOLD }}>Active</span>
          </div>
        </div>

        {[
          { label: "Edit Profile", icon: "person" },
          { label: "Booking History", icon: "clock" },
          { label: "Notifications", icon: "bell" },
          { label: "Language / Dil", icon: "globe" },
          { label: "Sign Out", icon: "exit", danger: true },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "0.5px solid #1A1A14" }}>
            <span style={{ fontSize: 14, color: item.danger ? "#E07070" : WHITE }}>{item.label}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={item.danger ? "#E07070" : MUTED} strokeWidth="1.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudioHatch() {
  const [activeTab, setActiveTab] = useState("home");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  const tabs = [
    { id: "home", label: "Home" },
    { id: "events", label: "Discover" },
    { id: "audio", label: "Audio" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <>
      <style>{globalStyles}</style>
      <div className="hatch-app">
        <div className={`screen ${activeTab === "home" ? "active" : ""}`}>
          <HomeScreen onNavigate={setActiveTab} />
        </div>
        <div className={`screen ${activeTab === "events" ? "active" : ""}`}>
          <EventsScreen />
        </div>
        <div className={`screen ${activeTab === "audio" ? "active" : ""}`}>
          <AudioScreen isPlaying={isPlaying} setIsPlaying={setIsPlaying} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack} />
        </div>
        <div className={`screen ${activeTab === "profile" ? "active" : ""}`}>
          <ProfileScreen />
        </div>

        <nav className="bottom-nav">
          {tabs.map(t => (
            <button key={t.id} className={`nav-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
              {t.id === "audio" && isPlaying ? (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 20 }}>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ width: 3, borderRadius: 2, background: activeTab === "audio" ? GOLD : MUTED, animation: `wave 1s ease-in-out ${i * 0.15}s infinite`, height: `${8 + i * 4}px` }} />
                  ))}
                </div>
              ) : (
                <NavIcon id={t.id} />
              )}
              <span className="nav-label">{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
