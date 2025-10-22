// src/pages/Groups.tsx
import { useMemo, useState, useEffect } from "react";

/* ---------------- Skill catalog (same buckets) ---------------- */
type Catalog = Record<string, { label: string; items: string[] }>;
const SKILL_CATALOG: Catalog = {
  Programming: { label: "Programming", items: ["JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Rust", "C++"] },
  "Web Frontend": { label: "Web Frontend", items: ["HTML", "CSS", "React", "Next.js", "Tailwind", "Svelte", "Vue"] },
  "Web Backend": { label: "Web Backend", items: ["Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET Core"] },
  Databases: { label: "Databases", items: ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Prisma"] },
  "Operating Systems": { label: "Operating Systems", items: ["Linux Basics", "Windows Admin", "Shell Scripting"] },
  Networking: { label: "Networking", items: ["TCP/IP", "HTTP/HTTPS", "DNS", "Routing", "VPNs", "Firewalls"] },
  "Cloud & DevOps": { label: "Cloud & DevOps", items: ["Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Terraform"] },
  Cybersecurity: { label: "Cybersecurity", items: ["OWASP Top 10", "Threat Modeling", "AuthN/AuthZ"] },
  "Data & ML": { label: "Data & ML", items: ["NumPy", "Pandas", "Matplotlib", "scikit-learn", "Prompt Engineering"] },
  Mobile: { label: "Mobile", items: ["React Native", "SwiftUI", "Kotlin Android", "Flutter"] },
};

/* ---------------- Types + Mock Data ---------------- */
type RequiredSkill = { name: string; level: number };
type Creator = { name: string; discord: string };

type Group = {
  id: string;
  name: string;
  blurb: string;
  weeklyAvailability: number; // expected hours per member
  requiredSkills: RequiredSkill[];
  openSeats: number;
  createdBy: Creator;
};

const MOCK_GROUPS: Group[] = [
  {
    id: "g1",
    name: "React SaaS Starter",
    blurb: "Build a small SaaS dashboard with auth, charts, and billing mock.",
    weeklyAvailability: 6,
    requiredSkills: [
      { name: "React", level: 4 },
      { name: "TypeScript", level: 3 },
      { name: "Tailwind", level: 2 },
    ],
    openSeats: 2,
    createdBy: { name: "Jane Smith", discord: "janesmith#1029" },
  },
  {
    id: "g2",
    name: "Go API + Postgres",
    blurb: "REST API with Go, Postgres, and a tiny frontend to test endpoints.",
    weeklyAvailability: 4,
    requiredSkills: [
      { name: "Go", level: 3 },
      { name: "PostgreSQL", level: 3 },
      { name: "Docker", level: 2 },
    ],
    openSeats: 0,
    createdBy: { name: "Alex Doe", discord: "alexdoe#7741" },
  },
  {
    id: "g3",
    name: "ML Micro-Lab",
    blurb: "Weekly ML mini-experiments: scikit-learn, notebooks, and metrics.",
    weeklyAvailability: 5,
    requiredSkills: [
      { name: "Python", level: 4 },
      { name: "scikit-learn", level: 3 },
      { name: "Pandas", level: 3 },
    ],
    openSeats: 1,
    createdBy: { name: "Sam Wilson", discord: "samwilson#2238" },
  },
  {
    id: "g4",
    name: "Cloud Native Notes",
    blurb: "K8s + Terraform infra for a simple notes app. IaC best practices.",
    weeklyAvailability: 8,
    requiredSkills: [
      { name: "Kubernetes", level: 3 },
      { name: "Terraform", level: 3 },
      { name: "AWS", level: 2 },
    ],
    openSeats: 4,
    createdBy: { name: "Chen Wei", discord: "chenwei#8890" },
  },
];

/* ---------------- Component ---------------- */
export default function Groups() {
  // Search + filters
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("");
  const [skill, setSkill] = useState<string>("");
  const [minLevel, setMinLevel] = useState<number>(3);
  const [maxHours, setMaxHours] = useState<number>(10);

  // Toast
  const [toast, setToast] = useState<{ text: string; tone: "ok" | "error" } | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const categoryOptions = useMemo(() => Object.keys(SKILL_CATALOG), []);
  const skillOptions = useMemo(
    () => (category ? SKILL_CATALOG[category]?.items ?? [] : []),
    [category]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_GROUPS.filter((g) => {
      // search by name or creator text/discord
      if (q && ![g.name, g.createdBy.name, g.createdBy.discord].some(t => t.toLowerCase().includes(q))) return false;
      if (g.weeklyAvailability > maxHours) return false;
      if (skill) {
        const match = g.requiredSkills.some(
          (rs) => rs.name.toLowerCase() === skill.toLowerCase() && rs.level >= minLevel
        );
        if (!match) return false;
      }
      return true;
    });
  }, [query, skill, minLevel, maxHours]);

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setSkill("");
    setMinLevel(3);
    setMaxHours(10);
  };

  const showToast = (text: string, tone: "ok" | "error") => setToast({ text, tone });

  return (
    <div className="w-[min(1100px,95%)] mx-auto py-10 md:py-14 space-y-8 overflow-visible">
      {/* Heading */}
      <header className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-['Orbitron'] tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
          Find Groups
        </h1>
        <p className="text-white/75 font-['Rajdhani'] text-lg">
          Filter by skill level, weekly availability, or search by project/creator.
        </p>
      </header>

      {/* Filters card */}
      <section className="relative rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-5 md:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-45"
          style={{
            background: "linear-gradient(120deg, rgba(157,45,252,0.18), rgba(2,150,255,0.18))",
            filter: "blur(18px)",
            zIndex: -1,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-end">
          {/* Search (with inline clear) */}
          <label className="grid gap-2 relative">
            <span className="text-white/80 font-['Rajdhani']">Search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Project, creator, or discord…"
              className="w-full rounded-xl bg-black/25 text-white placeholder-white/45 border border-white/15
                         focus:outline-none focus:ring-2 focus:ring-cyan-300/70 px-4 py-3 pr-24
                         font-['Rajdhani'] tracking-wide"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 bottom-2 h-[36px] px-3 text-sm
                           text-white/85 hover:text-white bg-white/10 border border-white/10
                           rounded-lg"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </label>

          {/* Category */}
          <label className="grid gap-2">
            <span className="text-white/80 font-['Rajdhani']">Category</span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSkill("");
              }}
              className="rounded-xl bg-black/25 text-white border border-white/15 focus:outline-none px-4 py-3 appearance-none"
            >
              <option value="">Any</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          {/* Skill */}
          <label className="grid gap-2">
            <span className="text-white/80 font-['Rajdhani']">Skill</span>
            <select
              value={skill}
              disabled={!category}
              onChange={(e) => setSkill(e.target.value)}
              className="rounded-xl bg-black/25 text-white border border-white/15 focus:outline-none px-4 py-3 appearance-none disabled:opacity-50"
            >
              <option value="">{category ? "Any" : "Choose category first"}</option>
              {skillOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          {/* Min level */}
          <label className="grid gap-1">
            <span className="text-white/80 font-['Rajdhani']">Min Level {skill && `(Lv${minLevel})`}</span>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={minLevel}
              onChange={(e) => setMinLevel(parseInt(e.target.value))}
              disabled={!skill}
            />
          </label>

          {/* Weekly availability */}
          <label className="grid gap-1">
            <span className="text-white/80 font-['Rajdhani']">Max Weekly Hours: {maxHours}h</span>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={maxHours}
              onChange={(e) => setMaxHours(parseInt(e.target.value))}
            />
          </label>

          {/* Clear all */}
          <div className="pt-6 lg:pt-0">
            <button
              onClick={clearFilters}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-4 py-2.5 text-white font-['Rajdhani']"
            >
              <span className="relative z-[1]">Clear</span>
              <span
                aria-hidden
                className="absolute inset-0 rounded-xl opacity-90 [background:linear-gradient(45deg,rgba(2,150,255,0.28),rgba(157,45,252,0.28))]"
              />
              <span
                aria-hidden
                className="absolute inset-[2px] rounded-[10px] bg-[#101010]/85 border border-white/10"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-['Rajdhani'] text-white/95">Groups</h2>
          <span className="text-white/60 font-['Rajdhani'] text-sm">{filtered.length} result(s)</span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.04] p-8 text-center">
            <p className="text-white/80 font-['Rajdhani']">No groups match your filters. Try widening them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((g) => {
              const canJoin = g.openSeats > 0;
              return (
                <article
                  key={g.id}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-5 shadow-[0_10px_35px_rgba(0,0,0,0.35)]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-45"
                    style={{
                      background: "linear-gradient(120deg, rgba(157,45,252,0.16), rgba(2,150,255,0.16))",
                      filter: "blur(16px)",
                      zIndex: -1,
                    }}
                  />

                  {/* Header + creator */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-2xl font-['Rajdhani'] text-white/95">{g.name}</h3>
                      <p className="text-white/75 font-['Rajdhani'] mt-1">{g.blurb}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-white/70 font-['Rajdhani']">by</span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-white/90">
                          <span className="font-['Rajdhani']">{g.createdBy.name}</span>
                          <span className="text-white/60">•</span>
                          <span className="font-mono text-white/85" title="Discord">
                            {g.createdBy.discord}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 rounded-xl border border-white/10 bg-black/30 px-3 py-1.5 text-white/85 font-['Rajdhani']">
                      {g.openSeats} seat{g.openSeats !== 1 ? "s" : ""} open
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-white/70 font-['Rajdhani'] text-sm mb-1">Weekly Availability</div>
                      <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white/90 font-['Rajdhani']">
                        ~{g.weeklyAvailability}h / wk
                      </div>
                    </div>
                    <div>
                      <div className="text-white/70 font-['Rajdhani'] text-sm mb-1">Required Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {g.requiredSkills.map((s, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-white/90 text-[0.85rem]"
                            title={`Level ${s.level}`}
                          >
                            {s.name} <span className="opacity-80">Lv{s.level}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-5 flex items-center justify-end">
                    <button
                      className={[
                        "group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-4 py-2.5 text-white font-['Orbitron'] uppercase tracking-wide",
                        canJoin ? "" : "opacity-70 cursor-not-allowed",
                      ].join(" ")}
                      onClick={() =>
                        canJoin
                          ? showToast("Request sent ✅", "ok")
                          : showToast("Cannot join — no seats available", "error")
                      }
                    >
                      <span className="relative z-[1]">{canJoin ? "Request to Join" : "Cannot Join"}</span>
                      <span
                        aria-hidden
                        className={[
                          "absolute inset-0 rounded-xl opacity-90",
                          canJoin
                            ? "[background:linear-gradient(45deg,rgba(157,45,252,0.28),rgba(2,150,255,0.28))]"
                            : "[background:linear-gradient(45deg,rgba(120,120,120,0.28),rgba(80,80,80,0.28))]"
                        ].join(" ")}
                      />
                      <span aria-hidden className="absolute inset-[2px] rounded-[10px] bg-[#101010]/85 border border-white/10" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Pretty Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[140]">
          <div
            role="status"
            className={[
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-white shadow-[0_18px_50px_rgba(0,0,0,0.45)]",
              "backdrop-blur-xl border",
              toast.tone === "ok"
                ? "border-green-300/25 bg-[rgba(16,185,129,0.16)]"
                : "border-pink-300/25 bg-[rgba(244,63,94,0.16)]",
            ].join(" ")}
          >
            <div
              aria-hidden
              className={[
                "h-2 w-2 rounded-full",
                toast.tone === "ok" ? "bg-green-300 shadow-[0_0_18px_rgba(16,185,129,0.8)]"
                                    : "bg-pink-300 shadow-[0_0_18px_rgba(244,63,94,0.8)]",
              ].join(" ")}
            />
            <span className="font-['Rajdhani']">{toast.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}
