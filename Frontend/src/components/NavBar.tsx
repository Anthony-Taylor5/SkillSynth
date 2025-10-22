import { useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";

export default function NavBar3D() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const linkBase =
    "relative inline-flex items-center px-4 py-2 rounded-xl font-['Rajdhani'] text-[15px] tracking-wide transition-transform duration-200";
  const linkIdle =
    "text-white/80 hover:text-cyan-200 hover:-translate-y-[1px]";
  const linkActive = "text-white";

  const navItem = (to: string, label: string) => (
    <NavLink
      to={to}
      className={({ isActive }: { isActive: boolean }) =>
        [linkBase, isActive ? linkActive : linkIdle, "group"].join(" ")
      }
      onClick={() => setOpen(false)}
    >
      <span className="relative z-[2]">{label}</span>
      {/* neon underline on hover / active */}
      <span
        aria-hidden
        className={[
          "pointer-events-none absolute left-2 right-2 -bottom-1 h-[2px] rounded-full",
          "bg-gradient-to-r from-[#9d2dfc] via-[#0296ff] to-[#6a0dad]",
          "opacity-60 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left",
          pathname === to ? "scale-x-100" : "",
        ].join(" ")}
      />
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-[60]">
      <div className="relative mx-auto mt-3 w-[min(1100px,92%)]">
        {/* outer glow frame */}
        <div
          aria-hidden
          className="absolute -inset-[1px] rounded-2xl opacity-70"
          style={{
            background:
              "linear-gradient(135deg, rgba(157,45,252,0.35), rgba(2,150,255,0.35))",
            filter: "blur(12px)",
          }}
        />
        {/* bar */}
        <nav
          className="relative flex items-center justify-between rounded-2xl
                     border border-white/12 bg-[#0b0f16cc] backdrop-blur-xl
                     shadow-[0_12px_40px_rgba(0,0,0,0.45)] px-4 md:px-6 py-3"
        >
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 select-none">
            <img
              src="/ssLogo.svg"
              alt="Skill Synth"
              className="h-7 w-7 drop-shadow-[0_0_14px_rgba(2,150,255,0.45)]"
            />
            <span className="hidden sm:block font-['Orbitron'] tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
              SkillSynth
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            {navItem("/dashboard", "Dashboard")}
            {navItem("/projects", "Projects")}
            {navItem("/groups", "Groups")}
            {navItem("/learn", "Learn")}
            
          </div>

          {/* CTA / Menu */}
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="relative hidden md:inline-flex overflow-hidden rounded-xl px-3.5 py-2 text-sm
                         font-['Orbitron'] uppercase tracking-wide text-white"
            >
              <span className="relative z-[1]">Profile</span>
              <span
                aria-hidden
                className="absolute inset-0 rounded-xl opacity-90
                           [background:linear-gradient(45deg,rgba(157,45,252,0.25),rgba(2,150,255,0.25))]"
              />
              <span
                aria-hidden
                className="absolute inset-[2px] rounded-[10px] bg-[#0f121a] border border-white/10"
              />
            </Link>

            {/* Mobile burger */}
            <button
              onClick={() => setOpen((s) => !s)}
              className="md:hidden relative h-9 w-9 grid place-items-center rounded-xl border border-white/12 bg-white/5"
              aria-label="Toggle menu"
            >
              <span className="block h-[2px] w-5 bg-white/90 rounded"></span>
              <span className="block h-[2px] w-5 bg-white/90 rounded translate-y-[6px]"></span>
              <span className="block h-[2px] w-5 bg-white/90 rounded -translate-y-[6px]"></span>
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        {open && (
          <div className="md:hidden relative mt-2 rounded-2xl border border-white/12 bg-[#0b0f16e6] backdrop-blur-xl p-2">
            <div className="grid">
              {navItem("/dashboard", "Dashboard")}
              {navItem("/projects", "Projects")}
              {navItem("/groups", "Groups")}
              {navItem("/learn", "Learn")}
            </div>
          </div>
        )}
      </div>

      {/* subtle floating animation */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          header > div > nav { transform: translateZ(0); }
          header > div > nav:hover { transform: perspective(800px) rotateX(.5deg) translateY(-1px); }
        }
      `}</style>
    </header>
  );
}
