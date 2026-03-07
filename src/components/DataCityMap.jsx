import { useState, useEffect, useRef, useCallback } from "react";
import mapVideo from "../assets/videos/map2.mp4";

// ─── Districts ────────────────────────────────────────────────────────────────
const DISTRICTS = [
  { id:"arrays",   name:"Array District", icon:"⬛", description:"The foundation of the kingdom — ordered blocks of data laid side by side in continuous memory. The backbone of every army.", difficulty:"Beginner",     x:50, y:13, color:"#f0c040" },
  { id:"stacks",   name:"Stack Towers",   icon:"🗼", description:"Towering war spires at the eastern flank. Data stacks one upon another — last in, first out. The law of the Towers.", difficulty:"Beginner",     x:77, y:29, color:"#e8a820" },
  { id:"queues",   name:"Queue Factory",  icon:"🏭", description:"The great armory-forge. Workers queue in strict order — first in, first to the front lines. The line is sacred.", difficulty:"Beginner",     x:23, y:29, color:"#d4901a" },
  { id:"trees",    name:"Tree Gardens",   icon:"🌳", description:"Ancient command groves where knowledge branches in hierarchies. Roots deep, leaves reaching skyward.", difficulty:"Intermediate",  x:35, y:52, color:"#60d080" },
  { id:"graphs",   name:"Graph Nexus",    icon:"🕸", description:"The war council at the city's heart. Every path, alliance, and betrayal mapped here. Master this, master the kingdom.", difficulty:"Advanced",     x:65, y:52, color:"#c060f0" },
  { id:"hashmaps", name:"Hash Bazaar",    icon:"🗺", description:"The intelligence district where spies transmute keys into instant secrets. Nothing is ever truly lost here. O(1) or death.", difficulty:"Intermediate",  x:17, y:69, color:"#f06060" },
  { id:"heaps",    name:"Heap Citadel",   icon:"🏰", description:"An iron citadel that always surfaces the mightiest. Priority enforced by ancient law — the strongest always rises.", difficulty:"Intermediate",  x:83, y:69, color:"#40c0e0" },
  { id:"sorting",  name:"Sort Sanctum",   icon:"⚖",  description:"The great temple of order at the southern ridge. Scholars argue endlessly — bubble, merge, quick — order is their religion.", difficulty:"Intermediate",  x:50, y:82, color:"#f09030" },
];

const CONNECTIONS = [
  ["arrays","stacks"],["arrays","queues"],["arrays","trees"],["arrays","sorting"],
  ["stacks","graphs"],["stacks","heaps"],
  ["queues","hashmaps"],["queues","trees"],
  ["trees","heaps"],
  ["graphs","sorting"],["graphs","heaps"],
  ["hashmaps","sorting"],
];

const DIFFICULTY_COLORS = {
  Beginner:     "#60d080",
  Intermediate: "#f0c040",
  Advanced:     "#f06080",
};

