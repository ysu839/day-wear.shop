import { useState, useEffect, useRef, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@200;300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:     #060606;
    --cream:   #F0ECE6;
    --gold:    #C8A96A;
    --gold-dim: rgba(200,169,106,0.12);
    --smoke:   #111010;
    --mist:    rgba(240,236,230,0.04);
    --border:  rgba(240,236,230,0.09);
    --ease-lux: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-out: cubic-bezier(0.0, 0, 0.2, 1);
  }

  html { scroll-behavior: smooth; overflow-x: hidden; }

  body {
    background: var(--ink);
    color: var(--cream);
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    cursor: none;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 1px; }
  ::-webkit-scrollbar-thumb { background: rgba(200,169,106,0.4); }
  ::-webkit-scrollbar-track { background: var(--ink); }

  /* ── CURSOR ─────────────────────────────── */
  .dw-cursor-dot {
    position: fixed; pointer-events: none; z-index: 9999;
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--cream); mix-blend-mode: difference;
    transform: translate(-50%,-50%);
    transition: transform 40ms, width 200ms, height 200ms;
    will-change: left, top;
  }
  .dw-cursor-ring {
    position: fixed; pointer-events: none; z-index: 9998;
    width: 30px; height: 30px; border-radius: 50%;
    border: 1px solid rgba(240,236,230,0.35);
    transform: translate(-50%,-50%);
    transition: width 300ms var(--ease-lux), height 300ms var(--ease-lux), border-color 300ms;
    will-change: left, top;
  }
  .dw-cursor-ring.hov {
    width: 54px; height: 54px;
    border-color: var(--gold);
    background: var(--gold-dim);
  }

  /* ── NAV ─────────────────────────────────── */
  .dw-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 500;
    padding: 28px 52px;
    display: flex; align-items: center; justify-content: space-between;
    transition: padding 500ms var(--ease-lux), background 500ms, border-color 500ms;
    border-bottom: 1px solid transparent;
  }
  .dw-nav.stuck {
    padding: 16px 52px;
    background: rgba(6,6,6,0.88);
    backdrop-filter: blur(14px) saturate(1.2);
    border-bottom-color: var(--border);
  }
  .dw-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 400;
    letter-spacing: 0.32em; text-transform: uppercase;
    color: var(--cream); text-decoration: none;
    transition: letter-spacing 300ms;
  }
  .dw-logo:hover { letter-spacing: 0.42em; }
  .dw-nav-links {
    display: flex; gap: 40px; list-style: none;
  }
  .dw-nav-links a {
    font-size: 10.5px; font-weight: 300;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(240,236,230,0.5); text-decoration: none;
    transition: color 150ms;
  }
  .dw-nav-links a:hover { color: var(--cream); }
  .dw-nav-actions { display: flex; gap: 20px; align-items: center; }
  .dw-nav-btn {
    background: none; border: none; cursor: none;
    font-size: 10.5px; font-weight: 300;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(240,236,230,0.55);
    transition: color 150ms; padding: 4px;
  }
  .dw-nav-btn:hover { color: var(--cream); }
  .dw-cart-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 18px;
    border: 1px solid var(--border);
    background: none; cursor: none;
    font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(240,236,230,0.6);
    transition: border-color 200ms, color 200ms, background 200ms;
  }
  .dw-cart-btn:hover { border-color: var(--gold); color: var(--cream); background: var(--gold-dim); }

  /* ── KEYFRAMES ───────────────────────────── */
  @keyframes dw-rise { from { opacity:0; transform: translateY(36px); } to { opacity:1; transform: translateY(0); } }
  @keyframes dw-float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-7px); } }
  @keyframes dw-pulse { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
  @keyframes dw-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes dw-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes dw-breathe {
    0%,100% { opacity: 0.05; transform: scale(1); }
    50% { opacity: 0.1; transform: scale(1.04); }
  }
  @keyframes dw-line-in { from { transform: scaleX(0); } to { transform: scaleX(1); } }

  /* ── SCROLL REVEALS ──────────────────────── */
  .dw-reveal {
    opacity: 0; transform: translateY(28px);
    transition: opacity 900ms var(--ease-lux), transform 900ms var(--ease-lux);
  }
  .dw-reveal.in { opacity: 1; transform: translateY(0); }
  .dw-d1 { transition-delay: 80ms; }
  .dw-d2 { transition-delay: 180ms; }
  .dw-d3 { transition-delay: 280ms; }
  .dw-d4 { transition-delay: 380ms; }

  /* ── HERO ─────────────────────────────────── */
  .dw-hero {
    position: relative; height: 100vh;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  /* Depth layers */
  .dw-depth-wrap {
    position: absolute; inset: -8%;
    perspective: 900px; perspective-origin: center center;
    will-change: transform;
  }
  .dw-layer {
    position: absolute; inset: 0;
    will-change: transform;
    transition: transform 60ms linear;
  }
  .dw-layer-base {
    background:
      radial-gradient(ellipse 80% 60% at 28% 40%, rgba(200,169,106,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 72% 62%, rgba(200,169,106,0.03) 0%, transparent 55%),
      radial-gradient(circle at 50% 50%, #0c0a08 0%, var(--ink) 100%);
  }
  .dw-layer-grid {
    background-image:
      linear-gradient(rgba(240,236,230,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(240,236,230,0.025) 1px, transparent 1px);
    background-size: 72px 72px;
    transform: perspective(700px) rotateX(58deg) translateY(18%) scale(2.8);
    opacity: 0.7;
    pointer-events: none;
  }
  /* Floating geometric shapes at depth */
  .dw-geo {
    position: absolute;
    border: 1px solid rgba(200,169,106,0.1);
    pointer-events: none;
    will-change: transform;
    transition: transform 70ms linear;
  }
  .dw-geo-circle-lg {
    width: 340px; height: 340px; border-radius: 50%;
    top: 12%; left: 6%;
    animation: dw-breathe 8s ease-in-out infinite;
  }
  .dw-geo-circle-sm {
    width: 120px; height: 120px; border-radius: 50%;
    bottom: 22%; right: 10%;
    border-color: rgba(240,236,230,0.06);
    animation: dw-breathe 6s ease-in-out infinite 1.5s;
  }
  .dw-geo-line-v {
    width: 1px; height: 160px;
    background: linear-gradient(to bottom, transparent, rgba(200,169,106,0.4), transparent);
    top: 18%; right: 22%;
  }
  .dw-geo-line-h {
    height: 1px; width: 100px;
    background: linear-gradient(to right, transparent, rgba(200,169,106,0.3), transparent);
    bottom: 28%; left: 18%;
  }
  .dw-geo-square {
    width: 60px; height: 60px;
    top: 40%; left: 14%;
    border-color: rgba(240,236,230,0.04);
    transform: rotate(45deg);
    animation: dw-spin 30s linear infinite;
  }
  .dw-geo-dot-grid {
    position: absolute;
    top: 30%; right: 14%;
    width: 80px; height: 80px;
    background-image: radial-gradient(circle, rgba(200,169,106,0.25) 1px, transparent 1px);
    background-size: 14px 14px;
    pointer-events: none;
    will-change: transform;
    transition: transform 70ms linear;
  }
  /* Bloom */
  .dw-bloom {
    position: absolute; top: 50%; left: 50%;
    width: 700px; height: 700px;
    transform: translate(-50%,-50%);
    background: radial-gradient(circle, rgba(200,169,106,0.05) 0%, transparent 68%);
    pointer-events: none;
    will-change: transform;
    transition: transform 100ms linear;
  }

  .dw-hero-content {
    position: relative; z-index: 10;
    text-align: center; max-width: 960px;
    padding: 0 52px;
  }
  .dw-eyebrow {
    font-size: 10px; font-weight: 300;
    letter-spacing: 0.42em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 36px;
    animation: dw-rise 1s var(--ease-lux) 0.2s both;
  }
  .dw-hero-h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(76px, 11vw, 148px);
    font-weight: 300; line-height: 0.88;
    letter-spacing: -0.025em;
    margin-bottom: 44px;
  }
  .dw-hero-line { display: block; overflow: hidden; }
  .dw-hero-line span {
    display: block;
    animation: dw-rise 1.3s var(--ease-lux) both;
  }
  .dw-hero-line:nth-child(2) span { animation-delay: 0.14s; }
  .dw-hero-line:nth-child(3) span { animation-delay: 0.28s; }
  .dw-hero-sub {
    font-size: 12px; font-weight: 300;
    letter-spacing: 0.1em;
    color: rgba(240,236,230,0.4);
    margin-bottom: 52px;
    animation: dw-rise 1s var(--ease-lux) 0.6s both;
  }
  .dw-hero-cta {
    display: flex; gap: 14px; justify-content: center;
    animation: dw-rise 1s var(--ease-lux) 0.8s both;
  }

  .dw-scroll-hint {
    position: absolute; bottom: 36px; left: 50%;
    transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    animation: dw-rise 1s var(--ease-lux) 1.2s both;
  }
  .dw-scroll-line {
    width: 1px; height: 56px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    animation: dw-pulse 2.2s ease-in-out infinite;
  }
  .dw-scroll-label {
    font-size: 8.5px; letter-spacing: 0.38em;
    text-transform: uppercase; color: rgba(240,236,230,0.25);
    writing-mode: vertical-rl;
  }

  /* ── BUTTONS ─────────────────────────────── */
  .dw-btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 15px 36px; background: var(--cream);
    color: var(--ink); border: none; cursor: none;
    font-size: 10.5px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    transition: background 200ms, transform 250ms var(--ease-lux);
    position: relative; overflow: hidden;
  }
  .dw-btn-primary:hover { background: var(--gold); transform: translateY(-2px); }
  .dw-btn-ghost {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 35px;
    background: transparent; color: var(--cream);
    border: 1px solid rgba(240,236,230,0.22); cursor: none;
    font-size: 10.5px; font-weight: 300;
    letter-spacing: 0.18em; text-transform: uppercase;
    transition: border-color 200ms, background 200ms, transform 250ms var(--ease-lux);
  }
  .dw-btn-ghost:hover { border-color: var(--cream); background: var(--mist); transform: translateY(-2px); }
  .dw-text-link {
    background: none; border: none; border-bottom: 1px solid rgba(240,236,230,0.18);
    padding-bottom: 2px; cursor: none;
    font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(240,236,230,0.45);
    transition: color 150ms, border-color 150ms;
  }
  .dw-text-link:hover { color: var(--cream); border-bottom-color: var(--cream); }

  /* ── SECTION LABEL ───────────────────────── */
  .dw-label {
    font-size: 9px; letter-spacing: 0.44em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 20px;
    display: block;
  }
  .dw-rule {
    height: 1px; background: var(--border);
    transform-origin: left; animation: dw-line-in 1s var(--ease-lux) both;
  }

  /* ── DROP RUNWAY ─────────────────────────── */
  .dw-runway { padding: 130px 0; overflow: hidden; }
  .dw-runway-head {
    padding: 0 52px;
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 56px;
  }
  .dw-section-h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(38px, 5vw, 64px);
    font-weight: 300; line-height: 1;
    letter-spacing: -0.015em;
  }
  .dw-track {
    display: flex; gap: 20px;
    padding: 0 52px 20px;
    overflow-x: auto; scrollbar-width: none;
    cursor: grab; user-select: none;
  }
  .dw-track::-webkit-scrollbar { display: none; }
  .dw-track:active { cursor: grabbing; }

  /* ── PRODUCT CARD ────────────────────────── */
  .dw-card {
    flex: 0 0 300px;
    transform-style: preserve-3d;
    will-change: transform;
    transition: transform 400ms var(--ease-lux);
    animation: dw-float calc(5s + var(--fi) * 1.1s) ease-in-out infinite;
    animation-delay: calc(var(--fi) * 0.6s);
  }
  .dw-card-media {
    position: relative; aspect-ratio: 3/4;
    overflow: hidden; background: var(--smoke);
  }
  .dw-card-bg {
    width: 100%; height: 100%;
    transition: transform 600ms var(--ease-lux);
  }
  .dw-card:hover .dw-card-bg { transform: scale(1.05); }
  .dw-card-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(6,6,6,0.65) 0%, transparent 50%);
    opacity: 0; transition: opacity 250ms;
    display: flex; align-items: flex-end; padding: 20px;
  }
  .dw-card:hover .dw-card-overlay { opacity: 1; }
  .dw-quick-add {
    width: 100%; padding: 12px;
    background: var(--cream); color: var(--ink);
    border: none; cursor: none;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    transform: translateY(10px);
    transition: transform 300ms var(--ease-lux), background 200ms;
  }
  .dw-card:hover .dw-quick-add { transform: translateY(0); }
  .dw-quick-add:hover { background: var(--gold); }
  .dw-card-info { padding: 14px 0; }
  .dw-card-name {
    font-size: 12.5px; font-weight: 400;
    letter-spacing: 0.04em; margin-bottom: 5px;
    color: var(--cream);
  }
  .dw-card-price {
    font-size: 11px; color: rgba(240,236,230,0.45);
    letter-spacing: 0.04em;
  }
  .dw-stock-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 9.5px; letter-spacing: 0.08em;
    color: rgba(200,169,106,0.75); margin-top: 7px;
  }
  .dw-stock-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--gold);
    animation: dw-pulse 2s ease-in-out infinite;
  }

  /* ── PRODUCT VISUALS (no images) ─────────── */
  .dw-p-vis {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .dw-p-icon {
    font-size: 110px; opacity: 0.12;
    filter: blur(0.5px); user-select: none;
    transition: transform 600ms var(--ease-lux), opacity 600ms;
  }
  .dw-card:hover .dw-p-icon { transform: scale(1.06); opacity: 0.16; }
  .dw-p-shimmer {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, transparent 30%, rgba(200,169,106,0.06) 50%, transparent 70%);
    background-size: 200% 200%;
    animation: dw-shimmer 4s linear infinite;
  }

  /* Gradient backgrounds for products */
  .dw-g1 { background: linear-gradient(140deg, #141210 0%, #1e1a15 50%, #0f0d0b 100%); }
  .dw-g2 { background: linear-gradient(140deg, #0c0f0e 0%, #121a16 50%, #080d0a 100%); }
  .dw-g3 { background: linear-gradient(140deg, #0f0c16 0%, #181220 50%, #0a0810 100%); }
  .dw-g4 { background: linear-gradient(140deg, #140c0e 0%, #1e1114 50%, #0f080a 100%); }
  .dw-g5 { background: linear-gradient(140deg, #131100 0%, #1e1a00 50%, #0f0d00 100%); }

  /* ── EDITORIAL STATEMENT ─────────────────── */
  .dw-editorial {
    padding: 180px 52px;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    text-align: center;
  }
  .dw-statement {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(30px, 4.5vw, 68px);
    font-weight: 300; line-height: 1.22;
    letter-spacing: -0.01em;
    max-width: 860px; margin: 0 auto 36px;
  }
  .dw-statement em { font-style: italic; color: var(--gold); }
  .dw-origin {
    font-size: 10px; letter-spacing: 0.28em;
    text-transform: uppercase; color: rgba(240,236,230,0.2);
  }

  /* ── COLLECTION GRID ─────────────────────── */
  .dw-collections { padding: 130px 52px; }
  .dw-col-head {
    display: flex; align-items: flex-end;
    justify-content: space-between; margin-bottom: 56px;
  }
  .dw-tiles {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2px;
  }
  .dw-tile {
    position: relative; overflow: hidden;
    cursor: none; aspect-ratio: 2/3;
  }
  .dw-tile:first-child { grid-row: span 2; aspect-ratio: auto; min-height: 580px; }
  .dw-tile-bg {
    width: 100%; height: 100%;
    transition: transform 700ms var(--ease-lux);
  }
  .dw-tile:hover .dw-tile-bg { transform: scale(1.05); }
  .dw-tile-icon {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 80px; opacity: 0.08; user-select: none;
    transition: opacity 400ms, transform 700ms var(--ease-lux);
  }
  .dw-tile:first-child .dw-tile-icon { font-size: 140px; }
  .dw-tile:hover .dw-tile-icon { opacity: 0.13; transform: scale(1.04); }
  .dw-tile-info {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 40px 20px 20px;
    background: linear-gradient(to top, rgba(6,6,6,0.72) 0%, transparent 100%);
    transform: translateY(4px);
    transition: transform 300ms var(--ease-lux);
  }
  .dw-tile:hover .dw-tile-info { transform: translateY(0); }
  .dw-tile-cat {
    font-size: 8.5px; letter-spacing: 0.36em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 7px;
  }
  .dw-tile-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400; color: var(--cream);
  }
  .dw-tile-count {
    font-size: 10px; color: rgba(240,236,230,0.4);
    letter-spacing: 0.04em; margin-top: 5px;
  }

  /* ── LOOKBOOK ─────────────────────────────── */
  .dw-lookbook {
    display: grid; grid-template-columns: 1fr 1fr;
    min-height: 95vh;
    border-top: 1px solid var(--border);
  }
  .dw-look-img {
    position: relative; overflow: hidden;
  }
  .dw-look-img-inner {
    width: 100%; height: 100%; min-height: 700px;
    transition: transform 700ms var(--ease-lux);
    display: flex; align-items: center; justify-content: center;
  }
  .dw-lookbook:hover .dw-look-img-inner { transform: scale(1.03); }
  .dw-look-content {
    padding: 100px 80px;
    display: flex; flex-direction: column; justify-content: center;
    border-left: 1px solid var(--border);
  }
  .dw-look-num {
    font-size: 9px; letter-spacing: 0.4em;
    text-transform: uppercase;
    color: rgba(240,236,230,0.18); margin-bottom: 52px;
  }
  .dw-look-h {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 4vw, 62px);
    font-weight: 300; line-height: 1.1;
    letter-spacing: -0.01em; margin-bottom: 28px;
  }
  .dw-look-body {
    font-size: 12.5px; font-weight: 300;
    color: rgba(240,236,230,0.42); line-height: 1.9;
    letter-spacing: 0.03em; max-width: 360px; margin-bottom: 44px;
  }

  /* ── FEATURED ────────────────────────────── */
  .dw-featured { padding: 130px 52px; border-top: 1px solid var(--border); }
  .dw-feat-head {
    display: flex; align-items: flex-end;
    justify-content: space-between; margin-bottom: 56px;
  }
  .dw-feat-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 2px;
  }
  .dw-feat-card {
    position: relative; overflow: hidden; cursor: none;
    transform-style: preserve-3d;
    will-change: transform;
    transition: transform 400ms var(--ease-lux);
  }
  .dw-feat-media {
    aspect-ratio: 3/4; overflow: hidden; position: relative;
  }
  .dw-feat-media-inner {
    width: 100%; height: 100%;
    transition: transform 700ms var(--ease-lux);
    display: flex; align-items: center; justify-content: center;
  }
  .dw-feat-card:hover .dw-feat-media-inner { transform: scale(1.05); }
  .dw-feat-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(6,6,6,0.7) 0%, transparent 55%);
    opacity: 0; transition: opacity 250ms;
    display: flex; align-items: flex-end; padding: 20px;
  }
  .dw-feat-card:hover .dw-feat-overlay { opacity: 1; }

  /* ── MEMBERSHIP ──────────────────────────── */
  .dw-society {
    padding: 180px 52px;
    border-top: 1px solid var(--border);
    position: relative; overflow: hidden;
    text-align: center;
  }
  .dw-society-glow {
    position: absolute; top: 50%; left: 50%;
    width: 800px; height: 800px;
    transform: translate(-50%,-50%);
    background: radial-gradient(circle, rgba(200,169,106,0.05) 0%, transparent 68%);
    pointer-events: none;
    animation: dw-breathe 6s ease-in-out infinite;
  }
  .dw-society-inner { max-width: 820px; margin: 0 auto; position: relative; }
  .dw-society-h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(44px, 6vw, 80px);
    font-weight: 300; letter-spacing: -0.015em;
    margin-bottom: 20px; line-height: 1;
  }
  .dw-society-h2 em { font-style: italic; color: var(--gold); }
  .dw-society-p {
    font-size: 12.5px; color: rgba(240,236,230,0.42);
    line-height: 1.9; letter-spacing: 0.03em;
    max-width: 480px; margin: 0 auto 56px;
  }
  .dw-tiers {
    display: flex; gap: 0;
    border: 1px solid var(--border);
    margin-bottom: 48px;
  }
  .dw-tier {
    flex: 1; padding: 36px 28px; text-align: left;
    border-right: 1px solid var(--border);
    cursor: none; transition: background 250ms;
    position: relative; overflow: hidden;
  }
  .dw-tier:last-child { border-right: none; }
  .dw-tier:hover { background: var(--smoke); }
  .dw-tier-shine {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, transparent 40%, rgba(200,169,106,0.04) 50%, transparent 60%);
    opacity: 0; transition: opacity 300ms;
  }
  .dw-tier:hover .dw-tier-shine { opacity: 1; }
  .dw-tier-badge {
    font-size: 9px; letter-spacing: 0.38em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 14px; display: block;
  }
  .dw-tier-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 400;
    margin-bottom: 20px;
  }
  .dw-tier-perks { list-style: none; }
  .dw-tier-perk {
    font-size: 11px; font-weight: 300;
    color: rgba(240,236,230,0.45);
    padding: 7px 0; letter-spacing: 0.03em;
    border-top: 1px solid var(--border);
  }
  .dw-tier-perk::before { content: '— '; color: rgba(200,169,106,0.5); }

  /* ── EMAIL CAPTURE ───────────────────────── */
  .dw-capture {
    padding: 140px 52px;
    background: var(--smoke); text-align: center;
    border-top: 1px solid var(--border);
  }
  .dw-capture-h {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 300; letter-spacing: -0.01em;
    margin-bottom: 12px;
  }
  .dw-capture-sub {
    font-size: 11px; color: rgba(240,236,230,0.35);
    letter-spacing: 0.12em; text-transform: uppercase;
    margin-bottom: 44px;
  }
  .dw-capture-form {
    display: flex; max-width: 460px; margin: 0 auto;
  }
  .dw-capture-input {
    flex: 1; padding: 16px 22px;
    background: rgba(240,236,230,0.04);
    border: 1px solid var(--border); border-right: none;
    color: var(--cream); font-size: 12px;
    font-family: 'Inter', sans-serif; font-weight: 300;
    letter-spacing: 0.04em; outline: none;
    transition: border-color 200ms;
  }
  .dw-capture-input:focus { border-color: var(--gold); }
  .dw-capture-input::placeholder { color: rgba(240,236,230,0.2); }
  .dw-capture-submit {
    padding: 16px 28px;
    background: var(--gold); border: 1px solid var(--gold);
    color: var(--ink); cursor: none;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    transition: background 200ms, border-color 200ms;
    white-space: nowrap;
  }
  .dw-capture-submit:hover { background: var(--cream); border-color: var(--cream); }

  /* ── FOOTER ──────────────────────────────── */
  .dw-footer { padding: 90px 52px 44px; border-top: 1px solid var(--border); }
  .dw-footer-grid {
    display: grid; grid-template-columns: 1.8fr 1fr 1fr 1fr;
    gap: 56px; margin-bottom: 80px;
  }
  .dw-footer-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px; font-weight: 400;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--cream); display: block; margin-bottom: 18px;
  }
  .dw-footer-desc {
    font-size: 11.5px; color: rgba(240,236,230,0.3);
    line-height: 1.85; letter-spacing: 0.03em; max-width: 260px;
  }
  .dw-footer-h {
    font-size: 9.5px; letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(240,236,230,0.25); margin-bottom: 18px;
  }
  .dw-footer-ul { list-style: none; display: flex; flex-direction: column; gap: 11px; }
  .dw-footer-ul a {
    font-size: 11.5px; color: rgba(240,236,230,0.45);
    text-decoration: none; letter-spacing: 0.03em;
    transition: color 150ms;
  }
  .dw-footer-ul a:hover { color: var(--cream); }
  .dw-footer-bottom {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 32px; border-top: 1px solid var(--border);
  }
  .dw-footer-copy {
    font-size: 9.5px; letter-spacing: 0.1em;
    color: rgba(240,236,230,0.18);
  }

  /* ── CART ────────────────────────────────── */
  .dw-cart-veil {
    position: fixed; inset: 0; z-index: 600;
    background: rgba(0,0,0,0.55);
    opacity: 0; pointer-events: none;
    transition: opacity 350ms;
    backdrop-filter: blur(6px);
  }
  .dw-cart-veil.on { opacity: 1; pointer-events: all; }
  .dw-cart-panel {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: 400px; background: #0a0909;
    border-left: 1px solid var(--border);
    z-index: 601;
    transform: translateX(100%);
    transition: transform 500ms var(--ease-lux);
    display: flex; flex-direction: column;
  }
  .dw-cart-panel.on { transform: translateX(0); }
  .dw-cart-head {
    padding: 28px 30px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .dw-cart-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400;
  }
  .dw-cart-x {
    background: none; border: none; cursor: none;
    color: rgba(240,236,230,0.4); font-size: 22px;
    line-height: 1; transition: color 150ms; padding: 4px;
  }
  .dw-cart-x:hover { color: var(--cream); }
  .dw-cart-body {
    flex: 1; overflow-y: auto; padding: 30px;
    scrollbar-width: thin; scrollbar-color: var(--border) transparent;
  }
  .dw-cart-empty { text-align: center; padding: 80px 0; }
  .dw-cart-empty-h {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 300;
    color: rgba(240,236,230,0.25); margin-bottom: 8px;
  }
  .dw-cart-empty-p {
    font-size: 10.5px; color: rgba(240,236,230,0.18);
    letter-spacing: 0.1em;
  }
  .dw-cart-foot { padding: 20px 30px 28px; border-top: 1px solid var(--border); }
  .dw-ship-bar { margin-bottom: 20px; }
  .dw-ship-text {
    font-size: 10.5px; color: rgba(240,236,230,0.4);
    margin-bottom: 8px; letter-spacing: 0.04em;
  }
  .dw-ship-track {
    height: 1px; background: var(--border); position: relative;
  }
  .dw-ship-fill {
    position: absolute; left: 0; top: 0; bottom: 0;
    background: linear-gradient(to right, var(--gold), #e8d5b0);
    width: 0%; transition: width 800ms var(--ease-lux);
  }
  .dw-cart-total {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 16px;
  }
  .dw-cart-total-label {
    font-size: 10px; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(240,236,230,0.4);
  }
  .dw-cart-total-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 400;
  }
  .dw-checkout-cta {
    width: 100%; padding: 18px;
    background: var(--cream); color: var(--ink);
    border: none; cursor: none;
    font-size: 10.5px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    transition: background 200ms;
  }
  .dw-checkout-cta:hover { background: var(--gold); }

  /* ── SHIMMER TEXT ────────────────────────── */
  .dw-gold-text {
    background: linear-gradient(90deg, var(--gold) 0%, #E8D5A8 40%, var(--gold) 70%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: dw-shimmer 3.5s linear infinite;
  }

  /* ── REDUCED MOTION ──────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* ── RESPONSIVE ──────────────────────────── */
  @media (max-width: 900px) {
    .dw-nav { padding: 20px 24px; }
    .dw-nav.stuck { padding: 14px 24px; }
    .dw-nav-links { display: none; }
    .dw-tiles { grid-template-columns: repeat(2, 1fr); }
    .dw-tile:first-child { grid-row: span 1; min-height: 280px; }
    .dw-feat-grid { grid-template-columns: 1fr 1fr; }
    .dw-footer-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
    .dw-tiers { flex-direction: column; }
    .dw-lookbook { grid-template-columns: 1fr; }
    .dw-look-content { padding: 60px 40px; border-left: none; border-top: 1px solid var(--border); }
    .dw-collections, .dw-editorial, .dw-society, .dw-featured, .dw-capture { padding-left: 24px; padding-right: 24px; }
    .dw-runway-head, .dw-track { padding-left: 24px; padding-right: 24px; }
    .dw-cart-panel { width: 100%; }
  }
`;

const PRODUCTS = [
  { id: 1, name: "Void Jacket", price: "£395", g: "dw-g1", icon: "🧥", fi: 0 },
  { id: 2, name: "Shadow Trousers", price: "£195", g: "dw-g2", icon: "👖", fi: 1 },
  { id: 3, name: "Meridian Tee", price: "£85", g: "dw-g3", icon: "👕", fi: 2 },
  { id: 4, name: "Archive Shirt", price: "£165", g: "dw-g4", icon: "👔", fi: 3 },
  { id: 5, name: "Construct Hoodie", price: "£245", g: "dw-g5", icon: "🫶", fi: 4 },
  { id: 6, name: "Mineral Coat", price: "£520", g: "dw-g1", icon: "🧥", fi: 5 },
];

const COLLECTIONS = [
  { name: "Outerwear", cat: "SS25", count: "24 pieces", g: "dw-g1", icon: "🧥" },
  { name: "Essentials", cat: "Core", count: "18 pieces", g: "dw-g2", icon: "👕" },
  { name: "Denim", cat: "Signature", count: "12 pieces", g: "dw-g3", icon: "👖" },
  { name: "Knitwear", cat: "Premium", count: "16 pieces", g: "dw-g4", icon: "🧣" },
  { name: "Footwear", cat: "Limited", count: "8 pieces", g: "dw-g5", icon: "👟" },
];

function useMouseParallax() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e) => setMouse({
      x: (e.clientX / window.innerWidth - 0.5),
      y: (e.clientY / window.innerHeight - 0.5),
    });
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return mouse;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".dw-reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useTilt(ref) {
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateZ(12px)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);
  return { onMouseMove: onMove, onMouseLeave: onLeave };
}

function TiltCard({ children, className, style }) {
  const ref = useRef(null);
  const handlers = useTilt(ref);
  return (
    <div ref={ref} className={className} style={style} {...handlers}>
      {children}
    </div>
  );
}

export default function DaywearFlagship() {
  const [stuck, setStuck] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [hov, setHov] = useState(false);
  const [dotPos, setDotPos] = useState({ x: -200, y: -200 });
  const [ringPos, setRingPos] = useState({ x: -200, y: -200 });
  const [email, setEmail] = useState("");
  const mouse = useMouseParallax();
  useReveal();

  // Smooth cursor ring lerp
  const ringRef = useRef({ x: -200, y: -200 });
  const dotRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      ringRef.current.x += (dotRef.current.x - ringRef.current.x) * 0.1;
      ringRef.current.y += (dotRef.current.y - ringRef.current.y) * 0.1;
      setRingPos({ x: ringRef.current.x, y: ringRef.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const h = (e) => {
      dotRef.current = { x: e.clientX, y: e.clientY };
      setDotPos({ x: e.clientX, y: e.clientY });
      const t = e.target;
      setHov(
        ["BUTTON", "A", "INPUT"].includes(t.tagName) ||
        !!t.closest(".dw-card") ||
        !!t.closest(".dw-tile") ||
        !!t.closest(".dw-tier") ||
        !!t.closest(".dw-feat-card")
      );
    };
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);

  useEffect(() => {
    const h = () => setStuck(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Drag-scroll runway
  const trackRef = useRef(null);
  const drag = useRef({ on: false, startX: 0, sl: 0 });
  const onTD = (e) => { drag.current = { on: true, startX: e.pageX - trackRef.current.offsetLeft, sl: trackRef.current.scrollLeft }; };
  const onTM = (e) => {
    if (!drag.current.on) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = drag.current.sl - (x - drag.current.startX) * 1.4;
  };
  const onTU = () => { drag.current.on = false; };

  const p = (depth) => ({
    transform: `translate3d(${mouse.x * depth * -1}px, ${mouse.y * depth * -0.7}px, 0)`,
    transition: "transform 70ms linear",
  });

  return (
    <>
      <style>{STYLES}</style>

      {/* Cursor */}
      <div className="dw-cursor-dot" style={{ left: dotPos.x, top: dotPos.y }} />
      <div className={`dw-cursor-ring ${hov ? "hov" : ""}`} style={{ left: ringPos.x, top: ringPos.y }} />

      {/* Cart */}
      <div className={`dw-cart-veil ${cartOpen ? "on" : ""}`} onClick={() => setCartOpen(false)} />
      <div className={`dw-cart-panel ${cartOpen ? "on" : ""}`}>
        <div className="dw-cart-head">
          <span className="dw-cart-title">Your Edit</span>
          <button className="dw-cart-x" onClick={() => setCartOpen(false)}>×</button>
        </div>
        <div className="dw-cart-body">
          <div className="dw-cart-empty">
            <div className="dw-cart-empty-h">Your edit is empty</div>
            <div className="dw-cart-empty-p">Begin curating your look</div>
          </div>
        </div>
        <div className="dw-cart-foot">
          <div className="dw-ship-bar">
            <div className="dw-ship-text">Add £150 for complimentary delivery</div>
            <div className="dw-ship-track"><div className="dw-ship-fill" /></div>
          </div>
          <div className="dw-cart-total">
            <span className="dw-cart-total-label">Total</span>
            <span className="dw-cart-total-val">£0.00</span>
          </div>
          <button className="dw-checkout-cta">Proceed to Checkout</button>
        </div>
      </div>

      {/* Nav */}
      <nav className={`dw-nav ${stuck ? "stuck" : ""}`}>
        <a href="#" className="dw-logo">DAYWEAR</a>
        <ul className="dw-nav-links">
          {["New Drop", "Collections", "Archive", "Journal", "Society"].map((l) => (
            <li key={l}><a href="#">{l}</a></li>
          ))}
        </ul>
        <div className="dw-nav-actions">
          <button className="dw-nav-btn">Search</button>
          <button className="dw-nav-btn">Account</button>
          <button className="dw-cart-btn" onClick={() => setCartOpen(true)}>
            <span>Bag</span><span>(0)</span>
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────── */}
      <section className="dw-hero">
        {/* Depth scene */}
        <div className="dw-depth-wrap">
          <div className="dw-layer dw-layer-base" style={p(6)} />
          <div className="dw-layer dw-layer-grid" />

          {/* Geometric depth objects */}
          <div className="dw-geo dw-geo-circle-lg" style={p(18)} />
          <div className="dw-geo dw-geo-circle-sm" style={p(32)} />
          <div className="dw-geo dw-geo-square" style={p(24)} />
          <div className="dw-geo dw-geo-line-v" style={p(22)} />
          <div className="dw-geo dw-geo-line-h" style={p(28)} />
          <div className="dw-geo-dot-grid" style={p(36)} />

          {/* Floating label fragments at depth */}
          <div style={{ position: "absolute", top: "22%", left: "7%", ...p(14),
            fontFamily: "'Cormorant Garamond', serif", fontSize: "11px",
            letterSpacing: "0.3em", color: "rgba(200,169,106,0.18)",
            textTransform: "uppercase", pointerEvents: "none",
          }}>SS 25</div>
          <div style={{ position: "absolute", bottom: "24%", right: "8%", ...p(20),
            fontFamily: "'Cormorant Garamond', serif", fontSize: "11px",
            letterSpacing: "0.3em", color: "rgba(240,236,230,0.07)",
            textTransform: "uppercase", pointerEvents: "none",
          }}>London</div>

          {/* Central bloom */}
          <div className="dw-bloom" style={{
            ...p(8),
            transform: `translate(-50%,-50%) translate3d(${mouse.x * -8}px, ${mouse.y * -6}px, 0)`,
          }} />
        </div>

        <div className="dw-hero-content">
          <div className="dw-eyebrow">Spring Summer 2025 — Drop 001</div>
          <h1 className="dw-hero-h1">
            <span className="dw-hero-line"><span>Wear the</span></span>
            <span className="dw-hero-line">
              <span style={{ animationDelay: "0.14s" }}>
                <span className="dw-gold-text">Quiet</span>
              </span>
            </span>
            <span className="dw-hero-line"><span style={{ animationDelay: "0.28s" }}>Luxury.</span></span>
          </h1>
          <p className="dw-hero-sub">Considered garments for those who know.</p>
          <div className="dw-hero-cta">
            <button className="dw-btn-primary">Shop New Drop</button>
            <button className="dw-btn-ghost">Enter Collection</button>
          </div>
        </div>

        <div className="dw-scroll-hint">
          <div className="dw-scroll-line" />
          <span className="dw-scroll-label">Scroll</span>
        </div>
      </section>

      {/* ── DROP RUNWAY ─────────────────────── */}
      <section className="dw-runway">
        <div className="dw-runway-head dw-reveal">
          <div>
            <span className="dw-label">SS25 · Drop 001</span>
            <h2 className="dw-section-h2">New Arrivals</h2>
          </div>
          <button className="dw-text-link">View All Pieces</button>
        </div>
        <div
          className="dw-track"
          ref={trackRef}
          onMouseDown={onTD}
          onMouseMove={onTM}
          onMouseUp={onTU}
          onMouseLeave={onTU}
        >
          {PRODUCTS.map((p) => (
            <TiltCard key={p.id} className="dw-card" style={{ "--fi": p.fi }}>
              <div className="dw-card-media">
                <div className={`dw-card-bg ${p.g}`}>
                  <div className="dw-p-vis">
                    <div className="dw-p-icon">{p.icon}</div>
                    <div className="dw-p-shimmer" />
                  </div>
                </div>
                <div className="dw-card-overlay">
                  <button className="dw-quick-add">Quick Add</button>
                </div>
              </div>
              <div className="dw-card-info">
                <div className="dw-card-name">{p.name}</div>
                <div className="dw-card-price">{p.price}</div>
                <div className="dw-stock-badge"><div className="dw-stock-dot" /> Only 3 left</div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ── EDITORIAL ───────────────────────── */}
      <section className="dw-editorial">
        <div className="dw-reveal">
          <span className="dw-label" style={{ display: "block", textAlign: "center", marginBottom: "36px" }}>The Philosophy</span>
          <p className="dw-statement">
            Clothes that exist outside of <em>trend cycles.</em> Built from the ground up for those who dress with <em>intention,</em> not approval.
          </p>
          <div className="dw-origin">London — Since 2019</div>
        </div>
      </section>

      {/* ── COLLECTIONS ─────────────────────── */}
      <section className="dw-collections">
        <div className="dw-col-head dw-reveal">
          <div>
            <span className="dw-label">SS25</span>
            <h2 className="dw-section-h2">Shop by Category</h2>
          </div>
          <button className="dw-text-link">All Collections</button>
        </div>
        <div className="dw-tiles">
          {COLLECTIONS.map((c, i) => (
            <TiltCard key={i} className="dw-tile">
              <div className={`dw-tile-bg ${c.g}`} />
              <div className="dw-tile-icon">{c.icon}</div>
              <div className="dw-tile-info">
                <div className="dw-tile-cat">{c.cat}</div>
                <div className="dw-tile-name">{c.name}</div>
                <div className="dw-tile-count">{c.count}</div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ── LOOKBOOK ────────────────────────── */}
      <section className="dw-lookbook">
        <div className="dw-look-img">
          <div className={`dw-look-img-inner dw-g1`}>
            <span style={{ fontSize: 220, opacity: 0.07, filter: "blur(3px)", userSelect: "none" }}>🧥</span>
          </div>
        </div>
        <div className="dw-look-content dw-reveal">
          <div className="dw-look-num">Campaign 001 / SS25</div>
          <h2 className="dw-look-h">
            The Architecture<br />
            <em style={{ fontStyle: "italic", color: "var(--gold)" }}>of Restraint</em>
          </h2>
          <p className="dw-look-body">
            SS25 asks a simple question: what do you remove? The collection strips construction to its most essential moments — seams that serve purpose, fabric that speaks without pattern.
          </p>
          <button className="dw-btn-ghost" style={{ alignSelf: "flex-start" }}>View Lookbook</button>
        </div>
      </section>

      {/* ── FEATURED ────────────────────────── */}
      <section className="dw-featured">
        <div className="dw-feat-head dw-reveal">
          <div>
            <span className="dw-label">The Edit</span>
            <h2 className="dw-section-h2">Signature Pieces</h2>
          </div>
          <button className="dw-text-link">Shop All</button>
        </div>
        <div className="dw-feat-grid">
          {PRODUCTS.slice(0, 4).map((p, i) => (
            <TiltCard
              key={p.id}
              className={`dw-feat-card dw-reveal dw-d${i + 1}`}
            >
              <div className="dw-feat-media">
                <div className={`dw-feat-media-inner ${p.g}`}>
                  <div className="dw-p-vis">
                    <div className="dw-p-icon" style={{ fontSize: 90 }}>{p.icon}</div>
                    <div className="dw-p-shimmer" />
                  </div>
                </div>
                <div className="dw-feat-overlay">
                  <button className="dw-quick-add">Quick Add</button>
                </div>
              </div>
              <div className="dw-card-info">
                <div className="dw-card-name">{p.name}</div>
                <div className="dw-card-price">{p.price}</div>
                <div className="dw-stock-badge"><div className="dw-stock-dot" /> Low stock</div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ── SOCIETY ─────────────────────────── */}
      <section className="dw-society">
        <div className="dw-society-glow" />
        <div className="dw-society-inner">
          <div className="dw-reveal">
            <span className="dw-label" style={{ justifyContent: "center", display: "block", textAlign: "center" }}>Exclusive Access</span>
            <h2 className="dw-society-h2">
              DAYWEAR<br /><em>Society</em>
            </h2>
            <p className="dw-society-p">
              A private membership for those who take dressing seriously. Early access to drops, invitations to events, and rewards that compound over time.
            </p>
          </div>
          <div className="dw-tiers dw-reveal dw-d1">
            {[
              { badge: "Tier I", name: "Collective", perks: ["Early drop access (48h)", "Member pricing", "Exclusive colourways"] },
              { badge: "Tier II", name: "Archive", perks: ["Early access (72h)", "Complimentary delivery", "Archive access", "Private events"] },
              { badge: "Tier III", name: "Atelier", perks: ["First access always", "Personal stylist", "Custom fittings", "Founding edition pieces"] },
            ].map((t, i) => (
              <div key={i} className="dw-tier">
                <div className="dw-tier-shine" />
                <span className="dw-tier-badge">{t.badge}</span>
                <div className="dw-tier-name">{t.name}</div>
                <ul className="dw-tier-perks">
                  {t.perks.map((p) => <li key={p} className="dw-tier-perk">{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="dw-reveal dw-d2">
            <button className="dw-btn-primary">Apply for Membership</button>
          </div>
        </div>
      </section>

      {/* ── EMAIL CAPTURE ───────────────────── */}
      <section className="dw-capture">
        <div className="dw-reveal">
          <span className="dw-label" style={{ display: "block", textAlign: "center" }}>Next Drop</span>
          <h2 className="dw-capture-h">Be First.</h2>
          <p className="dw-capture-sub">Drop 002 lands in 14 days — limited allocation</p>
          <div className="dw-capture-form">
            <input
              className="dw-capture-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="dw-capture-submit">Get Access</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────── */}
      <footer className="dw-footer">
        <div className="dw-footer-grid">
          <div>
            <span className="dw-footer-logo">DAYWEAR</span>
            <p className="dw-footer-desc">A London-based luxury streetwear label. Considered design for those who dress with intention. Est. 2019.</p>
          </div>
          <div>
            <div className="dw-footer-h">Shop</div>
            <ul className="dw-footer-ul">
              {["New Arrivals", "Outerwear", "Essentials", "Denim", "Archive"].map((l) => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="dw-footer-h">Info</div>
            <ul className="dw-footer-ul">
              {["About", "Sustainability", "Sizing Guide", "Care", "Stockists"].map((l) => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="dw-footer-h">Connect</div>
            <ul className="dw-footer-ul">
              {["Instagram", "Society", "Journal", "Press", "Contact"].map((l) => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="dw-footer-bottom">
          <span className="dw-footer-copy">© 2025 DAYWEAR. All rights reserved.</span>
          <span className="dw-footer-copy">London, UK — Est. 2019</span>
        </div>
      </footer>
    </>
  );
}
