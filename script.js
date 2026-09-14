/**
 * script.js — ArtiWhiz'26 | ENHANCED PREMIUM EDITION
 * Features: GSAP ScrollTrigger, canvas particles, text scramble,
 * magnetic buttons, 3D tilt, flip countdown, count-up, ripple,
 * mouse parallax, footer canvas, circuit animation, scroll progress,
 * mobile menu stagger, custom cursor with trail.
 */

/* ═══════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════ */
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfFi8j0-6dt9lEoOHJ0X4zBSdIl6hD9LqXfQBrwCgBvUy_gJQ/viewform";
const UNSTOP_ONLINE_URL = "https://unstop.com/competitions/arvexis-egs-pillay-engineering-college-1750514?lb=Sklx8hkf&utm_medium=Share&utm_source=artiwegs7632&utm_campaign=Competitions";

const ONLINE_EVENTS = [
  {
    id: "arvexis", name: "ARVEXIS", icon: "🔍",
    tag: "Case Study Presentation", tagType: "online",
    description: "Showcase your analytical prowess by presenting a compelling case study on how AI can solve a real-world sustainability challenge. Present data-driven insights and innovative AI-powered solutions.",
    formUrl: UNSTOP_ONLINE_URL,
  },
  {
    id: "pre-symposium", name: "Pre-Symposium Event", icon: "🎓",
    tag: "Webinar", tagType: "online",
    description: "Kickstart ArtiWhiz'26 with an inspiring online webinar featuring industry experts sharing cutting-edge insights on AI for Sustainability — open to all registered participants.",
  },
];

const TECHNICAL_EVENTS = [
  {
    id: "arvena", name: "ARVENA", icon: "📄",
    tag: "Article Presentation", tagType: "technical",
    description: "Craft and present a well-researched technical article on AI-driven sustainability innovations. Demonstrate your writing, research depth, and communication skills.",
    formUrl: GOOGLE_FORM_URL,
  },
  {
    id: "arcova", name: "ARCOVA", icon: "💻",
    tag: "Hackathon", tagType: "technical",
    description: "Intensive hackathon to build an AI-powered solution that addresses a real sustainability problem. Code, innovate, and compete for glory, prizes, and recognition.",
    formUrl: GOOGLE_FORM_URL,
  },
];

const NON_TECHNICAL_EVENTS = [
  {
    id: "arise", name: "ARISE", icon: "🌟",
    tag: "Non-Technical", tagType: "nontechnical",
    description: "An exciting non-technical event blending creativity, teamwork, and sustainability awareness. Think outside the box, test lateral thinking, and solve problems beyond code.",
  },
];

/* ═══════════════════════════════════════════
   UTILS
═══════════════════════════════════════════ */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const isTouch = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;
const noMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pad = n => String(n).padStart(2, "0");
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

/* ═══════════════════════════════════════════
   TEXT SCRAMBLE
═══════════════════════════════════════════ */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";
    this.resolve = null;
    this.raf = null;
  }
  setText(newText) {
    const old = this.el.innerText;
    const len = Math.max(old.length, newText.length);
    return new Promise(res => {
      this.resolve = res;
      this.queue = [];
      for (let i = 0; i < len; i++) {
        const from = old[i] || "";
        const to   = newText[i] || "";
        const start = Math.floor(Math.random() * 12);
        const end   = start + Math.floor(Math.random() * 12);
        this.queue.push({ from, to, start, end, char: "" });
      }
      cancelAnimationFrame(this.raf);
      this.frame = 0;
      this.update();
    });
  }
  update() {
    let out = "", complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      const { from, to, start, end } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        out += to;
      } else if (this.frame >= start) {
        if (!this.queue[i].char || Math.random() < 0.28) {
          this.queue[i].char = this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        out += `<span class="scramble-char" style="color:rgba(34,197,94,.55)">${this.queue[i].char}</span>`;
      } else {
        out += from;
      }
    }
    this.el.innerHTML = out;
    if (complete === this.queue.length) {
      this.resolve && this.resolve();
    } else {
      this.frame++;
      this.raf = requestAnimationFrame(() => this.update());
    }
  }
}

/* ═══════════════════════════════════════════
   PAGE LOADER
═══════════════════════════════════════════ */
function initLoader() {
  const loader = $("#page-loader");
  if (!loader) return;

  // inject SVG gradient definition for loader leaf
  const svgDefs = `<svg width="0" height="0" style="position:absolute">
    <defs>
      <linearGradient id="leafGradLoader" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#22c55e"/>
        <stop offset="100%" stop-color="#0d5c2f"/>
      </linearGradient>
    </defs>
  </svg>`;
  document.body.insertAdjacentHTML("afterbegin", svgDefs);

  document.body.style.overflow = "hidden";

  if (noMotion()) {
    setTimeout(() => finishLoader(loader), 100);
    return;
  }

  setTimeout(() => finishLoader(loader), 1400);
}

