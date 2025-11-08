import { useEffect, useMemo, useState } from "react";

/* ---------- Types ---------- */
type RequiredSkill = { name: string; level: number };
type Project = {
  id: string;
  title: string;
  description: string;
  authorName: string;
  createdAt: string;
  minHours?: string;
  skills: RequiredSkill[];
};

/* ---------- Constants ---------- */
const API_BASE = "http://localhost:8080/api";

type Catalog = Record<string, { label: string; items: string[] }>;

const SKILL_CATALOG: Catalog = {
  Programming: { label: "Programming", items: ["JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Rust", "C++"] },
  "Web Frontend": { label: "Web Frontend", items: ["HTML", "CSS", "React", "Next.js", "Tailwind", "Svelte", "Vue"] },
  "Web Backend": { label: "Web Backend", items: ["Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET Core"] },
  Databases: { label: "Databases", items: ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Prisma", "ORM Basics"] },
  "Cloud & DevOps": { label: "Cloud & DevOps", items: ["Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Terraform"] },
  Cybersecurity: { label: "Cybersecurity", items: ["OWASP Top 10", "Threat Modeling", "AuthN/AuthZ", "Network Sec", "App Sec", "SOC Basics"] },
  "Data & ML": { label: "Data & ML", items: ["NumPy", "Pandas", "Matplotlib", "scikit-learn", "Prompt Engineering", "LLM Basics"] },
  Mobile: { label: "Mobile", items: ["React Native", "SwiftUI", "Kotlin Android", "Flutter", "UI/UX Basics"] },
};

/* ---------- Component ---------- */
export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [matchesFor, setMatchesFor] = useState<Project | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [minHours, setMinHours] = useState<number>(4);
  const [skillCategory, setSkillCategory] = useState("");
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState<number>(3);
  const [requiredSkills, setRequiredSkills] = useState<RequiredSkill[]>([]);

  const categoryOptions = useMemo(() => Object.keys(SKILL_CATALOG), []);
  const skillOptions = useMemo(
    () => (skillCategory ? SKILL_CATALOG[skillCategory]?.items ?? [] : []),
    [skillCategory]
  );

  /* ---------- Fetch Projects ---------- */
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(`${API_BASE}/projects`);
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        const mapped = data.map((p: any) => ({
          id: p.id?.toString() ?? crypto.randomUUID(),
          title: p.name,
          description: p.projectDescription,
          authorName: p.ownerName ?? "You",
          createdAt: p.createdAt ?? new Date().toISOString(),
          minHours: p.dateRange ?? "",
          skills:
            p.recommendedSkills?.map((s: any) => ({
              name: s.name,
              level: s.level ?? 3,
            })) ?? [],
        }));
        setProjects(mapped);
      } catch (err) {
        console.error("Fetch projects error:", err);
      }
    }
    fetchProjects();
  }, []);

  /* ---------- Form Helpers ---------- */
  const resetForm = () => {
    setTitle("");
    setDesc("");
    setMinHours(4);
    setSkillCategory("");
    setSkillName("");
    setSkillLevel(3);
    setRequiredSkills([]);
    setEditTarget(null);
  };

  const openCreate = () => {
    resetForm();
    setShowCreate(true);
  };

  const openEdit = (p: Project) => {
    setEditTarget(p);
    setTitle(p.title);
    setDesc(p.description);
    setMinHours(parseInt(p.minHours as any) || 4);
    setRequiredSkills(p.skills);
    setShowCreate(true);
  };

  const addSkill = () => {
    if (!skillName) return;
    setRequiredSkills((prev) => {
      const exists = prev.some((s) => s.name.toLowerCase() === skillName.toLowerCase());
      return exists
        ? prev.map((s) =>
            s.name.toLowerCase() === skillName.toLowerCase() ? { ...s, level: skillLevel } : s
          )
        : [...prev, { name: skillName, level: skillLevel }];
    });
    setSkillName("");
    setSkillLevel(3);
  };

  const removeSkill = (name: string) =>
    setRequiredSkills((prev) => prev.filter((s) => s.name.toLowerCase() !== name.toLowerCase()));

  /* ---------- Save Project ---------- */
  const submitProject = async (e: React.FormEvent) => {
    e.preventDefault();

  // 1) Compute a single, sane experience level
  const experienceLevel =
    requiredSkills.length > 0
      ? Math.round(
          requiredSkills.reduce((acc, s) => acc + (Number.isFinite(s.level) ? s.level : 3), 0) /
            requiredSkills.length
        )
      : 3;

  // 2) Build the exact payload your controller expects
  // 2) Build the exact payload your controller expects
  const payload = {
    ...(editTarget ? { id: editTarget.id } : {}), // include ID only when editing
    name: title.trim(),
    projectDescription: desc.trim(),
    dateRange: `${minHours}h/week`,
    recommendedSkills: requiredSkills.map((s) => ({
      name: s.name,
      category: "General",
    })),
    experienceLevel,
  };



    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: editTarget ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");

      setToast(editTarget ? "Project updated!" : "Project created!");

      const refresh = await fetch(`${API_BASE}/projects`);
      const updated = await refresh.json();
      const mapped = updated.map((p: any) => ({
        id: p.id?.toString() ?? crypto.randomUUID(),
        title: p.name,
        description: p.projectDescription,
        authorName: p.ownerName ?? "You",
        createdAt: p.createdAt ?? new Date().toISOString(),
        minHours: p.dateRange ?? "",
        skills:
          p.recommendedSkills?.map((s: any) => ({
            name: s.name,
            level: s.level ?? 3,
          })) ?? [],
      }));
      setProjects(mapped);

      window.dispatchEvent(new Event("spaces-updated"));
      setShowCreate(false);
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      console.error("Project save error:", err);
      setToast("Error saving project");
    }
  };

  /* ---------- Delete Project ---------- */
  const deleteProject = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setToast("Project deleted.");
      window.dispatchEvent(new Event("spaces-updated"));
      setTimeout(() => setToast(null), 2200);
    } catch (err) {
      console.error("Project delete error:", err);
      setToast("Error deleting project");
    }
  };
    // ---------- Teammates Feature ----------
  type Teammate = { name: string; match: number; skills: { name: string; level: number }[] };
  const [teammates, setTeammates] = useState<Teammate[]>([]);

  const findTeammates = (p: Project) => {
    setMatchesFor(p);
    setTeammates([
      {
        name: "Alex Kim",
        match: 92,
        skills: [
          { name: "React", level: 8 },
          { name: "Node.js", level: 7 },
        ],
      },
      {
        name: "Jordan Patel",
        match: 85,
        skills: [
          { name: "Python", level: 9 },
          { name: "FastAPI", level: 7 },
        ],
      },
      {
        name: "Samantha Lee",
        match: 78,
        skills: [
          { name: "UI/UX", level: 8 },
          { name: "Tailwind", level: 6 },
        ],
      },
    ]);
  };


  /* ---------- UI ---------- */
  return (
    <div className="w-[min(1100px,95%)] mx-auto py-10 md:py-14 space-y-8">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-['Orbitron'] tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
            Project Board
          </h1>
          <p className="text-white/75 font-['Rajdhani'] text-lg">Create and manage your projects.</p>
        </div>
        <button
          onClick={openCreate}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-4 py-2.5 text-white font-['Orbitron'] uppercase tracking-wide"
        >
          <span className="relative z-[1]">Create Project</span>
          <span aria-hidden className="absolute inset-0 rounded-xl opacity-90 [background:linear-gradient(45deg,rgba(157,45,252,0.28),rgba(2,150,255,0.28))]" />
          <span aria-hidden className="absolute inset-[2px] rounded-[10px] bg-[#101010]/85 border border-white/10" />
        </button>
      </header>

      {/* Project List */}
      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.04] p-7 text-white/70 font-['Rajdhani'] text-center">
          No projects yet — create one above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.35)]"
            >
              <h3 className="text-2xl font-['Rajdhani'] text-white/95">{p.title}</h3>
              <p className="text-white/60 font-['Rajdhani']">{p.description}</p>
              {p.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.skills.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-white/90 text-sm"
                    >
                      {s.name} Lv{s.level}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex gap-2 flex-wrap">
              <button
                onClick={() => openEdit(p)}
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-white text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProject(p.id)}
                className="rounded-lg border border-pink-400/40 bg-pink-500/20 hover:bg-pink-500/35 px-3 py-1 text-sm text-pink-200"
              >
                Delete
              </button>
              <button
                onClick={() => findTeammates(p)}
                className="rounded-lg border border-cyan-400/40 bg-cyan-500/20 hover:bg-cyan-500/35 px-3 py-1 text-sm text-white"
              >
                Find Teammates
              </button>
            </div>

            </article>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[200] grid place-items-center p-6 md:p-8">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowCreate(false);
            }}
          />
          <div className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-[#0e0e12]/95 shadow-lg p-8">
            <h3 className="text-2xl font-['Rajdhani'] text-white mb-4">
              {editTarget ? "Edit Project" : "Create Project"}
            </h3>
            <form onSubmit={submitProject} className="space-y-5">
              <label className="grid gap-2">
                <span className="text-white/85 font-['Rajdhani']">Project Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="rounded-xl bg-black/25 text-white border border-white/15 px-4 py-2"
                  placeholder="e.g., AI Assistant App"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-white/85 font-['Rajdhani']">Project Description</span>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                  rows={5}
                  className="rounded-xl bg-black/25 text-white border border-white/15 px-4 py-2"
                  placeholder="Describe your project..."
                />
              </label>

              <label className="grid gap-2">
                <span className="text-white/80 font-['Rajdhani']">Weekly Hours: {minHours}h</span>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={minHours}
                  onChange={(e) => setMinHours(parseInt(e.target.value))}
                />
              </label>

              {/* Skills */}
              <div className="space-y-2">
                <span className="text-white/80 font-['Rajdhani']">Required Skills</span>
                {requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {requiredSkills.map((s) => (
                      <span
                        key={s.name}
                        className="inline-flex items-center gap-1 border border-white/10 rounded-lg px-3 py-1 text-white bg-white/[0.05]"
                      >
                        {s.name} Lv{s.level}
                        <button
                          type="button"
                          onClick={() => removeSkill(s.name)}
                          className="ml-1 text-white/60 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid md:grid-cols-[1fr_1fr_150px_auto] gap-3 items-end">
                  <select
                    value={skillCategory}
                    onChange={(e) => {
                      setSkillCategory(e.target.value);
                      setSkillName("");
                    }}
                    className="rounded-xl bg-black/25 text-white border border-white/15 px-3 py-2"
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map((c) => (
                      <option key={c} value={c} className="text-black bg-white">
                        {SKILL_CATALOG[c].label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    disabled={!skillCategory}
                    className="rounded-xl bg-black/25 text-white border border-white/15 px-3 py-2"
                  >
                    <option value="">{skillCategory ? "Select Skill" : "Pick Category First"}</option>
                    {skillOptions.map((s) => (
                      <option key={s} value={s} className="text-black bg-white">
                        {s}
                      </option>
                    ))}
                  </select>

                  <div className="text-white/70 text-sm font-['Rajdhani']">
                    Lv{skillLevel}
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(parseInt(e.target.value))}
                      className="w-full"
                      disabled={!skillName}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addSkill}
                    disabled={!skillName}
                    className="rounded-xl border border-white/15 bg-white/[0.1] px-4 py-2 text-white disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl border border-white/15 px-4 py-2 text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl border border-cyan-400/50 bg-cyan-400/20 px-5 py-2 text-white font-['Orbitron']"
                >
                  {editTarget ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    

  
      {/* Teammates Section */}
      {matchesFor && (
        <section className="space-y-6 pt-10 border-t border-white/10">
          <h2 className="text-2xl md:text-3xl font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
            Suggested Teammates for {matchesFor.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {teammates.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-md space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-['Rajdhani'] text-white">{t.name}</h3>
                  <span className="text-cyan-300 text-sm font-['Rajdhani']">
                    Match: <span className="text-white">{t.match}%</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {t.skills.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-white/85 text-sm"
                    >
                      {s.name} Lv{s.level}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
    )}
    

      

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[220]">
          <div className="rounded-xl border border-white/10 bg-black/70 px-4 py-2 text-white font-['Rajdhani'] shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
