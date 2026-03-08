import { useState, useEffect, useRef } from "react";
import GateTransition from "./GateTransition";

// ─── Parchment + Castle Background Canvas ─────────────────────────────────────
function BackgroundCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const draw = () => {
      const W = canvas.width  = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;

      // Sky — stormy deep night
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0,    "#05080f");
      sky.addColorStop(0.35, "#08111e");
      sky.addColorStop(0.65, "#0d1810");
      sky.addColorStop(1,    "#1a1005");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

      // Moon glow top-right
      const moon = ctx.createRadialGradient(W*.78, H*.08, 0, W*.78, H*.08, W*.22);
      moon.addColorStop(0,   "rgba(200,210,240,0.18)");
      moon.addColorStop(0.3, "rgba(160,180,220,0.08)");
      moon.addColorStop(1,   "rgba(100,120,180,0)");
      ctx.fillStyle = moon; ctx.fillRect(0, 0, W, H);

      // Castle silhouette towers (simple geometric)
      ctx.fillStyle = "rgba(4,6,12,0.92)";
      const drawTower = (x, w, h, merlons=4) => {
        const bx = x - w/2, by = H - h;
        ctx.fillRect(bx, by, w, h);
        const mw = w / (merlons * 2 - 1);
        for(let i=0;i<merlons;i++){
          ctx.fillRect(bx + i*(mw*2), by - mw*1.4, mw, mw*1.4);
        }
        // Arrow slit windows
        ctx.fillStyle = "rgba(200,160,40,0.35)";
        ctx.fillRect(x - 2, by + h*0.3, 4, 10);
        ctx.fillRect(x - 2, by + h*0.55, 4, 10);
        ctx.fillStyle = "rgba(4,6,12,0.92)";
      };

      // Far left towers
      drawTower(W*0.04, W*0.055, H*0.45, 3);
      drawTower(W*0.1,  W*0.04,  H*0.38, 3);
      // Left keep
      drawTower(W*0.18, W*0.08,  H*0.52, 4);
      drawTower(W*0.14, W*0.045, H*0.44, 3);
      // Far right towers
      drawTower(W*0.96, W*0.055, H*0.45, 3);
      drawTower(W*0.90, W*0.04,  H*0.38, 3);
      // Right keep
      drawTower(W*0.82, W*0.08,  H*0.52, 4);
      drawTower(W*0.86, W*0.045, H*0.44, 3);
      // Tiny far towers
      drawTower(W*0.27, W*0.03, H*0.3, 2);
      drawTower(W*0.73, W*0.03, H*0.3, 2);

      // Connecting wall
      ctx.fillStyle = "rgba(4,6,12,0.88)";
      ctx.fillRect(0, H*0.56, W*0.22, H*0.44);
      ctx.fillRect(W*0.78, H*0.56, W*0.22, H*0.44);

      // Ground mist
      const mist = ctx.createLinearGradient(0, H*0.72, 0, H);
      mist.addColorStop(0, "rgba(180,150,80,0)");
      mist.addColorStop(0.4, "rgba(60,45,20,0.18)");
      mist.addColorStop(1,   "rgba(20,14,5,0.7)");
      ctx.fillStyle = mist; ctx.fillRect(0, H*0.72, W, H*0.28);

      // Gate glow from behind — warm amber light spilling out
      const gateGlow = ctx.createRadialGradient(W*.5, H*.75, 0, W*.5, H*.75, W*.35);
      gateGlow.addColorStop(0,   "rgba(240,180,40,0.22)");
      gateGlow.addColorStop(0.3, "rgba(200,130,20,0.14)");
      gateGlow.addColorStop(0.6, "rgba(160,100,10,0.07)");
      gateGlow.addColorStop(1,   "rgba(100,60,5,0)");
      ctx.fillStyle = gateGlow; ctx.fillRect(0, 0, W, H);

      // Stars
      ctx.fillStyle = "rgba(220,210,180,1)";
      for(let i=0;i<120;i++){
        const sx = (Math.sin(i*374.7)*0.5+0.5)*W;
        const sy = (Math.sin(i*127.3)*0.5+0.5)*H*0.55;
        const sr = Math.random()*0.9+0.2;
        ctx.globalAlpha = 0.3+Math.random()*0.5;
        ctx.beginPath(); ctx.arc(sx,sy,sr,0,Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Parchment grain noise overlay on bottom half
      for(let i=0;i<8000;i++){
        const px=Math.random()*W, py=H*0.5+Math.random()*H*0.5;
        ctx.fillStyle=`rgba(180,140,60,${Math.random()*0.04})`;
        ctx.fillRect(px,py,1,1);
      }

      // Final vignette
      const vig = ctx.createRadialGradient(W/2,H/2,W*0.1,W/2,H/2,W*0.8);
      vig.addColorStop(0,"rgba(0,0,0,0)");
      vig.addColorStop(0.6,"rgba(0,0,0,0.12)");
      vig.addColorStop(1,"rgba(0,0,0,0.88)");
      ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);
    };
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>;
}

