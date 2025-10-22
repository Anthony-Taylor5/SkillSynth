import { useNavigate } from 'react-router-dom';
import { useCallback } from "react"; function Header() { 

  const navigate = useNavigate();
  const handleScroll = useCallback(() => { const section = document.getElementById("main-content"); 
    if (section) section.scrollIntoView({ behavior: "smooth" }); 
  }, 
[]);

  return (
    <header className="header-container flex flex-col justify-center items-center text-center gap-6 mt-8 select-none">

      {/* Title (Orbitron) */}
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 animate-text-glow font-['Orbitron']">
        Skill Synth
      </h1>

      {/* Logo — fast, smooth 360 on load */}
      <img
        src="/ssLogo.svg"
        alt="Skill Synth Logo"
        className="w-32 h-32 md:w-40 md:h-40 animate-logo-fast drop-shadow-[0_0_28px_rgba(0,200,255,0.35)]"
      />

      {/* Paragraphs (Rajdhani) with subtle wave */}
      <div className="max-w-2xl w-full px-4 font-['Rajdhani'] tracking-wide">
        <div className="mx-auto grid gap-2 text-[1.05rem] md:text-lg lg:text-xl text-white/85 leading-relaxed">
          <p className="animate-fade-in-up wave wave-d0">
            <span className="text-cyan-300 font-semibold">Choose</span> a skill and generate
            <span className="text-purple-300"> curriculums</span> and projects.
          </p>
          <p className="animate-fade-in-up wave wave-d1">
            Tailored to your <span className="text-blue-300 font-semibold">experience</span> and level.
          </p>
          <p className="animate-fade-in-up wave wave-d2">
            <span className="text-purple-300 font-semibold">Progress</span>, learn, and
            <span className="text-cyan-300 font-semibold"> level up</span> for interviews and jobs.
          </p>
        </div>

        {/* divider */}
        <div className="mt-4 h-px w-40 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* 3D button (Rajdhani) — tasteful depth + hover lift */}
      <div className="mt-1">
        <button className="button" onClick={() => navigate('/signin')}>
  <span className="font-['Orbitron'] tracking-wide uppercase">
    Enter Skill Synth
  </span>

  <style>{`
    .button {
      position: relative;
      display: inline-block;
      text-decoration: none;
      color: #fff;
      background: linear-gradient(45deg, #6a0dad, #014f86, #6a0dad);
      padding: 14px 32px;
      border-radius: 12px;
      font-size: 1.1em;
      letter-spacing: 0.5px;
      font-weight: 600;
      cursor: pointer;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .button span {
      position: relative;
      z-index: 2;
    }

    /* inner dark background layer */
    .button::before {
      content: "";
      position: absolute;
      inset: 1px;
      background: #1a1a1a;
      border-radius: 10px;
      transition: opacity 0.5s ease;
      z-index: 1;
    }

    /* glowing gradient halo layer */
    .button::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(45deg, #9d2dfc, #0296ff, #9d2dfc);
      border-radius: 12px;
      opacity: 0;
      filter: blur(15px);
      transition: opacity 0.5s ease;
      z-index: 0;
    }

    /* hover effects */
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(1,79,134,0.4), 0 0 35px rgba(106,13,173,0.3);
    }

    .button:hover::before {
      opacity: 0.7;
    }

    .button:hover::after {
      opacity: 1;
    }

    /* active state */
    .button:active {
      transform: scale(0.97);
      box-shadow: 0 0 10px rgba(1,79,134,0.3);
    }
  `}</style>
</button>

      </div>

      {/* Animations */}
      <style>{`
        /* Title glow */
        @keyframes textGlow {
          0%, 100% {
            text-shadow:
              0 0 8px rgba(155,93,229,0.6),
              0 0 15px rgba(0,204,255,0.3);
          }
          50% {
            text-shadow:
              0 0 20px rgba(0,204,255,0.8),
              0 0 30px rgba(155,93,229,0.6);
          }
        }
        .animate-text-glow { animation: textGlow 4s ease-in-out infinite alternate; }

        /* Paragraph entrance */
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.55s ease-out both; }

        /* Continuous subtle wave (staggered) */
        @keyframes waveY {
          0%   { transform: translateY(0);    opacity: 0.94; }
          25%  { transform: translateY(-3px); opacity: 1; }
          50%  { transform: translateY(0);    opacity: 0.94; }
          75%  { transform: translateY(3px);  opacity: 1; }
          100% { transform: translateY(0);    opacity: 0.94; }
        }
        .wave { animation: waveY 2.2s ease-in-out infinite; }
        .wave.wave-d0 { animation-delay: 0.00s; }
        .wave.wave-d1 { animation-delay: 0.15s; }
        .wave.wave-d2 { animation-delay: 0.30s; }

        /* Logo fast 360 on load */
        @keyframes logoFastSpin {
          0%   { transform: scale(0.9) rotate(0deg);   opacity: 0; }
          35%  { transform: scale(1.05) rotate(300deg); opacity: 1; }
          100% { transform: scale(1.0) rotate(360deg);  opacity: 1; }
        }
        .animate-logo-fast { animation: logoFastSpin 0.65s cubic-bezier(.2,.8,.2,1) both; }

        /* From Uiverse.io by andrew-demchenk0 */ 
.pyramid-loader {
  position: relative;
  width: 300px;
  height: 300px;
  display: block;
  transform-style: preserve-3d;
  transform: rotateX(-20deg);
}

.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: spin 4s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotateY(360deg);
  }
}

.pyramid-loader .wrapper .side {
  width: 70px;
  height: 70px;
/* you can choose any gradient or color you want */
  /* background: radial-gradient( #2F2585 10%, #F028FD 70%, #2BDEAC 120%); */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  transform-origin: center top;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.pyramid-loader .wrapper .side1 {
  transform: rotateZ(-30deg) rotateY(90deg);
  background: conic-gradient( #2BDEAC, #F028FD, #D8CCE6, #2F2585);
}

.pyramid-loader .wrapper .side2 {
  transform: rotateZ(30deg) rotateY(90deg);
  background: conic-gradient( #2F2585, #D8CCE6, #F028FD, #2BDEAC);
}

.pyramid-loader .wrapper .side3 {
  transform: rotateX(30deg);
  background: conic-gradient( #2F2585, #D8CCE6, #F028FD, #2BDEAC);
}

.pyramid-loader .wrapper .side4 {
  transform: rotateX(-30deg);
  background: conic-gradient( #2BDEAC, #F028FD, #D8CCE6, #2F2585);
}

.pyramid-loader .wrapper .shadow {
  width: 60px;
  height: 60px;
  background: #8B5AD5;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  transform: rotateX(90deg) translateZ(-40px);
  filter: blur(12px);
}
      `}</style>

<div className="pyramid-section">
  <div className="pyramid-loader">
    <div className="wrapper">
      <span className="side side1"></span>
      <span className="side side2"></span>
      <span className="side side3"></span>
      <span className="side side4"></span>
      <span className="shadow"></span>
    </div>
  </div>
</div>

    </header>
  );
}

export default Header;