// ─── Parchment Canvas ─────────────────────────────────────────────────────────
function ParchmentCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const draw = () => {
      const W = canvas.width  = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;

      // Base aged parchment
      const base = ctx.createRadialGradient(W*.48,H*.4,0, W*.5,H*.5, W*.8);
      base.addColorStop(0,   "#c9a45a");
      base.addColorStop(0.3, "#b08840");
      base.addColorStop(0.6, "#8a6428");
      base.addColorStop(1,   "#4a2e10");
      ctx.fillStyle = base; ctx.fillRect(0,0,W,H);

      // Grain noise
      for(let i=0;i<16000;i++){
        const px=Math.random()*W, py=Math.random()*H, v=Math.random();
        ctx.fillStyle = v<0.5?`rgba(40,20,5,0.05)`:`rgba(230,190,110,0.04)`;
        ctx.fillRect(px,py,1,1);
      }

      // Crumple fold shadows
      const folds=[
        {x1:.1,y1:0, x2:.44,y2:.54, w:20,a:.2},
        {x1:.44,y1:0,x2:.14,y2:.68, w:15,a:.16},
        {x1:.6, y1:0, x2:.84,y2:.5,  w:17,a:.18},
        {x1:1,  y1:.1,x2:.54,y2:.58, w:22,a:.22},
        {x1:0,  y1:.4,x2:.5, y2:.64, w:13,a:.14},
        {x1:.3, y1:.5,x2:.7, y2:.54, w:11,a:.13},
        {x1:.5, y1:.5,x2:.9, y2:.8,  w:16,a:.16},
        {x1:.1, y1:.7,x2:.5, y2:1,   w:14,a:.15},
        {x1:0,  y1:.33,x2:1,y2:.335, w:24,a:.17},
        {x1:0,  y1:.66,x2:1,y2:.662, w:20,a:.14},
        {x1:.33,y1:0, x2:.332,y2:1,  w:22,a:.15},
        {x1:.66,y1:0, x2:.662,y2:1,  w:19,a:.13},
      ];
      folds.forEach(f=>{
        const x1=f.x1*W,y1=f.y1*H,x2=f.x2*W,y2=f.y2*H;
        const g=ctx.createLinearGradient(x1,y1,x2,y2);
        g.addColorStop(0,`rgba(15,8,0,0)`);
        g.addColorStop(0.46,`rgba(15,8,0,${f.a})`);
        g.addColorStop(0.5,`rgba(50,25,5,${f.a*1.7})`);
        g.addColorStop(0.54,`rgba(210,170,90,${f.a*.5})`);
        g.addColorStop(1,`rgba(15,8,0,0)`);
        ctx.strokeStyle=g; ctx.lineWidth=f.w;
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      });

      // Burn stains at intersections
      const stains=[
        {x:.33,y:.33,r:.065,a:.55},{x:.66,y:.33,r:.055,a:.48},
        {x:.33,y:.66,r:.07, a:.6 },{x:.66,y:.66,r:.065,a:.52},
        {x:.5, y:.5, r:.04, a:.3 },{x:.15,y:.5, r:.055,a:.4 },
        {x:.83,y:.48,r:.045,a:.38},{x:.5, y:.82,r:.055,a:.45},
        {x:.05,y:.05,r:.1,  a:.72},{x:.95,y:.05,r:.09, a:.68},
        {x:.05,y:.95,r:.1,  a:.72},{x:.95,y:.92,r:.11, a:.72},
      ];
      stains.forEach(s=>{
        const g=ctx.createRadialGradient(s.x*W,s.y*H,0,s.x*W,s.y*H,s.r*W);
        g.addColorStop(0,`rgba(12,5,0,${s.a})`);
        g.addColorStop(.5,`rgba(25,12,3,${s.a*.5})`);
        g.addColorStop(1,`rgba(25,12,3,0)`);
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      });

      // Ink military grid
      ctx.strokeStyle="rgba(25,12,4,0.22)"; ctx.lineWidth=0.7;
      for(let i=1;i<12;i++){
        ctx.beginPath(); ctx.moveTo(i*W/11,0); ctx.lineTo(i*W/11,H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,i*H/11); ctx.lineTo(W,i*H/11); ctx.stroke();
      }

      // Torn top-left corner
      ctx.fillStyle="rgba(8,4,0,0.88)";
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(W*.1,0); ctx.lineTo(W*.04,H*.08); ctx.lineTo(W*.13,H*.03); ctx.lineTo(0,H*.16); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(W,0); ctx.lineTo(W*.87,0); ctx.lineTo(W*.93,H*.06); ctx.lineTo(W*.85,H*.02); ctx.lineTo(W,H*.14); ctx.closePath(); ctx.fill();

      // Highlight — light hitting crumpled paper
      const hl=ctx.createRadialGradient(W*.36,H*.38,0,W*.36,H*.38,W*.3);
      hl.addColorStop(0,"rgba(255,235,170,0.22)"); hl.addColorStop(1,"rgba(255,235,170,0)");
      ctx.fillStyle=hl; ctx.fillRect(0,0,W,H);
      const hl2=ctx.createRadialGradient(W*.72,H*.24,0,W*.72,H*.24,W*.2);
      hl2.addColorStop(0,"rgba(245,210,130,0.16)"); hl2.addColorStop(1,"rgba(245,210,130,0)");
      ctx.fillStyle=hl2; ctx.fillRect(0,0,W,H);

      // Heavy vignette edges
      const vig=ctx.createRadialGradient(W/2,H/2,W*.18,W/2,H/2,W*.82);
      vig.addColorStop(0,"rgba(0,0,0,0)");
      vig.addColorStop(.55,"rgba(5,3,0,0.12)");
      vig.addColorStop(.82,"rgba(3,2,0,0.52)");
      vig.addColorStop(1,"rgba(0,0,0,0.9)");
      ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);

      // Dark blue-black tint — pushes into war night while keeping texture
      ctx.fillStyle="rgba(4,8,22,0.58)"; ctx.fillRect(0,0,W,H);
    };
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>;
}

