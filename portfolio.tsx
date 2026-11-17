"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ArrowRight, Pause, Play, MousePointer2, RotateCcw, Mail, Github, Linkedin, Instagram, Globe2, Code2, Sparkles } from "lucide-react";

type Agent = { name: string; color: string };
type Task = { el: HTMLElement; agent: number; start: number; duration: number };
const AGENTS: Agent[] = [
  { name: "Scout", color: "#ff3b2f" }, { name: "Layout", color: "#53b7ff" }, { name: "Typeset", color: "#f3b84b" },
  { name: "Motion", color: "#a4d96c" }, { name: "QA", color: "#db8bff" }, { name: "Deploy", color: "#ff8b58" },
  { name: "Copy", color: "#6bd7c5" }, { name: "Lint", color: "#a5a5ff" }, { name: "Index", color: "#e3d16e" },
  { name: "Render", color: "#ff7098" }, { name: "Palette", color: "#82b9ff" }, { name: "Review", color: "#b8d879" },
];
const skills = ["Frontend Web Development", "HTML", "CSS", "JavaScript", "Responsive Web Design", "Interactive UI/UX", "CSS & Web Animations", "Creative Coding", "AI-Assisted Development", "Website Deployment & Hosting", "GitHub & Version Control"];
const projects = [
  { no: "01", title: "Personal portfolio & interactive web experiences", kind: "Independent digital project", bullets: ["Personal portfolio experiences", "Interactive interface exploration", "Creative development through practical experimentation"], chips: ["HTML", "CSS", "JavaScript", "Creative coding"] },
  { no: "02", title: "Creative website concepts", kind: "Concepts & animated interfaces", bullets: ["Premium, modern website concepts", "Animated interfaces and motion exploration", "Responsive experiences for desktop and mobile"], chips: ["Web animations", "UI/UX", "Responsive design"] },
  { no: "03", title: "Hosting & infrastructure projects", kind: "Independent technical exploration", bullets: ["Hosting and infrastructure-related projects", "Website deployment and hosting workflows", "Experimental development with AI-assisted workflows"], chips: ["Deployment", "Hosting", "GitHub", "AI-assisted"] },
];