function finishLoader(loader) {
  loader.classList.add("hidden");
  document.body.style.overflow = "";
  setTimeout(() => animateHeroEntrance(), 100);
}

/* ═══════════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════════ */
function initScrollProgress() {
  const bar = $("#scroll-progress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const pct = (scrollTop / (scrollHeight - clientHeight)) * 100;
    bar.style.width = clamp(pct, 0, 100) + "%";
  }, { passive: true });
}

/* ═══════════════════════════════════════════
   CUSTOM CURSOR (desktop)
═══════════════════════════════════════════ */
function initCursor() {
  if (isTouch()) return;
  const dot   = $("#cursor-dot");
  const ring  = $("#cursor-ring");
  const trail = $("#cursor-trail");
  if (!dot) return;

  let mx = -200, my = -200;
  let rx = -200, ry = -200;
  let tx = -200, ty = -200;

  document.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });

  (function updateCursor() {
    // dot follows exactly
    dot.style.left = mx + "px";
    dot.style.top  = my + "px";
    // ring lerps slower
    rx = lerp(rx, mx, 0.14);
    ry = lerp(ry, my, 0.14);
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
    // trail even slower
    tx = lerp(tx, mx, 0.07);
    ty = lerp(ty, my, 0.07);
    trail.style.left = tx + "px";
    trail.style.top  = ty + "px";
    requestAnimationFrame(updateCursor);
  })();

  // Hover states
  $$("a,button,.btn,.event-card,.coord-card,.soc-btn,.stat-card").forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });
}