// ─── Gold Particles ───────────────────────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef(null);
  const raf = useRef(null);
  useEffect(() => {
    const c=ref.current, ctx=c.getContext("2d");
    const resize=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const pts = Array.from({length:75},()=>({
      x:Math.random(), y:Math.random(),
      r:Math.random()*1.5+0.3,
      vx:(Math.random()-.5)*.00025,
      vy:-(Math.random()*.0004+0.0001),
      alpha:Math.random()*.5+0.1,
    }));
    const draw=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.y<-0.01) p.y=1.01;
        if(p.x<0) p.x=1; if(p.x>1) p.x=0;
        ctx.beginPath(); ctx.arc(p.x*c.width,p.y*c.height,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(240,192,64,${p.alpha})`; ctx.fill();
      });
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf.current);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:1}}/>;
}

// ─── Rain ─────────────────────────────────────────────────────────────────────
function RainCanvas() {
  const ref = useRef(null);
  const raf = useRef(null);
  useEffect(()=>{
    const c=ref.current, ctx=c.getContext("2d");
    let W,H;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const drops=Array.from({length:60},()=>({
      x:Math.random(),y:Math.random(),
      len:.018+Math.random()*.025,speed:.0025+Math.random()*.004,
      alpha:.05+Math.random()*.1,
    }));
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      drops.forEach(d=>{
        d.y+=d.speed; d.x+=d.speed*.08;
        if(d.y>1.04){d.y=-0.04;d.x=Math.random();}
        ctx.strokeStyle=`rgba(160,185,230,${d.alpha})`;
        ctx.lineWidth=0.6;
        ctx.beginPath();ctx.moveTo(d.x*W,d.y*H);ctx.lineTo((d.x+.002)*W,(d.y+d.len)*H);ctx.stroke();
      });
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf.current);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:2}}/>;
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function RuneInput({ label, type, value, onChange, icon, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{marginBottom:18,position:"relative"}}>
      <label style={{
        display:"block",fontFamily:"'Cinzel',serif",fontSize:"0.58rem",
        letterSpacing:"0.18em",color:"rgba(240,192,64,0.65)",marginBottom:6,
        textTransform:"uppercase",
      }}>{label}</label>
      <div style={{position:"relative"}}>
        <span style={{
          position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",
          fontSize:"1rem",opacity:focused?1:0.5,transition:"opacity 0.2s",
          pointerEvents:"none",zIndex:1,
        }}>{icon}</span>
        <input
          type={type}
          value={value}
          onChange={e=>onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          style={{
            width:"100%",
            background:focused?"rgba(240,192,64,0.06)":"rgba(4,8,20,0.7)",
            border:`1px solid ${focused?"rgba(240,192,64,0.7)":"rgba(240,192,64,0.2)"}`,
            borderRadius:4,
            padding:"11px 14px 11px 42px",
            fontFamily:"'Cinzel',serif",fontSize:"0.75rem",
            color:focused?"#f0d880":"rgba(200,180,130,0.8)",
            letterSpacing:"0.06em",
            outline:"none",
            transition:"all 0.25s",
            boxShadow:focused?"0 0 18px rgba(240,192,64,0.15), inset 0 0 12px rgba(240,192,64,0.04)":"none",
          }}
        />
        {/* Animated bottom border */}
        <div style={{
          position:"absolute",bottom:0,left:"50%",
          height:"1.5px",
          width:focused?"100%":"0%",
          transform:"translateX(-50%)",
          background:"linear-gradient(90deg,transparent,#f0c040,transparent)",
          transition:"width 0.35s ease",
          borderRadius:1,
        }}/>
      </div>
    </div>
  );
}

// ─── Main Auth Page ───────────────────────────────────────────────────────────
export default function AuthPage({ onEnterCity }) {
  const [mode,     setMode]     = useState("login"); // "login" | "signup"
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const [shake,    setShake]    = useState(false);
  const [success,  setSuccess]  = useState(false);
  const timersRef = useRef([]);

  useEffect(()=>{
    const mountTimer = setTimeout(()=>setMounted(true),80);
    timersRef.current.push(mountTimer);
    return () => {
      timersRef.current.forEach((id) => clearTimeout(id));
      timersRef.current = [];
    };
  },[]);

  const switchMode = (m) => {
    setMode(m); setName(""); setEmail(""); setPassword(""); setShake(false);
  };

  const handleSubmit = () => {
    // Validation
    if(!email||!password||(mode==="signup"&&(!name))){
      setShake(true); setTimeout(()=>setShake(false),600); return;
    }
    setLoading(true);
    const authTimer = setTimeout(()=>{
      setLoading(false);
      setSuccess(true);
      const gateTimer = setTimeout(()=>{
        setGateOpen(true);
      },600);
      timersRef.current.push(gateTimer);
    },1400);
    timersRef.current.push(authTimer);
  };

  return (
    <div style={{
      position:"fixed",inset:0,overflow:"hidden",
      opacity:mounted?1:0,transition:"opacity 0.9s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input::placeholder{color:rgba(180,150,80,0.35);font-family:'Cinzel',serif;font-size:0.7rem;letter-spacing:0.04em;}
        @keyframes fadeUp   {from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn   {from{opacity:0}to{opacity:1}}
        @keyframes gateL    {from{transform:translateX(0)}to{transform:translateX(-100%)}}
        @keyframes gateR    {from{transform:translateX(0)}to{transform:translateX(100%)}}
        @keyframes titleGlow{0%,100%{text-shadow:0 0 14px rgba(240,192,64,0.5),0 2px 6px rgba(0,0,0,0.9)}50%{text-shadow:0 0 32px rgba(240,192,64,0.85),0 2px 6px rgba(0,0,0,0.9)}}
        @keyframes torchFlicker{0%,100%{opacity:1}91%{opacity:0.95}93%{opacity:0.6}95%{opacity:1}}
        @keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-8px)}30%{transform:translateX(8px)}45%{transform:translateX(-6px)}60%{transform:translateX(6px)}75%{transform:translateX(-3px)}90%{transform:translateX(3px)}}
        @keyframes spin {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes runeFloat{0%,100%{transform:translateY(0) rotate(0deg);opacity:0.15}50%{transform:translateY(-12px) rotate(5deg);opacity:0.35}}
        @keyframes crestPulse{0%,100%{filter:drop-shadow(0 0 8px rgba(240,192,64,0.4))}50%{filter:drop-shadow(0 0 20px rgba(240,192,64,0.8))}}
        @keyframes sigilPulse{
          0%,100%{
            text-shadow:0 0 10px rgba(240,192,64,0.6),0 0 20px rgba(240,192,64,0.4);
            transform:scale(1);
          }
          50%{
            text-shadow:0 0 22px rgba(240,192,64,0.9),0 0 40px rgba(240,192,64,0.6);
            transform:scale(1.06);
          }
        }
        @keyframes successBloom{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes modeSlide{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
      `}</style>

      {/* ── BACKGROUND LAYERS ── */}
      <BackgroundCanvas />
      <ParticleCanvas />
      <RainCanvas />

      {/* Atmospheric fog bands */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:3,
        background:"radial-gradient(ellipse 100% 40% at 50% 100%, rgba(180,130,40,0.1) 0%, transparent 70%)"}}/>

      {/* ── FLOATING RUNES in background ── */}
      {["⚔","⊕","⚖","♜","🗼","✦","▦","⬡"].map((r,i)=>(
        <div key={i} style={{
          position:"absolute",
          left:`${8+i*12}%`, top:`${15+Math.sin(i*1.3)*25}%`,
          fontSize:`${1.2+Math.sin(i)*0.5}rem`,
          color:"rgba(240,192,64,0.12)",
          pointerEvents:"none",zIndex:3,
          animation:`runeFloat ${4+i*0.7}s ease-in-out infinite`,
          animationDelay:`${i*0.4}s`,
        }}>{r}</div>
      ))}

      {/* ── TORCH SCONCES (left & right) ── */}
      {[{side:"left",x:"6%"},{side:"right",x:"94%"}].map(({side,x})=>(
        <div key={side} style={{position:"absolute",left:x,top:"38%",transform:"translateX(-50%)",zIndex:10,pointerEvents:"none"}}>
          {/* Torch light bloom */}
          <div style={{
            position:"absolute",top:-30,left:"50%",transform:"translateX(-50%)",
            width:80,height:120,
            background:"radial-gradient(ellipse at 50% 30%, rgba(240,160,20,0.28) 0%, rgba(200,100,10,0.12) 40%, transparent 70%)",
            animation:"torchFlicker 3s infinite",pointerEvents:"none",
          }}/>
          <div style={{fontSize:"1.6rem",animation:"torchFlicker 2.5s infinite",animationDelay:`${side==="right"?"0.4":"0"}s`}}>🔥</div>
          <div style={{width:4,height:40,background:"linear-gradient(180deg,#6a4820,#3a2010)",margin:"0 auto",borderRadius:2}}/>
          <div style={{width:14,height:8,background:"rgba(50,30,10,0.9)",margin:"0 auto",borderRadius:"0 0 3px 3px"}}/>
        </div>
      ))}

      {/* ── MAIN GATE / FORM CARD ── */}
      <div style={{
        position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
        zIndex:20,
        animation:"fadeIn 0.6s ease 0.3s both",
      }}>

        {/* Gate arch frame */}
        <div style={{
          position:"relative",
          width:"min(420px,92vw)",
        }}>
          {/* Arch top ornament */}
          <div style={{
            textAlign:"center",marginBottom:0,
            animation:"crestPulse 4s ease-in-out infinite",
          }}>
              <div style={{
              width:64,height:64,
              borderRadius:"50%",
              background:"radial-gradient(circle at 40% 38%, rgba(240,192,64,0.25) 0%, rgba(14,10,4,0.9) 70%)",
              border:"2px solid rgba(240,192,64,0.55)",
              display:"inline-flex",alignItems:"center",justifyContent:"center",
              fontSize:"1.8rem",
              boxShadow:"0 0 28px rgba(240,192,64,0.35), 0 0 60px rgba(240,160,20,0.15)",
              marginBottom:-12,position:"relative",zIndex:2,
            }}>🏰</div>
          </div>

          {/* Card */}
          <div style={{
            background:"linear-gradient(160deg, rgba(8,12,26,0.97) 0%, rgba(12,16,32,0.97) 50%, rgba(8,10,20,0.97) 100%)",
            border:"1px solid rgba(240,192,64,0.28)",
            borderRadius:8,
            padding:"32px 36px 28px",
            boxShadow:"0 0 60px rgba(240,160,20,0.12), 0 24px 80px rgba(0,0,0,0.95), inset 0 0 40px rgba(0,0,0,0.4)",
            backdropFilter:"blur(12px)",
            animation:shake?"shake 0.55s ease":"none",
            position:"relative",overflow:"hidden",
          }}>

            {/* Inner parchment texture */}
            <div style={{position:"absolute",inset:0,pointerEvents:"none",opacity:0.04,
              backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize:"200px 200px"}}/>

            {/* Top gold accent bar */}
            <div style={{position:"absolute",top:0,left:20,right:20,height:1,
              background:"linear-gradient(90deg,transparent,rgba(240,192,64,0.8),transparent)"}}/>
            {/* Bottom accent */}
            <div style={{position:"absolute",bottom:0,left:20,right:20,height:1,
              background:"linear-gradient(90deg,transparent,rgba(240,192,64,0.4),transparent)"}}/>

            {/* Corner brackets */}
            {[{top:8,left:8,borderTop:"1.5px solid",borderLeft:"1.5px solid",borderRadius:"3px 0 0 0"},
              {top:8,right:8,borderTop:"1.5px solid",borderRight:"1.5px solid",borderRadius:"0 3px 0 0"},
              {bottom:8,left:8,borderBottom:"1.5px solid",borderLeft:"1.5px solid",borderRadius:"0 0 0 3px"},
              {bottom:8,right:8,borderBottom:"1.5px solid",borderRight:"1.5px solid",borderRadius:"0 0 3px 0"},
            ].map((s,i)=>(
              <div key={i} style={{position:"absolute",width:14,height:14,borderColor:"rgba(240,192,64,0.5)",...s}}/>
            ))}

            {/* Title */}
            <div style={{textAlign:"center",marginBottom:24}}>
              <h1 style={{
                fontFamily:"'Cinzel Decorative','Cinzel',serif",fontWeight:700,
                fontSize:"1.4rem",letterSpacing:"0.1em",
                color:"#f0c040",margin:"0 0 4px",
                animation:"titleGlow 3.5s ease-in-out infinite",
              }}>DATA CITY</h1>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.5rem",letterSpacing:"0.28em",color:"rgba(240,192,64,0.45)",marginBottom:16}}>
                ALGO KINGDOM · SEASON I
              </div>
              <div style={{
                width:80,height:1,margin:"0 auto 16px",
                background:"linear-gradient(90deg,transparent,rgba(240,192,64,0.6),transparent)",
              }}/>
              {/* Mode tabs */}
              <div style={{display:"flex",justifyContent:"center",gap:0,
                border:"1px solid rgba(240,192,64,0.2)",borderRadius:4,overflow:"hidden",
                width:"fit-content",margin:"0 auto",
              }}>
                {["login","signup"].map(m=>(
                  <button key={m} onClick={()=>switchMode(m)} style={{
                    background:mode===m?"rgba(240,192,64,0.15)":"transparent",
                    border:"none",
                    borderRight:m==="login"?"1px solid rgba(240,192,64,0.2)":"none",
                    color:mode===m?"#f0c040":"rgba(180,150,80,0.45)",
                    padding:"7px 22px",cursor:"pointer",
                    fontFamily:"'Cinzel',serif",fontSize:"0.6rem",letterSpacing:"0.16em",
                    transition:"all 0.22s",
                    textTransform:"uppercase",
                  }}>{m==="login"?"Enter Gates":"Join Kingdom"}</button>
                ))}
              </div>
            </div>

            {/* Form fields */}
            <div style={{animation:"modeSlide 0.3s ease",key:mode}}>
              {mode==="signup"&&(
                <RuneInput label="Your Name" type="text" value={name} onChange={setName}
                  icon="⚔" placeholder="Warrior's name"/>
              )}
              <RuneInput label="Email Sigil" type="email" value={email} onChange={setEmail}
                icon="✦" placeholder="your@sigil.com"/>
              <RuneInput label="Secret Rune" type="password" value={password} onChange={setPassword}
                icon="🔐" placeholder="••••••••"/>
            </div>

            {/* Forgot — only on login */}
            {mode==="login"&&(
              <div style={{textAlign:"right",marginBottom:20,marginTop:-8}}>
                <span style={{fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"0.65rem",
                  color:"rgba(200,160,60,0.4)",cursor:"pointer",letterSpacing:"0.04em",
                  transition:"color 0.2s"}}
                  onMouseEnter={e=>e.target.style.color="rgba(240,192,64,0.7)"}
                  onMouseLeave={e=>e.target.style.color="rgba(200,160,60,0.4)"}>
                  Forgotten your rune?
                </span>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading||success}
              style={{
                width:"100%",padding:"13px 0",
                background:success
                  ?"linear-gradient(135deg,rgba(96,208,128,0.3),rgba(60,160,90,0.2))"
                  :"linear-gradient(135deg,rgba(240,192,64,0.18) 0%,rgba(200,140,20,0.12) 100%)",
                border:`1.5px solid ${success?"rgba(96,208,128,0.6)":"rgba(240,192,64,0.55)"}`,
                borderRadius:4,cursor:loading||success?"default":"pointer",
                fontFamily:"'Cinzel',serif",fontWeight:700,
                fontSize:"0.75rem",letterSpacing:"0.2em",
                color:success?"#60d080":"#f0c040",
                textTransform:"uppercase",
                transition:"all 0.3s",
                boxShadow:success
                  ?"0 0 24px rgba(96,208,128,0.25)"
                  :"0 0 16px rgba(240,192,64,0.1)",
                position:"relative",overflow:"hidden",
              }}
              onMouseEnter={e=>{if(!loading&&!success){e.currentTarget.style.background="linear-gradient(135deg,rgba(240,192,64,0.28),rgba(200,140,20,0.2))";e.currentTarget.style.boxShadow="0 0 28px rgba(240,192,64,0.25)";e.currentTarget.style.color="#ffd84d";}}}
              onMouseLeave={e=>{if(!loading&&!success){e.currentTarget.style.background="linear-gradient(135deg,rgba(240,192,64,0.18),rgba(200,140,20,0.12))";e.currentTarget.style.boxShadow="0 0 16px rgba(240,192,64,0.1)";e.currentTarget.style.color="#f0c040";}}}
            >
              {/* Button shimmer */}
              <div style={{position:"absolute",top:0,left:"-100%",width:"60%",height:"100%",
                background:"linear-gradient(90deg,transparent,rgba(240,192,64,0.1),transparent)",
                animation:loading?"shimmer 1s infinite linear":"none",
                pointerEvents:"none",
              }}/>
              {loading ? (
                <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                  <span style={{display:"inline-block",width:14,height:14,border:"1.5px solid rgba(240,192,64,0.3)",borderTopColor:"#f0c040",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
                  Unsealing the gates...
                </span>
              ) : success ? (
                <span style={{animation:"successBloom 0.4s ease"}}>⚔ Gates Open — Enter Kingdom</span>
              ) : (
                mode==="login" ? "⚔ Enter the Gates" : "⚔ Forge My Banner"
              )}
            </button>

            {/* Divider */}
            <div style={{display:"flex",alignItems:"center",gap:10,margin:"18px 0 16px"}}>
              <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(240,192,64,0.15))"}}/>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:"0.52rem",color:"rgba(200,160,60,0.3)",letterSpacing:"0.12em"}}>OR ENTER VIA</span>
              <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(240,192,64,0.15),transparent)"}}/>
            </div>

            {/* OAuth — styled as faction banners */}
            <div style={{display:"flex",gap:10}}>
              {[{icon:"G",label:"Google"},{ icon:"⚡",label:"GitHub"}].map(({icon,label})=>(
                <button key={label} style={{
                  flex:1,padding:"10px 0",
                  background:"rgba(240,192,64,0.06)",
                  border:"1px solid rgba(240,192,64,0.18)",
                  borderRadius:4,cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:7,
                  fontFamily:"'Cinzel',serif",fontSize:"0.6rem",
                  color:"rgba(200,170,90,0.6)",letterSpacing:"0.1em",
                  transition:"all 0.22s",
                }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(240,192,64,0.12)";e.currentTarget.style.borderColor="rgba(240,192,64,0.4)";e.currentTarget.style.color="#d4a830";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(240,192,64,0.06)";e.currentTarget.style.borderColor="rgba(240,192,64,0.18)";e.currentTarget.style.color="rgba(200,170,90,0.6)";}}>
                  <span style={{fontSize:"0.9rem"}}>{icon}</span> {label}
                </button>
              ))}
            </div>

            {/* Switch mode link */}
            <p style={{textAlign:"center",marginTop:18,fontFamily:"'IM Fell English',serif",
              fontStyle:"italic",fontSize:"0.66rem",color:"rgba(180,150,70,0.45)",letterSpacing:"0.04em"}}>
              {mode==="login"?"Not yet a citizen? ":"Already sworn in? "}
              <span onClick={()=>switchMode(mode==="login"?"signup":"login")} style={{
                color:"rgba(240,192,64,0.6)",cursor:"pointer",transition:"color 0.2s",
                textDecoration:"underline",textDecorationColor:"rgba(240,192,64,0.25)",
              }}
              onMouseEnter={e=>e.target.style.color="#f0c040"}
              onMouseLeave={e=>e.target.style.color="rgba(240,192,64,0.6)"}>
                {mode==="login"?"Forge your banner":"Enter the gates"}
              </span>
            </p>
          </div>

          {/* Below card — district count teaser */}
          <div style={{textAlign:"center",marginTop:14,
            fontFamily:"monospace",fontSize:"0.52rem",
            color:"rgba(240,192,64,0.22)",letterSpacing:"0.18em",
          }}>
            ⚔ &nbsp; 8 DISTRICTS AWAIT · ALGO KINGDOM · SEASON I &nbsp; ⚔
          </div>
        </div>
      </div>

      <GateTransition
        active={gateOpen}
        onComplete={() => {
          setGateOpen(false);
          if (onEnterCity) onEnterCity();
        }}
      />

      {/* Heavy vignette */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:4,
        background:"radial-gradient(ellipse at 50% 50%, transparent 28%, rgba(0,0,0,0.72) 100%)"}}/>

      <style>{`
        @keyframes shimmer{from{left:-100%}to{left:200%}}
      `}</style>
    </div>
  );
}