// ─── Gold Particle Canvas ─────────────────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef(null);
  const raf = useRef(null);
  useEffect(()=>{
    const canvas=ref.current, ctx=canvas.getContext("2d");
    const resize=()=>{ canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight; };
    resize(); window.addEventListener("resize",resize);
    const particles=Array.from({length:90},()=>({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      r:Math.random()*1.6+0.3,
      vx:(Math.random()-.5)*.28, vy:(Math.random()-.5)*.18,
      alpha:Math.random()*.45+0.08,
    }));
    const draw=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0) p.x=canvas.width; if(p.x>canvas.width) p.x=0;
        if(p.y<0) p.y=canvas.height; if(p.y>canvas.height) p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(240,192,64,${p.alpha})`; ctx.fill();
      });
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ cancelAnimationFrame(raf.current); window.removeEventListener("resize",resize); };
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:1}}/>;
}

// ─── Rain Mist Canvas ─────────────────────────────────────────────────────────
function RainCanvas() {
  const ref = useRef(null);
  const raf = useRef(null);
  useEffect(()=>{
    const c=ref.current, ctx=c.getContext("2d");
    let W,H;
    const resize=()=>{ W=c.width=c.offsetWidth; H=c.height=c.offsetHeight; };
    resize(); window.addEventListener("resize",resize);
    const drops=Array.from({length:55},()=>({
      x:Math.random(), y:Math.random(), len:.022+Math.random()*.03,
      speed:.0022+Math.random()*.0035, alpha:.04+Math.random()*.08,
    }));
    const mist=Array.from({length:7},()=>({
      x:Math.random(), y:.4+Math.random()*.6, r:.2+Math.random()*.3,
      vx:(Math.random()>.5?1:-1)*.00005, alpha:.025+Math.random()*.04,
    }));
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      mist.forEach(m=>{
        m.x+=m.vx; if(m.x>1.3) m.x=-0.3; if(m.x<-0.3) m.x=1.3;
        const g=ctx.createRadialGradient(m.x*W,m.y*H,0,m.x*W,m.y*H,m.r*W);
        g.addColorStop(0,`rgba(8,18,45,${m.alpha})`); g.addColorStop(1,"rgba(8,18,45,0)");
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      });
      drops.forEach(d=>{
        d.y+=d.speed; d.x+=d.speed*.1;
        if(d.y>1.05){d.y=-0.05;d.x=Math.random();}
        ctx.strokeStyle=`rgba(180,200,240,${d.alpha})`; ctx.lineWidth=0.6;
        ctx.beginPath(); ctx.moveTo(d.x*W,d.y*H); ctx.lineTo((d.x+.003)*W,(d.y+d.len)*H); ctx.stroke();
      });
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ cancelAnimationFrame(raf.current); window.removeEventListener("resize",resize); };
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:2}}/>;
}

// ─── Connection Lines ─────────────────────────────────────────────────────────
function ConnectionLines({ activeId }) {
  const gd = id => DISTRICTS.find(d=>d.id===id);
  return (
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:3}}
      viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <filter id="glow-line">
          <feGaussianBlur stdDeviation="0.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {CONNECTIONS.map(([aId,bId])=>{
        const a=gd(aId),b=gd(bId); if(!a||!b) return null;
        const isActive=activeId===aId||activeId===bId;
        const activeColor=activeId===aId?a.color:b.color;
        return <line key={`${aId}-${bId}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
          stroke={isActive?activeColor:"rgba(230,185,70,0.55)"}
          strokeWidth={isActive?"0.52":"0.24"}
          strokeDasharray={isActive?"none":"1.6 0.85"}
          filter={isActive?"url(#glow-line)":undefined}
          style={{transition:"stroke 0.3s, stroke-width 0.3s"}}/>;
      })}
    </svg>
  );
}