/* ═══════════════════════════════════════════
   HERO CANVAS — particles
═══════════════════════════════════════════ */
function initHeroCanvas() {
  const canvas = $("#hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles = [], raf;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };

  class P {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 20;
      this.r = Math.random() * 2.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -(Math.random() * 0.5 + 0.1);
      this.alpha = Math.random() * 0.55 + 0.08;
      this.hue = 120 + Math.random() * 40;
      this.type = Math.floor(Math.random() * 4);
      this.rot = Math.random() * Math.PI * 2;
      this.rotV = (Math.random() - 0.5) * 0.008;
      this.life = Math.random();
    }
    update() {
      this.x  += this.vx;
      this.y  += this.vy;
      this.rot += this.rotV;
      this.life -= 0.001;
      if (this.y < -30 || this.life <= 0) this.reset();
      if (this.x < -20) this.x = W + 20;
      if (this.x > W + 20) this.x = -20;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha * this.life;

      if (this.type === 0) {
        // glowing dot
        const g = ctx.createRadialGradient(0,0,0,0,0,this.r*4);
        g.addColorStop(0, `hsla(${this.hue},70%,65%,1)`);
        g.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(0,0,this.r*4,0,Math.PI*2);
        ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(0,0,this.r,0,Math.PI*2);
        ctx.fillStyle = `hsla(${this.hue},70%,80%,1)`; ctx.fill();

      } else if (this.type === 1) {
        // leaf
        const s = this.r * 3;
        ctx.beginPath();
        ctx.moveTo(0, -s*1.4);
        ctx.bezierCurveTo(s,-s*.5, s,s, 0,s*1.4);
        ctx.bezierCurveTo(-s,s, -s,-s*.5, 0,-s*1.4);
        ctx.fillStyle = `hsla(${this.hue},65%,58%,1)`; ctx.fill();
        ctx.beginPath(); ctx.moveTo(0,-s*1.4); ctx.lineTo(0,s*1.4);
        ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth=.5; ctx.stroke();

      } else if (this.type === 2) {
        // hex / circuit node
        const s = this.r * 2.5;
        ctx.beginPath();
        for(let i=0;i<6;i++){const a=(Math.PI/3)*i;i===0?ctx.moveTo(s*Math.cos(a),s*Math.sin(a)):ctx.lineTo(s*Math.cos(a),s*Math.sin(a))}
        ctx.closePath();
        ctx.strokeStyle = `hsla(${this.hue},70%,65%,1)`; ctx.lineWidth=1; ctx.stroke();

      } else {
        // cross / plus
        const s = this.r * 2;
        ctx.strokeStyle = `hsla(${this.hue},65%,65%,1)`;
        ctx.lineWidth = .8; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(-s,0); ctx.lineTo(s,0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,-s); ctx.lineTo(0,s); ctx.stroke();
      }
      ctx.restore();
    }
  }

  const init = () => {
    const n = Math.min(Math.floor((W*H)/12000), 80);
    particles = Array.from({length:n}, () => new P());
  };

  const draw = () => {
    ctx.clearRect(0,0,W,H);
    // connect nearby particles
    for (let i=0;i<particles.length;i++) {
      for (let j=i+1;j<particles.length;j++) {
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){
          ctx.beginPath();
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(34,197,94,${.1*(1-d/110)})`;
          ctx.lineWidth=.6; ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    raf = requestAnimationFrame(draw);
  };

  new ResizeObserver(() => { resize(); init(); }).observe(canvas);
  resize(); init();
  if (!noMotion()) draw();
  else particles.forEach(p => p.draw());

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!noMotion()) raf = requestAnimationFrame(draw);
  });

  // Mouse repel effect
  if (!isTouch()) {
    document.addEventListener("mousemove", e => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      particles.forEach(p => {
        const dx=p.x-mx, dy=p.y-my, d=Math.sqrt(dx*dx+dy*dy);
        if(d<80){
          const f = (80-d)/80;
          p.vx += dx/d * f * 0.5;
          p.vy += dy/d * f * 0.5;
        }
      });
    });
  }
}

/* ═══════════════════════════════════════════
   FOOTER CANVAS — subtle aurora
═══════════════════════════════════════════ */
function initFooterCanvas() {
  const canvas = $("#footer-canvas");
  if (!canvas || noMotion()) return;
  const ctx = canvas.getContext("2d");
  let W, H, t = 0;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };

  const draw = () => {
    ctx.clearRect(0,0,W,H);
    t += 0.005;
    for (let i=0;i<5;i++) {
      const x = W * (0.1 + 0.2*i + 0.05*Math.sin(t+i));
      const y = H * (0.3 + 0.2*Math.sin(t*0.7+i*1.2));
      const r = W * 0.25;
      const g = ctx.createRadialGradient(x,y,0,x,y,r);
      g.addColorStop(0, `rgba(34,197,94,${0.04+0.02*Math.sin(t+i)})`);
      g.addColorStop(1, "transparent");
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle=g; ctx.fill();
    }
    requestAnimationFrame(draw);
  };

  new ResizeObserver(resize).observe(canvas);
  resize(); draw();
}

/* ═══════════════════════════════════════════
   HERO ENTRANCE (GSAP)
═══════════════════════════════════════════ */
function buildHeroLetters() {
  const el = $(".title-text");
  if (!el) return;
  const mainPart = "ArtiWhiz";
  const greenPart = "'26";
  
  const mainHTML = [...mainPart]
    .map(c => `<span class="letter letter-main" aria-hidden="true">${c}</span>`)
    .join("");
  const greenHTML = [...greenPart]
    .map(c => `<span class="letter letter-green" aria-hidden="true">${c}</span>`)
    .join("");
    
  el.innerHTML = `<span class="title-group-main">${mainHTML}</span><span class="title-group-green">${greenHTML}</span>`;
  
  initHeroInteractivity();
}

function initHeroInteractivity() {
  const heroTitle = $("#hero-main-title");
  if (!heroTitle) return;

  const letters = $$(".letter");
  letters.forEach((l, idx) => {
    l.style.setProperty("--letter-index", idx);
  });

  let rX = 0, rY = 0;
  let targetRX = 0, targetRY = 0;
  
  const updateTilt = () => {
    rX += (targetRX - rX) * 0.1;
    rY += (targetRY - rY) * 0.1;
    if (Math.abs(rX) > 0.01 || Math.abs(rY) > 0.01) {
      heroTitle.style.transform = `perspective(1000px) rotateX(${rX.toFixed(2)}deg) rotateY(${rY.toFixed(2)}deg)`;
    }
    requestAnimationFrame(updateTilt);
  };
  updateTilt();

  window.addEventListener("mousemove", (e) => {
    const rect = heroTitle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    
    if (dist < 600) {
      targetRX = ((e.clientY - centerY) / rect.height) * -12;
      targetRY = ((e.clientX - centerX) / rect.width) * 14;
    } else {
      targetRX = 0;
      targetRY = 0;
    }
  });

  // Mobile Touch & Drag Interaction
  const handleTouch = (e) => {
    if (!e.touches || !e.touches[0]) return;
    const touch = e.touches[0];
    const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (targetEl && targetEl.classList.contains("letter")) {
      targetEl.classList.add("letter-pop");
      setTimeout(() => targetEl.classList.remove("letter-pop"), 400);
      createParticleBurst(touch.clientX, touch.clientY);
    }
  };

  heroTitle.addEventListener("touchstart", handleTouch, { passive: true });
  heroTitle.addEventListener("touchmove", handleTouch, { passive: true });

  // Mobile Gyroscope Device Orientation Tilt
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (e) => {
      if (e.gamma !== null && e.beta !== null) {
        targetRY = Math.max(-14, Math.min(14, e.gamma / 2));
        targetRX = Math.max(-10, Math.min(10, (e.beta - 45) / 3));
      }
    }, { passive: true });
  }

  heroTitle.addEventListener("click", (e) => {
    createParticleBurst(e.clientX, e.clientY);
  });

  const presenterTitle = $(".symposium-header-banner .event-title");
  if (presenterTitle) {
    presenterTitle.addEventListener("click", (e) => {
      createParticleBurst(e.clientX, e.clientY);
    });
  }

  // Activate continuous letter wave floating after brief delay
  setTimeout(() => {
    heroTitle.classList.add("wave-active");
  }, 1200);
}

function createParticleBurst(x, y) {
  const colors = ["#22c55e", "#4ade80", "#ffffff", "#86efac", "#34d399"];
  const numParticles = 24;
  
  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement("div");
    particle.className = "title-spark-particle";
    
    const size = Math.random() * 8 + 4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = (Math.PI * 2 * i) / numParticles + (Math.random() * 0.4 - 0.2);
    const velocity = Math.random() * 90 + 40;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    
    Object.assign(particle.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "10001",
      boxShadow: `0 0 12px ${color}`,
      transform: "translate(-50%, -50%) scale(1)",
      transition: "transform 0.8s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.8s ease"
    });
    
    document.body.appendChild(particle);
    
    requestAnimationFrame(() => {
      particle.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`;
      particle.style.opacity = "0";
    });
    
    setTimeout(() => particle.remove(), 850);
  }
}

