import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/* ---------- Types ---------- */
type RequiredSkill = { name: string; level: number };
type Member = { id: string; name: string; role?: string };
type Space = {
  id: string;
  kind: "project" | "group";
  name: string;
  blurb: string;
  owner: boolean;
  members: Member[];
  requiredSkills: RequiredSkill[];
  weeklyAvailability?: number;
  due?: string;
};

/* ---------- API Base ---------- */
const API_BASE = "http://localhost:8080/api";

/* ---------- Component ---------- */
export default function Dashboard() {
  const [skills, setSkills] = useState<Array<{ name: string; level: number }>>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [preview, setPreview] = useState<Space | null>(null);

  /* ---------- Fetch + Auto-Refresh ---------- */
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(`${API_BASE}/skills`);
        if (!res.ok) throw new Error("Failed to fetch skills");
        const data = await res.json();
        const mapped = data.map((s: any) => ({
          name: s.name,
          level: s.level || 1,
        }));
        setSkills(mapped);
      } catch (err) {
        console.error("Skills fetch error:", err);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE}/projects?owner=true`);
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        const mapped = data.map((p: any) => ({
          id: p.id?.toString() ?? crypto.randomUUID(),
          kind: "project" as const,
          name: p.name,
          blurb: p.projectDescription || "",
          owner: true,
          members: [],
          requiredSkills:
            p.recommendedSkills?.map((s: any) => ({
              name: s.name,
              level: s.level || 1,
            })) || [],
          weeklyAvailability: undefined,
          due: undefined,
        }));
        setSpaces(mapped);
      } catch (err) {
        console.error("Projects fetch error:", err);
      }
    };

    // Initial load
    fetchSkills();
    fetchProjects();

    // 🔁 Listen for updates from Profile / Projects pages
    const onSkillsUpdated = () => fetchSkills();
    const onSpacesUpdated = () => fetchProjects();

    window.addEventListener("skills-updated", onSkillsUpdated);
    window.addEventListener("spaces-updated", onSpacesUpdated);

    // Cleanup listeners
    return () => {
      window.removeEventListener("skills-updated", onSkillsUpdated);
      window.removeEventListener("spaces-updated", onSpacesUpdated);
    };
  }, []);

  /* ---------- Delete a project ---------- */
  const deleteOwnedSpace = async (id: string) => {
    try {
      await fetch(`${API_BASE}/projects/${id}`, { method: "DELETE" });
      setSpaces((prev) => prev.filter((s) => s.id !== id));
      showToast("Project removed");
    } catch (e) {
      console.error("Delete failed", e);
      showToast("Error deleting project");
    }
  };

  /* ---------- Toast ---------- */
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  /* ---------- Derived ---------- */
  const bars = useMemo(
    () =>
      skills.map((s) => ({
        ...s,
        pct: Math.max(10, Math.min(100, Math.round((s.level / 10) * 100))),
      })),
    [skills]
  );

  const owned = spaces.filter((s) => s.owner);
  const memberOnly = spaces.filter((s) => !s.owner);

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso + "T00:00:00");
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return iso as string;
    }
  };

  /* ---------- Render ---------- */
  return (
    <div className="space-y-8 overflow-visible">
      {/* Heading */}
      <header className="space-y-1">
        <h1
          className="text-3xl md:text-4xl font-['Orbitron'] tracking-[0.25em] leading-tight
                       text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300
                       motion-safe:animate-[textGlow_4s_ease-in-out_infinite_alternate] break-words overflow-visible"
        >
          My Dashboard
        </h1>
        <p className="text-white/70 font-['Rajdhani'] text-lg">
          Track your skill progress and manage your projects.
        </p>
      </header>

      {/* Skill Mastery */}
      <section className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 md:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.35)] overflow-visible">
        <h2 className="text-2xl md:text-3xl font-['Rajdhani'] text-white/95">
          <span className="font-semibold">Skill Mastery</span>
          <span className="ml-2 text-white/60 text-base md:text-lg">Levels synced from backend</span>
        </h2>

        {bars.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-white/15 bg-white/[0.04] p-8 text-center">
            <p className="text-white/80 font-['Rajdhani']">
              No skills yet. Add skills in{" "}
              <Link to="/profile" className="underline underline-offset-4 text-cyan-300 hover:text-cyan-200">
                Profile
              </Link>.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {bars.map((s) => (
              <div key={s.name} className="grid gap-1">
                <div className="flex items-center justify-between text-white/85">
                  <span className="font-['Rajdhani']">{s.name}</span>
                  <span className="inline-grid place-items-center w-10 h-10 rounded-full
                                   bg-white/5 border border-white/10 text-sm">
                    <div className="leading-3 text-white/70">Lv</div>
                    <div className="text-white font-semibold">{s.level}</div>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400/80 to-purple-400/80"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Groups / Projects */}
      <section className="space-y-4 overflow-visible">
        <h2 className="text-2xl md:text-3xl font-['Rajdhani'] text-white/95">My Groups / Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Owned */}
          <div className="space-y-3">
            <h3 className="text-lg font-['Rajdhani'] text-white/80">Owned</h3>
            {owned.length === 0 ? (
              <Card>
                <Empty text="You don't own any projects yet" hint="Create one from Projects." />
              </Card>
            ) : (
              <div className="grid gap-4">
                {owned.map((s) => (
                  <SpaceCard key={s.id} s={s}>
                    <div className="flex items-center gap-2">
                     <ButtonFrame onClick={() => setPreview(s)} label="View Details" />
                      
                    </div>
                  </SpaceCard>
                ))}
              </div>
            )}
          </div>

          {/* Member-only */}
          <div className="space-y-3">
            <h3 className="text-lg font-['Rajdhani'] text-white/80">Member Only</h3>
            <Card>
              <Empty text="Not a member of any groups yet" hint="Request to join from Projects/Groups." />
            </Card>
          </div>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[130]">
          <div className="rounded-xl border border-white/10 bg-black/70 backdrop-blur-md px-4 py-2 text-white font-['Rajdhani'] shadow-[0_10px_35px_rgba(0,0,0,0.45)]">
            {toast}
          </div>
        </div>
      )}

      {/* View Modal */}
      {preview && (
        <div className="fixed inset-0 z-[200] grid place-items-center p-6 md:p-8">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPreview(null)} />
          <div className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0e0e12]/95 p-6 md:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-2xl md:text-3xl font-['Rajdhani'] text-white/95 truncate">{preview.name}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {preview.owner && (
                    <span className="inline-flex items-center rounded-md px-2 py-[2px] text-[0.7rem] font-semibold bg-gradient-to-r from-[#7dd3fc] to-[#a78bfa] text-black/90">
                      Owner
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setPreview(null)}
                className="text-white/60 hover:text-white font-['Rajdhani'] text-2xl leading-none px-2"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-6">
              {/* Overview */}
              <div>
                <div className="text-white/70 font-['Rajdhani'] text-sm mb-1">Overview</div>
                <p className="text-white/85 font-['Rajdhani'] whitespace-pre-wrap">
                  {preview.blurb || "No description provided."}
                </p>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/85 font-['Rajdhani']">
                <div className="flex flex-col gap-1">
                  <span className="text-white/70 text-sm">Created On</span>
                  <span>{new Date(preview.id ? parseInt(preview.id) : Date.now()).toLocaleDateString()}</span>
                </div>
                {preview.due && (
                  <div className="flex flex-col gap-1">
                    <span className="text-white/70 text-sm">Due Date</span>
                    <span>{preview.due}</span>
                  </div>
                )}
                {preview.weeklyAvailability && (
                  <div className="flex flex-col gap-1">
                    <span className="text-white/70 text-sm">Weekly Hours</span>
                    <span>{preview.weeklyAvailability}h/week</span>
                  </div>
                )}
              </div>

              {/* Required Skills */}
              <div>
                <div className="text-white/70 font-['Rajdhani'] text-sm mb-1">Required Skills</div>
                {preview.requiredSkills.length === 0 ? (
                  <div className="text-white/60 font-['Rajdhani']">No skills listed.</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {preview.requiredSkills.map((rs, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-white/90 text-[0.85rem]"
                      >
                        {rs.name} <span className="opacity-80">Lv{rs.level}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Link button to Projects page */}
              <div className="pt-4">
                <Link
                  to="/projects"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-5 py-2.5 text-white font-['Orbitron'] uppercase tracking-wide"
                >
                  <span className="relative z-[1]">Click here to view in Projects</span>
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-xl opacity-90 [background:linear-gradient(45deg,rgba(157,45,252,0.28),rgba(2,150,255,0.28))]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-[2px] rounded-[10px] bg-[#101010]/85 border border-white/10"
                  />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Cards / Buttons / Empty ---------- */

function SpaceCard({ s, children }: { s: Space; children: React.ReactNode }) {
  return (
    <article className="relative rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-5 shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-['Rajdhani'] text-white/95 truncate">{s.name}</h3>
            {s.owner ? (
              <span className="inline-flex items-center rounded-md px-2 py-[2px] text-[0.7rem] font-semibold bg-gradient-to-r from-[#7dd3fc] to-[#a78bfa] text-black/90">
                Owner
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md px-2 py-[2px] text-[0.7rem] font-semibold bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] text-black/90">
                Member
              </span>
            )}
          </div>
          <p className="text-white/75 font-['Rajdhani'] mt-1">{s.blurb}</p>
        </div>
        <div className="shrink-0 grid gap-1 text-right">
          {s.due && (
            <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-1.5 text-white/85 font-['Rajdhani']">
              Due: {s.due}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <div className="text-white/70 font-['Rajdhani'] text-sm mb-1">Required Skills</div>
          <div className="flex flex-wrap gap-2">
            {s.requiredSkills.map((rs, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-white/90 text-[0.85rem]">
                {rs.name} <span className="opacity-80">Lv{rs.level}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end">{children}</div>
    </article>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-dashed border-white/15 bg-white/[0.04] backdrop-blur-md p-7 overflow-visible">
      {children}
    </div>
  );
}

function Empty({ text, hint }: { text: string; hint?: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-white/5 border border-white/10 grid place-items-center shadow-[inset_0_0_24px_rgba(0,0,0,0.45)]">
        <span className="text-2xl">⚡</span>
      </div>
      <h3 className="mt-5 text-xl font-['Rajdhani'] text-white/90">{text}</h3>
      {hint && <p className="mt-2 text-white/65 font-['Rajdhani']">{hint}</p>}
    </div>
  );
}

function ButtonGrad({
  label,
  onClick,
  tone = "cyan",
}: {
  label: string;
  onClick?: () => void;
  tone?: "cyan" | "green" | "pink";
}) {
  const grad =
    tone === "green"
      ? "linear-gradient(45deg,rgba(34,197,94,0.28),rgba(16,185,129,0.28))"
      : tone === "pink"
      ? "linear-gradient(45deg,rgba(244,63,94,0.30),rgba(219,39,119,0.30))"
      : "linear-gradient(45deg,rgba(2,150,255,0.28),rgba(157,45,252,0.28))";
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center justify-center overflow-hidden rounded-lg px-3 py-1.5 text-sm text-white"
    >
      <span className="relative z-[1]">{label}</span>
      <span aria-hidden className="absolute inset-0 rounded-lg opacity-90" style={{ background: grad }} />
      <span aria-hidden className="absolute inset-[2px] rounded-[8px] bg-[#101010]/85 border border-white/10" />
    </button>
  );
}

function ButtonFrame({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-4 py-2.5 text-white font-['Orbitron'] uppercase tracking-wide"
    >
      <span className="relative z-[1]">{label}</span>
      <span aria-hidden className="absolute inset-0 rounded-xl opacity-90 [background:linear-gradient(45deg,rgba(157,45,252,0.28),rgba(2,150,255,0.28))]" />
      <span aria-hidden className="absolute inset-[2px] rounded-[10px] bg-[#101010]/85 border border-white/10" />
    </button>
  );
}