export default function Portfolio() {
  const [agentsOn, setAgentsOn] = useState(true);
  const [paused, setPaused] = useState(false);
  const [touring, setTouring] = useState(false);
  const [booted, setBooted] = useState(false);
  const [builtCount, setBuiltCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [copyState, setCopyState] = useState("Copy email");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const queueRef = useRef<HTMLElement[]>([]);
  const activeRef = useRef<Task[]>([]);
  const builtRef = useRef(new WeakSet<HTMLElement>());
  const pausedRef = useRef(false);
  const agentsRef = useRef(true);
  const tourRef = useRef<{ start: number; duration: number; from: number; to: number } | null>(null);
  const tourStoppedRef = useRef(false);
  const heroDoneRef = useRef(false);
  const loopRef = useRef<number | null>(null);

  const cursorCount = 12;

  const markBuilt = useCallback((el: HTMLElement) => {
    if (builtRef.current.has(el)) return;
    builtRef.current.add(el);
    el.classList.add("is-built");
    el.style.removeProperty("--build-progress");
    el.style.removeProperty("--build-cut");
    el.removeAttribute("data-building");
    if (el.closest("#hero")) {
      const heroEls = Array.from(document.querySelectorAll<HTMLElement>("#hero [data-build]"));
      if (heroEls.every((item) => builtRef.current.has(item))) heroDoneRef.current = true;
    }
    setBuiltCount((n) => n + 1);
  }, []);

  const stopTour = useCallback(() => {
    tourStoppedRef.current = true;
    tourRef.current = null;
    setTouring(false);
    if (new URLSearchParams(location.search).has("tour")) {
      const url = new URL(location.href); url.searchParams.delete("tour"); url.searchParams.delete("agents"); history.replaceState({}, "", url);
    }
  }, []);

  const startTour = useCallback(() => {
    location.href = `${location.pathname}?agents=on&tour=1`;
  }, []);

  const toggleAgents = useCallback(() => {
    setAgentsOn((value) => {
      const next = !value; agentsRef.current = next;
      try { localStorage.setItem("velroyn-agents", next ? "on" : "off"); } catch {}
      if (!next) {
        queueRef.current = [];
        activeRef.current.forEach((task) => markBuilt(task.el));
        activeRef.current = [];
        document.documentElement.classList.add("no-build");
      } else {
        document.documentElement.classList.remove("no-build");
        document.documentElement.classList.add("build-mode");
        document.querySelectorAll<HTMLElement>("[data-build]:not(.is-built)").forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight) queueRef.current.push(el);
        });
      }
      return next;
    });
  }, [markBuilt]);

  useEffect(() => {
    const forced = new URLSearchParams(location.search).get("agents");
    const saved = (() => { try { return localStorage.getItem("velroyn-agents"); } catch { return null; } })();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const enabled = forced === "on" || (forced !== "off" && saved !== "off" && (!reduced || saved === "on"));
    setAgentsOn(enabled); agentsRef.current = enabled;
    if (!enabled) document.documentElement.classList.add("no-build");
    else document.documentElement.classList.add("build-mode");
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-build]"));
    if (!enabled) { elements.forEach(markBuilt); setBooted(true); }
    else {
      const timer = window.setTimeout(() => setBooted(true), 1050);
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          if (builtRef.current.has(el) || el.hasAttribute("data-building") || queueRef.current.includes(el)) return;
          if (el.getBoundingClientRect().bottom < 0) markBuilt(el);
          else queueRef.current.push(el);
        });
        queueRef.current.sort((a, b) => elements.indexOf(a) - elements.indexOf(b));
      }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
      elements.forEach((el) => observerRef.current?.observe(el));
      return () => { window.clearTimeout(timer); observerRef.current?.disconnect(); };
    }
  }, [markBuilt]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => { agentsRef.current = agentsOn; }, [agentsOn]);

  useEffect(() => {
    const tourParam = new URLSearchParams(location.search).get("tour") === "1";
    if (!tourParam) return;
    setTouring(true); tourStoppedRef.current = false;
  }, []);

  useEffect(() => {
    const onWheel = () => { if (touring) stopTour(); };
    const onTouch = () => { if (touring) stopTour(); };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && touring) stopTour();
      if ((event.target as HTMLElement)?.tagName === "INPUT" || (event.target as HTMLElement)?.tagName === "TEXTAREA") return;
      if (event.key.toLowerCase() === "t") startTour();
      if (event.key.toLowerCase() === "a") toggleAgents();
      if (event.key.toLowerCase() === "p") setPaused((p) => !p);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("wheel", onWheel); window.removeEventListener("touchstart", onTouch); window.removeEventListener("keydown", onKey); };
  }, [startTour, stopTour, toggleAgents, touring]);

  useEffect(() => {
    let last = 0;
    const tick = (now: number) => {
      if (!last) last = now;
      if (agentsRef.current && !pausedRef.current) {
        while (activeRef.current.length < 6 && queueRef.current.length) {
          const el = queueRef.current.shift()!;
          if (builtRef.current.has(el) || !el.isConnected) continue;
          const maxAgents = window.matchMedia("(max-width: 700px)").matches ? 6 : cursorCount;
          const agent = (activeRef.current.length + Math.floor(now / 1800)) % maxAgents;
          el.setAttribute("data-building", "true");
          const duration = Math.max(900, Math.min(1900, el.dataset.build === "type" ? 1450 : 1120));
          activeRef.current.push({ el, agent, start: now, duration });
        }
        activeRef.current = activeRef.current.filter((task) => {
          const rect = task.el.getBoundingClientRect();
          const cursor = document.querySelector<HTMLElement>(`[data-agent-cursor="${task.agent}"]`);
          const progress = Math.min(1, Math.max(0, (now - task.start) / task.duration));
          const eased = progress < 0.7 ? 1 - Math.pow(1 - progress / 0.7, 3) : 1;
          if (cursor) {
            const startX = task.agent % 2 === 0 ? -35 : window.innerWidth + 35;
            const startY = 80 + (task.agent % 4) * 54;
            const targetX = rect.left + Math.min(rect.width * 0.72, Math.max(24, rect.width / 2));
            const targetY = rect.top + Math.min(rect.height / 2, 55);
            const move = Math.min(1, progress / 0.58);
            const moveEase = 1 - Math.pow(1 - move, 3);
            cursor.style.transform = `translate3d(${startX + (targetX - startX) * moveEase}px, ${startY + (targetY - startY) * moveEase}px, 0)`;
            cursor.style.opacity = progress > 0.94 ? "0" : "1";
            cursor.style.setProperty("--agent-color", AGENTS[task.agent].color);
          }
          task.el.style.setProperty("--build-progress", String(eased));
          task.el.style.setProperty("--build-cut", `${(1 - eased) * 100}%`);
          if (progress >= 1) { markBuilt(task.el); return false; }
          return true;
        });
        setActiveCount(activeRef.current.length);
      }
      if (touring && tourParamReady() && heroDoneRef.current && !tourRef.current && !tourStoppedRef.current) {
        tourRef.current = { start: now, duration: 19000, from: window.scrollY, to: document.documentElement.scrollHeight - window.innerHeight };
      }
      if (tourRef.current && !tourStoppedRef.current) {
        const t = Math.min(1, (now - tourRef.current.start) / tourRef.current.duration);
        const ease = t < 0.18 ? 0.5 * Math.pow(t / 0.18, 2) : t > 0.84 ? 1 - 0.5 * Math.pow((1 - t) / 0.16, 2) : 0.5 + (t - 0.18) / 0.66 * 0.5;
        window.scrollTo(0, tourRef.current.from + (tourRef.current.to - tourRef.current.from) * ease);
        if (t >= 1) stopTour();
      }
      loopRef.current = requestAnimationFrame(tick);
    };
    const tourParamReady = () => new URLSearchParams(location.search).get("tour") === "1";
    loopRef.current = requestAnimationFrame(tick);
    return () => { if (loopRef.current) cancelAnimationFrame(loopRef.current); };
  }, [cursorCount, markBuilt, stopTour, touring]);

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText("goluidipangshuofficial@gmail.com"); setCopyState("Copied"); window.setTimeout(() => setCopyState("Copy email"), 1800); }
    catch { window.location.href = "mailto:goluidipangshuofficial@gmail.com"; }
  };

  return <main>
    <div className={`boot-screen ${booted ? "boot-done" : ""}`} aria-hidden="true"><div className="boot-mark">V<span>.</span></div><div className="boot-track"><i /></div><p>INITIALISING CREATIVE SYSTEMS</p></div>
    <div className="agent-layer" aria-hidden="true">{AGENTS.slice(0, cursorCount).map((agent, i) => <div className="agent-cursor" data-agent-cursor={i} key={agent.name} style={{ "--agent-color": agent.color } as React.CSSProperties}><MousePointer2 size={19} strokeWidth={2.8} /><span className="agent-tag"><span className="robot"><i /><i /><b /></span>{agent.name}</span></div>)}</div>

    <header className="topbar"><a href="#hero" className="wordmark">DG<span>.</span></a><nav><a href="#work">Work</a><a href="#stack">Stack</a><a href="#record">Record</a><a href="#about">About</a><a href="#contact">Contact</a></nav><a className="availability" href="mailto:goluidipangshuofficial@gmail.com"><span /> Open to opportunities</a></header>

    <section id="hero" className="hero section-shell">
      <div className="hero-word" data-build="wipe" aria-hidden="true">PORTFOLIO</div>
      <div className="hero-glow" />
      <div className="hero-copy">
        <p className="hand-line" data-build="type">Building things with intent.</p>
        <p className="eyebrow" data-build="type">HELLO, I’M</p>
        <h1 data-build="wipe">DIPANGSHU<br /><span>GOLUI</span></h1>
        <p className="hero-role" data-build="type">Founder <i>—</i> Web Developer <i>—</i> Creative Technologist</p>
        <p className="hero-bio" data-build="type">Self-taught developer exploring modern web experiences, creative coding and interactive design — turning ideas into functional digital products.</p>
        <div className="hero-actions" data-build="pop"><a href="#work" className="button button-primary">View work <ArrowUpRight size={17} /></a><a href="#contact" className="text-link">Let’s connect <ArrowDownRight size={16} /></a></div>
        <p className="location-line" data-build="type"><Globe2 size={13} /> BASED IN WEST BENGAL, INDIA</p>
      </div>
      <div className="hero-person" data-build="pop"><div className="portrait-halo" /><Image src="/headshot.jpg" alt="Portrait of Dipangshu Golui" fill priority sizes="(max-width: 700px) 80vw, 48vw" className="portrait" /></div>
      <div className="hero-stats" data-build="pop"><div><strong>~3</strong><span>YEARS OF<br />HANDS-ON EXPERIENCE</span></div><div><strong>02</strong><span>FLUENT<br />LANGUAGES</span></div><div><strong>01</strong><span>INDEPENDENT<br />STUDIO FOUNDED</span></div></div>
      <div className="hero-bottom"><span>INDEPENDENTLY BUILT / ALWAYS LEARNING</span><a href="#work">SCROLL TO EXPLORE <ArrowDownRight size={14} /></a></div>
    </section>

    <section id="work" className="section section-shell">
      <div className="section-head"><div><p className="section-index" data-build="type">01 / SELECTED EXPERIENCE</p><h2 data-build="wipe">Work that <em>ships.</em></h2><p className="section-intro" data-build="type">Independent digital projects, creative concepts and practical experiments — built around function and feeling.</p></div><div className="head-metrics" data-build="pop"><div><b>~3</b><span>YEARS EXPLORING</span></div><div><b>01</b><span>STUDIO FOUNDED</span></div><div><b>02</b><span>FLUENT LANGUAGES</span></div></div></div>
      <div className="project-list">{projects.map((project) => <article className="project-card" data-build="pop" key={project.no}><div className="project-number">/{project.no}</div><div className="project-main"><p className="project-kind">{project.kind}</p><h3>{project.title}</h3><ul>{project.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul><div className="chips">{project.chips.map((chip) => <span key={chip}>{chip}</span>)}</div></div><div className="project-end"><span>INDEPENDENT WORK</span><ArrowUpRight size={20} /></div></article>)}</div>
      <p className="source-note" data-build="type">Project descriptions are grouped from the experience listed in my resume. Public demo and repository links are not listed here.</p>
    </section>

    <section id="stack" className="stack-section section-shell">
      <div className="stack-top"><p className="section-index" data-build="type">02 / TOOLS & PRACTICE</p><h2 data-build="wipe">My working <em>language.</em></h2><p data-build="type">The disciplines and technologies named in my current practice.</p></div>
      <div className="marquee-wrap" data-build="wipe"><div className="marquee-track">{[...skills, ...skills].map((skill, i) => <span key={`${skill}-${i}`}><i />{skill}</span>)}</div></div>
      <div className="stack-foot"><span>CREATIVE DEVELOPMENT</span><span>RESPONSIVE BY DEFAULT</span><span>ALWAYS EXPERIMENTING</span></div>
    </section>

    <section id="record" className="section section-shell">
      <div className="section-head record-head"><div><p className="section-index" data-build="type">03 / THE RECORD</p><h2 data-build="wipe">A work in <em>progress.</em></h2></div><p className="record-summary" data-build="type">A self-directed path shaped by curiosity, independent learning and hands-on projects.</p></div>
      <div className="timeline">
        <article className="timeline-item" data-build="pop"><span className="timeline-dot" /><p>FOUNDING / INDEPENDENT STUDIO</p><h3>Founder — Velroyn Web Studios</h3><span className="timeline-place">Independent Web Development Studio</span><ul><li>Founded an independent creative web development studio.</li><li>Focused on premium, modern websites and responsive user experiences.</li><li>Exploring advanced animations, motion graphics and AI-assisted coding workflows.</li></ul></article>
        <article className="timeline-item" data-build="pop"><span className="timeline-dot" /><p>LEARNING / SELF-DIRECTED</p><h3>Independent technical learning</h3><span className="timeline-place">Practical development & experimentation</span><ul><li>Learning through independent projects and experimentation.</li><li>Building familiarity with web development, creative coding and digital innovation.</li></ul></article>
        <article className="timeline-item" data-build="pop"><span className="timeline-dot" /><p>EDUCATION</p><h3>School Education</h3><span className="timeline-place">West Bengal, India</span><ul><li>Self-directed technical learning through independent projects, experimentation and practical development.</li></ul></article>
      </div>
      <p className="source-note">Dates and hackathon participation are not specified in my resume.</p>
    </section>

    <section id="about" className="about-section section-shell">
      <div className="about-left"><p className="section-index" data-build="type">04 / A LITTLE ABOUT ME</p><h2 data-build="wipe">Curiosity<br />into <em>creation.</em></h2><p data-build="type">I’m a self-taught Web Developer and Creative Technologist with an interest in modern web development, creative coding, interactive interfaces and digital innovation.</p><p data-build="type">My approach is hands-on: learn independently, experiment often and bring technical functionality together with premium visual design and user-focused experiences.</p><div className="language-line" data-build="type"><span>LANGUAGES</span><b>Bengali — Fluent</b><b>English — Fluent</b><b>Hindi — Basic conversational understanding</b></div></div>
      <div className="about-right"><div className="skill-panel" data-build="pop"><div className="panel-label"><Code2 size={15} /> SKILL SET</div><div className="skill-grid">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div><div className="principles" data-build="pop"><div className="panel-label"><Sparkles size={15} /> WORKING PRINCIPLES</div><div><b>01</b><span>Learn independently</span></div><div><b>02</b><span>Experiment with intent</span></div><div><b>03</b><span>Build for real use</span></div><div><b>04</b><span>Keep improving the details</span></div></div></div>
    </section>

    <section id="contact" className="contact-section section-shell">
      <p className="section-index" data-build="type">05 / START A CONVERSATION</p><div className="contact-card" data-build="pop"><div className="contact-orbit" /><div className="contact-content"><p>HAVE AN IDEA IN MIND?</p><h2>Let’s make<br /><em>it real.</em></h2><span>Currently pursuing professional opportunities and building an independent creative web studio.</span><div className="contact-actions"><button className="button button-primary" onClick={copyEmail}>{copyState} <Mail size={16} /></button><a className="button button-outline" href="mailto:goluidipangshuofficial@gmail.com">Send an email <ArrowUpRight size={16} /></a></div></div><div className="contact-side"><span>DIRECT CONTACT</span><a href="mailto:goluidipangshuofficial@gmail.com">goluidipangshuofficial@gmail.com <ArrowUpRight size={14} /></a><span>LOCATION</span><b>West Bengal, India</b></div></div>
      <footer><a className="wordmark" href="#hero">DG<span>.</span></a><span>BUILDING DIGITAL EXPERIENCES THROUGH CREATIVITY, TECHNOLOGY & INDEPENDENT LEARNING.</span><a href="#hero">BACK TO TOP ↑</a></footer>
    </section>

    <div className="control-dock" role="group" aria-label="Animation controls"><button onClick={() => setPaused((p) => !p)} aria-label={paused ? "Resume animation" : "Pause animation"} title="P — Pause"><span className="dock-icon">{paused ? <Play size={14} /> : <Pause size={14} />}</span><span>{paused ? "Resume" : "Pause"}</span></button><button onClick={toggleAgents} aria-pressed={agentsOn} title="A — Agents on/off"><span className={`toggle-dot ${agentsOn ? "on" : ""}`} /><span>Agents {agentsOn ? "on" : "off"}</span></button><button onClick={startTour} title="T — Tour"><span className="dock-icon"><RotateCcw size={14} /></span><span>Tour</span></button><span className="dock-status"><i />{activeCount ? `${activeCount} BUILDING` : `${builtCount} BUILT`}</span></div>
  </main>;
}