function animateHeroEntrance() {
  buildHeroLetters();

  if (noMotion()) {
    [".hero-eyebrow",".hero-subtitle-wrap",".hero-tagline",
     ".hero-dates",".countdown-wrap",".hero-cta"].forEach(s => {
      const el=$(s); if(el){el.style.opacity="1";el.style.transform="none";}
    });
    $$(".letter").forEach(l => { l.style.opacity="1"; l.style.transform="none"; });
    $$(".hero-badge").forEach(b => { b.style.opacity="1"; b.style.transform="none"; });
    const title = $("#hero-main-title");
    if (title) title.classList.add("wave-active");
    startTypewriter();
    return;
  }

  if (!window.gsap) {
    setTimeout(animateHeroEntrance, 100);
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.to(".hero-eyebrow", { opacity:1, duration:.6 })

    .to(".letter", {
      opacity:1, y:0, rotate:0, duration:.75,
      stagger:{ each:.04, ease:"power2.out" },
      onComplete: () => {
        const title = $("#hero-main-title");
        if (title) title.classList.add("wave-active");
      }
    }, "-=.2")

    .to(".hero-subtitle-wrap", { opacity:1, duration:.5 }, "-=.4")

    .call(() => startTypewriter())
    .to(".hero-tagline", { opacity:1, duration:.4 }, "-=.1")

    .to(".hero-dates", { opacity:1, y:0, duration:.5 }, "-=.2")
    .to(".countdown-wrap", { opacity:1, duration:.5 }, "-=.25")
    .to(".hero-cta", { opacity:1, duration:.5 }, "-=.2")

    .to(".hero-badge-ai", { opacity:1, x:0, duration:.6, ease:"back.out(2)" }, "-=.3")
    .to(".hero-badge-eco", { opacity:1, x:0, duration:.6, ease:"back.out(2)" }, "-=.5");
}

/* ═══════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════ */
function startTypewriter() {
  const el = $("#typewriter-target");
  if (!el) return;
  const text = "Innovate for a Sustainable Future";
  let i = 0;
  const spd = noMotion() ? 0 : 42;
  if (!spd) { el.textContent = text; return; }
  const type = () => {
    el.textContent = text.slice(0, i++);
    if (i <= text.length) setTimeout(type, spd);
  };
  type();
}

/* ═══════════════════════════════════════════
   FLIP COUNTDOWN
═══════════════════════════════════════════ */
function initCountdown() {
  const TARGET = new Date("2026-10-14T00:00:00+05:30");

  // Simple element refs — one span per unit
  const els = {
    days:  { box: $("#cd-days"),  num: $("#days-num") },
    hours: { box: $("#cd-hours"), num: $("#hrs-num")  },
    mins:  { box: $("#cd-mins"),  num: $("#min-num")  },
    secs:  { box: $("#cd-secs"),  num: $("#sec-num")  },
  };

  let prev = {};

  // Update a unit with slot-roll animation
  const setUnit = (u, val) => {
    if (!u.num) return;
    if (noMotion()) { u.num.textContent = val; return; }
    // Update the value BEFORE the animation midpoint (at 41% it resets from bottom)
    u.box.classList.remove("rolling");
    void u.box.offsetWidth;            // force reflow to restart animation
    u.num.textContent = val;           // set new value immediately
    u.box.classList.add("rolling");
    u.box.addEventListener("animationend", () => u.box.classList.remove("rolling"), { once: true });
  };

  const tick = () => {
    const diff = Math.max(0, TARGET - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);
    const now = { days:d, hours:h, mins:m, secs:s };
    Object.entries(now).forEach(([key, val]) => {
      if (val !== prev[key]) { setUnit(els[key], pad(val)); prev[key] = val; }
    });
  };

  // Initial silent render (no animation)
  const diff0 = Math.max(0, TARGET - Date.now());
  const d0=Math.floor(diff0/86400000), h0=Math.floor((diff0%86400000)/3600000),
        m0=Math.floor((diff0%3600000)/60000), s0=Math.floor((diff0%60000)/1000);
  [["days",d0],["hours",h0],["mins",m0],["secs",s0]].forEach(([k,v]) => {
    if (els[k].num) els[k].num.textContent = pad(v);
  });
  prev = { days:d0, hours:h0, mins:m0, secs:s0 };

  setInterval(tick, 1000);
}

/* ═══════════════════════════════════════════
   MOUSE PARALLAX ON HERO CONTENT
═══════════════════════════════════════════ */
function initHeroParallax() {
  if (isTouch() || noMotion()) return;
  const hero = $("#hero");
  if (!hero) return;
  const content = $(".hero-content");

  hero.addEventListener("mousemove", e => {
    const {left,top,width,height} = hero.getBoundingClientRect();
    const x = (e.clientX - left - width/2)  / width;
    const y = (e.clientY - top  - height/2) / height;
    if (content) {
      content.style.transform = `translate(${x*10}px,${y*6}px)`;
      content.style.transition = "transform .15s linear";
    }
    // Move orbs
    $$(".orb").forEach((orb,i) => {
      const d = (i+1)*12;
      orb.style.transform = `translate(${x*d}px,${y*d}px)`;
      orb.style.transition = "transform .3s ease";
    });
  });

  hero.addEventListener("mouseleave", () => {
    if (content) {
      content.style.transform = "";
      content.style.transition = "transform .6s ease";
    }
    $$(".orb").forEach(o => { o.style.transform=""; o.style.transition="transform .6s ease"; });
  });
}

/* ═══════════════════════════════════════════
   GSAP SCROLL ANIMATIONS
═══════════════════════════════════════════ */
function initScrollAnimations() {
  if (!window.gsap || !window.ScrollTrigger) {
    $$(".reveal-item").forEach(el => { el.style.opacity="1"; el.style.transform="none"; });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  if (noMotion()) {
    $$(".reveal-item").forEach(el => { el.style.opacity="1"; el.style.transform="none"; });
    return;
  }

  // Generic reveal items
  ScrollTrigger.batch(".reveal-item", {
    onEnter: els => gsap.to(els, {
      opacity:1, y:0, duration:.7, stagger:.1, ease:"power3.out",
    }),
    start: "top 88%", once: true,
  });

  // Event cards with extra scale
  ScrollTrigger.batch(".event-card", {
    onEnter: els => gsap.fromTo(els,
      { opacity:0, y:60, scale:.95 },
      { opacity:1, y:0, scale:1, duration:.7, stagger:.12, ease:"back.out(1.4)" }
    ),
    start: "top 88%", once: true,
  });

  // Coordinator cards wave
  ScrollTrigger.batch(".coord-card", {
    onEnter: els => gsap.fromTo(els,
      { opacity:0, y:40, rotateX:10 },
      { opacity:1, y:0, rotateX:0, duration:.55, stagger:.06, ease:"power2.out" }
    ),
    start: "top 90%", once: true,
  });

  // Podium cards dramatic entry
  gsap.fromTo(".podium-card",
    { opacity:0, y:80, scale:.8 },
    {
      opacity:1, y:0, scale:1, duration:.9, stagger:.15, ease:"back.out(2)",
      scrollTrigger: { trigger:".podium-wrap", start:"top 85%", once:true },
    }
  );

  // Parallax hero decorations
  gsap.to(".parallax-layer,.orb-1", {
    yPercent: -15, ease:"none",
    scrollTrigger: { trigger:".hero", start:"top top", end:"bottom top", scrub:2 },
  });

  // Section circuit paths animate on scroll
  $$(".section-circuit").forEach(sc => {
    ScrollTrigger.create({
      trigger: sc,
      start: "top 80%",
      once: true,
      onEnter: () => sc.classList.add("sc-animated"),
    });
  });

  // Text scramble on section titles on scroll
  if (!noMotion()) {
    $$(".scramble-title").forEach(el => {
      const plain = el.textContent.trim();
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          if (el.dataset.scrambled) return;
          el.dataset.scrambled = "1";
          // Only scramble the non-gradient parts to avoid breaking HTML
          const textNode = el.firstChild;
          if (textNode && textNode.nodeType === 3) {
            const scr = new TextScramble({ innerText: textNode.textContent, innerHTML: "" });
            scr.el = { innerHTML: "" };
            // Simple character scramble animation
            scrambleText(textNode);
          }
        },
      });
    });
  }
}