// ─── Info Tooltip ─────────────────────────────────────────────────────────────
function InfoTooltip({ district }) {
  const diffColor = DIFFICULTY_COLORS[district.difficulty]||"#f0c040";
  const side = district.x > 55 ? "left" : "right";
  return (
    <div style={{
      position:"absolute", top:"50%",
      [side==="left"?"right":"left"]:"calc(100% + 16px)",
      transform:"translateY(-50%)",
      width:215,
      background:"linear-gradient(135deg,rgba(6,10,24,0.97),rgba(14,18,40,0.97))",
      border:"1px solid rgba(240,192,64,0.45)",
      borderRadius:8, padding:"14px 16px",
      pointerEvents:"none", zIndex:200,
      boxShadow:"0 0 28px rgba(240,192,64,0.22), 0 6px 36px rgba(0,0,0,0.9)",
      backdropFilter:"blur(10px)",
      animation:"tipIn 0.18s ease",
    }}>
      {/* Gold corner accents */}
      {[{top:6,left:6,borderTop:"1px solid #f0c040",borderLeft:"1px solid #f0c040",borderRadius:"2px 0 0 0"},
        {top:6,right:6,borderTop:"1px solid #f0c040",borderRight:"1px solid #f0c040",borderRadius:"0 2px 0 0"},
        {bottom:6,left:6,borderBottom:"1px solid #f0c040",borderLeft:"1px solid #f0c040",borderRadius:"0 0 0 2px"},
        {bottom:6,right:6,borderBottom:"1px solid #f0c040",borderRight:"1px solid #f0c040",borderRadius:"0 0 2px 0"},
      ].map((s,i)=><div key={i} style={{position:"absolute",width:8,height:8,...s}}/>)}

      {/* Top gold rule */}
      <div style={{position:"absolute",top:0,left:12,right:12,height:1,background:"linear-gradient(90deg,transparent,rgba(240,192,64,0.7),transparent)"}}/>

      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
        <span style={{fontSize:"1.5rem"}}>{district.icon}</span>
        <span style={{fontFamily:"'Cinzel',serif",fontWeight:600,fontSize:"0.83rem",color:"#f0c040",letterSpacing:"0.04em",lineHeight:1.2}}>
          {district.name}
        </span>
      </div>
      <p style={{fontFamily:"'Georgia',serif",fontSize:"0.7rem",color:"rgba(225,200,155,0.88)",lineHeight:1.68,margin:"0 0 10px",fontStyle:"italic"}}>
        {district.description}
      </p>
      <div style={{display:"flex",alignItems:"center",gap:6,borderTop:"1px solid rgba(240,192,64,0.18)",paddingTop:8}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:diffColor,boxShadow:`0 0 7px ${diffColor}`}}/>
        <span style={{fontFamily:"monospace",fontSize:"0.65rem",color:diffColor,letterSpacing:"0.12em",textTransform:"uppercase"}}>
          {district.difficulty}
        </span>
        <div style={{flex:1}}/>
        <span style={{fontFamily:"monospace",fontSize:"0.55rem",color:"rgba(200,160,50,0.45)",letterSpacing:"0.08em"}}>CLICK TO ENTER →</span>
      </div>
    </div>
  );
}

// ─── District Node ────────────────────────────────────────────────────────────
function DistrictNode({ district, onNavigate, onHover }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={()=>{ setHov(true); onHover(district.id); }}
      onMouseLeave={()=>{ setHov(false); onHover(null); }}
      onClick={()=>onNavigate(district.id)}
      style={{position:"absolute",left:`${district.x}%`,top:`${district.y}%`,transform:"translate(-50%,-50%)",zIndex:hov?100:10,cursor:"pointer"}}
    >
      {/* Node circle */}
      <div style={{
        width:50, height:50, borderRadius:"50%",
        background:"transparent",
        border:`2.8px solid ${district.color}${hov?"ff":"e0"}`,
        boxShadow: hov
          ? `0 0 18px ${district.color}dd, 0 0 34px ${district.color}88`
          : `0 0 12px ${district.color}99, 0 0 22px ${district.color}44`,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:"1.4rem",
        transition:"all 0.28s ease",
        transform:hov?"scale(1.18)":"scale(1)",
        position:"relative",
      }}>
        <div style={{
          position:"absolute",
          inset:"-10px",
          borderRadius:"50%",
          border:`1.2px solid ${district.color}${hov?"aa":"6e"}`,
          boxShadow: hov
            ? `0 0 18px ${district.color}aa`
            : `0 0 10px ${district.color}66`,
          pointerEvents:"none",
        }}/>
        <div style={{
          position:"absolute",
          inset:"-18px",
          borderRadius:"50%",
          background:`radial-gradient(circle, ${district.color}${hov?"34":"20"} 0%, transparent 72%)`,
          filter:"blur(1px)",
          pointerEvents:"none",
        }}/>
        <span style={{
          position:"relative",
          zIndex:2,
          textShadow: hov
            ? `0 0 12px ${district.color}, 0 0 20px ${district.color}aa`
            : `0 0 7px ${district.color}aa`,
          transition:"text-shadow 0.28s ease",
        }}>
          {district.icon}
        </span>
      </div>
      {/* Label */}
      <div style={{
        position:"absolute",top:"calc(100% + 9px)",left:"50%",transform:"translateX(-50%)",
        whiteSpace:"nowrap",
        fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:"0.64rem",letterSpacing:"0.14em",
        color:hov?district.color:"rgba(247,211,109,0.92)",
        textShadow:hov
          ? `0 0 14px ${district.color}, 0 1px 6px rgba(0,0,0,0.95)`
          : "0 0 8px rgba(240,192,64,0.5), 0 1px 4px rgba(0,0,0,0.95)",
        transition:"all 0.28s",pointerEvents:"none",
      }}>
        {district.name.toUpperCase()}
      </div>
      {hov && <InfoTooltip district={district}/>}
    </div>
  );
}