function scrambleText(textNode) {
  if (!textNode || textNode.nodeType !== 3) return;
  const original = textNode.textContent;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#";
  let frame = 0;
  const totalFrames = 18;
  const raf = () => {
    const t = frame / totalFrames;
    let out = "";
    for (let i=0;i<original.length;i++) {
      if (original[i] === " ") { out += " "; continue; }
      if (i < original.length * t) {
        out += original[i];
      } else if (frame > 2) {
        out += chars[Math.floor(Math.random()*chars.length)];
      } else {
        out += original[i];
      }
    }
    textNode.textContent = out;
    frame++;
    if (frame <= totalFrames) requestAnimationFrame(raf);
    else textNode.textContent = original;
  };
  requestAnimationFrame(raf);
}

/* ═══════════════════════════════════════════
   COUNT-UP PRIZE NUMBERS
═══════════════════════════════════════════ */
function initCountUp() {
  const els = $$(".prize-count");
  if (!els.length) return;
  const countUp = el => {
    const target = parseInt(el.dataset.target, 10);
    if (!target) return;
    if (noMotion()) { el.textContent = target.toLocaleString("en-IN"); return; }
    const dur = 1800, start = performance.now();
    const tick = now => {
      const p = Math.min((now-start)/dur, 1);
      const eased = p < .5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2; // ease in-out cubic
      el.textContent = Math.floor(eased * target).toLocaleString("en-IN");
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(
    (entries, obs) => entries.forEach(e => {
      if (e.isIntersecting) { countUp(e.target); obs.unobserve(e.target); }
    }),
    { threshold: .5 }
  );
  els.forEach(el => io.observe(el));
}

/* ═══════════════════════════════════════════
   3D CARD TILT
═══════════════════════════════════════════ */
function initCardTilt() {
  if (isTouch() || noMotion()) return;
  $$(".event-card").forEach(card => {
    let rect;
    card.addEventListener("mouseenter", () => rect = card.getBoundingClientRect());
    card.addEventListener("mousemove", e => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const cx = rect.width/2, cy = rect.height/2;
      const rx = ((y-cy)/cy)*-8, ry = ((x-cx)/cx)*8;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
      card.style.transition = "transform .08s linear";
      // Update radial glow position
      const px = (x/rect.width)*100, py = (y/rect.height)*100;
      card.style.setProperty("--mx", px+"%");
      card.style.setProperty("--my", py+"%");
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale(1)";
      card.style.transition = "transform .45s cubic-bezier(.34,1.56,.64,1)";
    });
  });
}

/* ═══════════════════════════════════════════
   MAGNETIC BUTTONS
═══════════════════════════════════════════ */
function initMagnetic() {
  if (isTouch() || noMotion()) return;
  $$(".btn-magnetic").forEach(btn => {
    let rect;
    btn.addEventListener("mouseenter", () => rect = btn.getBoundingClientRect());
    btn.addEventListener("mousemove", e => {
      if (!rect) rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width/2);
      const y = e.clientY - (rect.top  + rect.height/2);
      btn.style.transform = `translate(${x*.28}px,${y*.28}px) scale(1.06)`;
      btn.style.transition = "transform .12s ease";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0,0) scale(1)";
      btn.style.transition = "transform .5s cubic-bezier(.34,1.56,.64,1)";
    });
  });
}