// ─── Navigating Overlay ───────────────────────────────────────────────────────
function NavigatingOverlay({ navigated }) {
  if(!navigated) return null;
  const d = DISTRICTS.find(x=>x.id===navigated);
  if(!d) return null;
  return (
    <div style={{
      position:"absolute",inset:0,zIndex:300,
      background:"rgba(4,8,20,0.82)",backdropFilter:"blur(6px)",
      display:"flex",alignItems:"center",justifyContent:"center",
      animation:"fadeIn 0.3s ease",
    }}>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.52rem",letterSpacing:"0.35em",color:"rgba(240,192,64,0.4)",marginBottom:18}}>
          — ✦ —
        </div>
        <div style={{
          width:72,height:72,borderRadius:"50%",margin:"0 auto 18px",
          background:`radial-gradient(circle at 35% 35%,${d.color}cc,rgba(6,10,24,0.95) 70%)`,
          border:`2px solid ${d.color}`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:"2rem",
          boxShadow:`0 0 36px ${d.color}aa,0 0 72px ${d.color}33`,
          animation:"pulse 0.6s infinite alternate",
        }}>{d.icon}</div>
        <p style={{fontFamily:"'Cinzel',serif",fontWeight:600,fontSize:"0.8rem",color:"#f0c040",letterSpacing:"0.22em",textShadow:"0 0 14px rgba(240,192,64,0.7)",margin:"0 0 8px"}}>
          ENTERING {d.name.toUpperCase()}
        </p>
        <p style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"0.62rem",color:"rgba(220,180,80,0.45)",letterSpacing:"0.1em",margin:0}}>
          The gates open...
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DataCityMapPage({ onBack }) {
  const [activeId,  setActiveId]  = useState(null);
  const [navigated, setNavigated] = useState(null);
  const [entered,   setEntered]   = useState(false);

  useEffect(()=>{ const t=setTimeout(()=>setEntered(true),100); return ()=>clearTimeout(t); },[]);

  const handleNavigate = useCallback((id)=>{
    setNavigated(id);
    setTimeout(()=>{
      alert(`→ /district/${id}`); // replace with navigate(`/district/${id}`)
      setNavigated(null);
    },900);
  },[]);

  return (
    <div style={{
      position:"fixed",inset:0,overflow:"hidden",
      background:"#120c04",
      fontFamily:"'Cinzel','Palatino Linotype',serif",
      opacity:entered?1:0, transition:"opacity 0.8s ease",
    }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        src={mapVideo}
        style={{
          position:"absolute",
          inset:0,
          width:"100%",
          height:"100%",
          objectFit:"cover",
          zIndex:0,
          opacity:0.72,
        }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@700&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{display:none;}
        @keyframes fadeIn {from{opacity:0}to{opacity:1}}
        @keyframes pulse  {from{opacity:0.6;transform:scale(1)}to{opacity:1;transform:scale(1.06)}}
        @keyframes tipIn  {from{opacity:0;transform:translateY(-48%) scale(0.95)}to{opacity:1;transform:translateY(-50%) scale(1)}}
        @keyframes titleGlow{0%,100%{text-shadow:0 0 14px rgba(240,192,64,0.5),0 2px 4px rgba(0,0,0,0.9)}50%{text-shadow:0 0 28px rgba(240,192,64,0.8),0 2px 4px rgba(0,0,0,0.9)}}
      `}</style>

      {/* ── PARCHMENT + PARTICLES + RAIN ── */}
      <ParticleCanvas/>
      <RainCanvas/>

      {/* ── HEADER ── */}
      <header style={{
        position:"absolute",top:0,left:0,right:0,zIndex:50,height:64,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 26px",
        background:"linear-gradient(180deg,rgba(2,5,14,0.97) 0%,rgba(2,5,14,0.8) 100%)",
        borderBottom:"1px solid rgba(240,192,64,0.2)",
        backdropFilter:"blur(8px)",
      }}>
        {/* TOP LEFT — logo + title */}
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{
            width:38,height:38,borderRadius:"50%",
            background:"radial-gradient(circle,rgba(240,192,64,0.2) 0%,transparent 70%)",
            border:"1.5px solid rgba(240,192,64,0.55)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"1.15rem",
            boxShadow:"0 0 16px rgba(240,192,64,0.25)",
          }}>🗺</div>
          <div>
            <div style={{
              fontFamily:"'Cinzel Decorative','Cinzel',serif",fontWeight:700,
              fontSize:"1.05rem",letterSpacing:"0.08em",
              color:"#f0c040",lineHeight:1,
              animation:"titleGlow 3.5s ease-in-out infinite",
            }}>DATA CITY</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.48rem",letterSpacing:"0.24em",color:"#dbb03a",marginTop:3}}>
              DISTRICT MAP · SEASON I
            </div>
          </div>
        </div>

        {/* RIGHT — difficulty legend + exit */}
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div style={{display:"flex",gap:16}}>
            {Object.entries(DIFFICULTY_COLORS).map(([label,color])=>(
              <div key={label} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:color,boxShadow:`0 0 6px ${color}`}}/>
                <span style={{fontFamily:"monospace",fontSize:"0.57rem",color:"rgba(220,195,140,0.55)",letterSpacing:"0.1em"}}>{label.toUpperCase()}</span>
              </div>
            ))}
          </div>
          {onBack&&(
            <button onClick={onBack} style={{
              background:"transparent",border:"1px solid rgba(240,192,64,0.35)",
              color:"rgba(240,192,64,0.65)",padding:"6px 16px",borderRadius:4,cursor:"pointer",
              fontFamily:"'Cinzel',serif",fontSize:"0.6rem",letterSpacing:"0.12em",transition:"all 0.2s",
            }}
            onMouseEnter={e=>{e.target.style.borderColor="rgba(240,192,64,0.8)";e.target.style.color="#f0c040";e.target.style.boxShadow="0 0 12px rgba(240,192,64,0.22)";}}
            onMouseLeave={e=>{e.target.style.borderColor="rgba(240,192,64,0.35)";e.target.style.color="rgba(240,192,64,0.65)";e.target.style.boxShadow="none";}}>
              ← EXIT CITY
            </button>
          )}
        </div>
      </header>

      {/* ── MAP CONTAINER ── */}
      <div style={{
        position:"absolute",top:72,left:20,right:20,bottom:20,
        border:"1px solid rgba(240,192,64,0.22)",
        borderRadius:10,overflow:"hidden",
        boxShadow:"0 0 60px rgba(240,192,64,0.06)",
      }}>
        <ParticleCanvas/>
        <RainCanvas/>

        {/* Gold corner brackets */}
        {[
          {top:8,left:8,  borderTop:"1.5px solid rgba(240,192,64,0.6)",borderLeft:"1.5px solid rgba(240,192,64,0.6)", borderRadius:"4px 0 0 0"},
          {top:8,right:8, borderTop:"1.5px solid rgba(240,192,64,0.6)",borderRight:"1.5px solid rgba(240,192,64,0.6)",borderRadius:"0 4px 0 0"},
          {bottom:8,left:8,  borderBottom:"1.5px solid rgba(240,192,64,0.6)",borderLeft:"1.5px solid rgba(240,192,64,0.6)", borderRadius:"0 0 0 4px"},
          {bottom:8,right:8, borderBottom:"1.5px solid rgba(240,192,64,0.6)",borderRight:"1.5px solid rgba(240,192,64,0.6)",borderRadius:"0 0 4px 0"},
        ].map((s,i)=>(
          <div key={i} style={{position:"absolute",width:20,height:20,zIndex:10,...s}}/>
        ))}

        {/* Warm gold glow center */}
        <div style={{
          position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",
          width:"45%",height:"45%",
          background:"radial-gradient(ellipse,rgba(240,192,64,0.06) 0%,transparent 70%)",
          pointerEvents:"none",zIndex:3,
        }}/>

        {/* Cold moonlight from above */}
        <div style={{
          position:"absolute",left:"22%",right:"22%",top:0,height:"28%",
          background:"radial-gradient(ellipse at 50% 0%,rgba(240,192,64,0.08) 0%,transparent 100%)",
          pointerEvents:"none",zIndex:3,
        }}/>

        {/* Connection roads */}
        <ConnectionLines activeId={activeId}/>

        {/* District nodes */}
        {DISTRICTS.map(d=>(
          <DistrictNode key={d.id} district={d} onNavigate={handleNavigate} onHover={setActiveId}/>
        ))}

        {/* Navigating overlay */}
        <NavigatingOverlay navigated={navigated}/>
      </div>

      {/* Bottom status bar */}
      <div style={{
        position:"absolute",bottom:26,left:"50%",transform:"translateX(-50%)",
        zIndex:30,pointerEvents:"none",whiteSpace:"nowrap",
        fontFamily:"monospace",fontSize:"0.54rem",
        color:"rgba(240,192,64,0.3)",letterSpacing:"0.18em",
      }}>
        HOVER NODES TO INSPECT · CLICK TO ENTER DISTRICT · {DISTRICTS.length} DISTRICTS MAPPED
      </div>

      {/* Final vignette */}
      <div style={{
        position:"absolute",inset:0,pointerEvents:"none",zIndex:45,
        background:"radial-gradient(ellipse at 50% 50%,transparent 33%,rgba(1,3,10,0.68) 100%)",
      }}/>
    </div>
  );
}