/* ═══════════════════════════════════════════
   RIPPLE EFFECT ON BUTTONS
═══════════════════════════════════════════ */
function initRipple() {
  $$(".btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const r = document.createElement("span");
      r.className = "ripple";
      const rect = btn.getBoundingClientRect();
      const sz = Math.max(rect.width, rect.height);
      r.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX-rect.left-sz/2}px;top:${e.clientY-rect.top-sz/2}px`;
      btn.appendChild(r);
      r.addEventListener("animationend", () => r.remove());
    });
  });
}

/* ═══════════════════════════════════════════
   RENDER EVENT CARDS
═══════════════════════════════════════════ */
function renderEvents() {
  const tagClass = { online:"tag-online", technical:"tag-technical", nontechnical:"tag-nontechnical" };

  const makeCard = (ev, dark) => {
    const art = document.createElement("article");
    art.className = `event-card ${dark ? "event-card-offline" : "event-card-online"}`;
    art.setAttribute("role","listitem");
    art.setAttribute("aria-label", `${ev.name} — ${ev.tag}`);
    const regBtnHtml = ev.formUrl ? `
      <a href="${ev.formUrl}" target="_blank" rel="noopener noreferrer"
         class="btn btn-event btn-sm btn-magnetic"
         id="reg-${ev.id}" aria-label="Register for ${ev.name}">
        <span class="btn-inner">
          <svg viewBox="0 0 24 24" fill="none" width="15" height="15" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Register Now
        </span>
      </a>` : '';

    art.innerHTML = `
      <div class="event-icon-wrap"><span aria-hidden="true">${ev.icon}</span></div>
      <div>
        <span class="event-tag ${tagClass[ev.tagType]||"tag-online"}">${ev.tag}</span>
        <h3>${ev.name}</h3>
      </div>
      <p class="event-desc">${ev.description}</p>
      ${regBtnHtml}`;
    return art;
  };

  const og = $("#online-events-grid");
  ONLINE_EVENTS.forEach(e => og?.appendChild(makeCard(e, false)));

  const tg = $("#technical-events-grid");
  TECHNICAL_EVENTS.forEach(e => tg?.appendChild(makeCard(e, true)));

  const ng = $("#nontechnical-events-grid");
  NON_TECHNICAL_EVENTS.forEach(e => ng?.appendChild(makeCard(e, true)));
}

/* ═══════════════════════════════════════════
   REGISTER BUTTONS
═══════════════════════════════════════════ */
function initRegisterBtns() {
  const modal = $("#reg-modal");
  const overlay = $("#reg-modal-overlay");
  const closeBtn = $("#reg-modal-close");

  const openModal = (e) => {
    if (e) e.preventDefault();
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => modal.classList.add("is-open"));
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { modal.hidden = true; }, 300);
  };

  ["#nav-register-btn","#hero-register-btn","#mobile-register-btn",".footer-reg-link"].forEach(sel => {
    $$(sel).forEach(el => {
      el.addEventListener("click", openModal);
    });
  });

  overlay?.addEventListener("click", closeModal);
  closeBtn?.addEventListener("click", closeModal);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && modal && !modal.hidden) closeModal(); });

  $$(".modal-opt-card").forEach(card => {
    card.addEventListener("click", closeModal);
  });
}

/* ═══════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════ */
function initNavbar() {
  const nav = $("#navbar");
  const hero = $("#hero");
  const sections = $$("section[id],footer[id]");
  const links = $$(".nav-link");

  window.addEventListener("scroll", () => {
    const sy = window.scrollY;
    nav.classList.toggle("scrolled", sy > 40);
    if (hero) nav.classList.toggle("light", hero.getBoundingClientRect().bottom < 0);

    let cur = "";
    sections.forEach(s => { if(s.getBoundingClientRect().top <= 100) cur = s.id; });
    links.forEach(l => l.classList.toggle("active", l.dataset.section === cur));
  }, { passive:true });

  $$("a[href^='#']").forEach(a => {
    a.addEventListener("click", e => {
      const t = $(a.getAttribute("href"));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior:"smooth" });
      closeMobileMenu();
    });
  });
}

/* ═══════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════ */
function initMobileMenu() {
  const ham = $("#hamburger");
  const menu = $("#mobile-menu");
  const closeBtn = $("#mobile-close");
  const overlay = $("#mobile-overlay");
  const links = $$(".mm-link");
  if (!ham || !menu) return;

  const open = () => {
    menu.hidden = false;
    ham.classList.add("open");
    ham.setAttribute("aria-expanded","true");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => menu.classList.add("is-open"));
    if (window.gsap && !noMotion()) {
      gsap.fromTo(links, { opacity:0, x:28 }, { opacity:1, x:0, duration:.35, stagger:.07, ease:"power2.out", delay:.2 });
    } else {
      links.forEach(l => { l.style.opacity="1"; l.style.transform="none"; });
    }
  };

  window.closeMobileMenu = () => {
    menu.classList.remove("is-open");
    ham.classList.remove("open");
    ham.setAttribute("aria-expanded","false");
    document.body.style.overflow = "";
    setTimeout(() => {
      menu.hidden = true;
      links.forEach(l => { l.style.opacity=""; l.style.transform=""; });
    }, 460);
  };

  ham.addEventListener("click", () => {
    menu.classList.contains("is-open") ? closeMobileMenu() : open();
  });
  closeBtn?.addEventListener("click", closeMobileMenu);
  overlay?.addEventListener("click", closeMobileMenu);
  links.forEach(l => l.addEventListener("click", closeMobileMenu));
  document.addEventListener("keydown", e => { if(e.key==="Escape") closeMobileMenu(); });
}

/* ═══════════════════════════════════════════
   STARS BACKGROUND (offline section)
═══════════════════════════════════════════ */
function initStars() {
  const bg = $("#stars-bg");
  if (!bg) return;
  for (let i=0;i<80;i++) {
    const s = document.createElement("div");
    const sz = Math.random()*2.5+.5;
    s.style.cssText = `
      position:absolute;border-radius:50%;
      width:${sz}px;height:${sz}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      background:rgba(255,255,255,${Math.random()*.5+.1});
      animation:starTwinkle ${Math.random()*3+2}s ease-in-out infinite alternate;
      animation-delay:${Math.random()*3}s;
    `;
    bg.appendChild(s);
  }
  if (!document.getElementById("star-kf")) {
    const st = document.createElement("style");
    st.id = "star-kf";
    st.textContent = `@keyframes starTwinkle{from{opacity:.1;transform:scale(.8)}to{opacity:.9;transform:scale(1)}}`;
    document.head.appendChild(st);
  }
}

/* ═══════════════════════════════════════════
   SOCIAL ICON BRAND COLORS
═══════════════════════════════════════════ */
function initSocials() {
  const map = {
    "soc-instagram":"#e1306c","soc-whatsapp":"#25d366",
    "soc-facebook":"#1877f2","soc-x":"#1da1f2",
    "soc-linkedin":"#0a66c2","soc-youtube":"#ff0000",
  };
  Object.entries(map).forEach(([id,clr]) => {
    const el = $(`#${id}`);
    if (!el) return;
    el.addEventListener("mouseenter", () => {
      el.style.background = clr; el.style.borderColor = clr; el.style.color = "#fff";
    });
    el.addEventListener("mouseleave", () => {
      el.style.background = ""; el.style.borderColor = ""; el.style.color = "";
    });
  });
}

/* ═══════════════════════════════════════════
   HERO BADGE MOUSE PARALLAX
═══════════════════════════════════════════ */
function initBadgeParallax() {
  if (isTouch() || noMotion()) return;
  const b1 = $(".hero-badge-ai"), b2 = $(".hero-badge-eco");
  if(!b1||!b2) return;
  window.addEventListener("mousemove", e => {
    const x = (e.clientX/window.innerWidth - .5)*20;
    const y = (e.clientY/window.innerHeight - .5)*10;
    b1.style.transform = `translateX(${x*.6}px) translateY(${y*.4}px)`;
    b2.style.transform = `translateX(${-x*.6}px) translateY(${-y*.4}px)`;
  }, { passive:true });
}

/* ═══════════════════════════════════════════
   BOOTSTRAP
═══════════════════════════════════════════ */
function bootstrap() {
  initLoader();
  renderEvents();
  initRegisterBtns();
  initNavbar();
  initMobileMenu();
  initHeroCanvas();
  initFooterCanvas();
  initCountdown();
  initScrollProgress();
  initCountUp();
  initCardTilt();
  initMagnetic();
  initRipple();
  initStars();
  initSocials();
  initHeroParallax();
  initBadgeParallax();
  initCursor();
  // Scroll animations need GSAP — wait until deferred scripts are ready
  if (window.gsap && window.ScrollTrigger) {
    initScrollAnimations();
  } else {
    window.addEventListener("load", () => {
      setTimeout(initScrollAnimations, 100);
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(bootstrap));
} else {
  requestAnimationFrame(bootstrap);
}
