import { useEffect, useMemo, useState } from "react";

type Skill = { id?: number; name: string; category?: string; level?: number };
type Contact = { email?: string; discord?: string };
type Profile = { fullName: string; availability: string; contact: Contact };

const API_BASE = "http://localhost:8080/api";

export default function Profile() {
  const [profile, setProfile] = useState<Profile>({
    fullName: "Demo User",
    availability: "1-3h",
    contact: { email: "demo@example.com", discord: "" },
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* ---------- Catalog ---------- */
  const SKILL_CATALOG: Record<string, string[]> = {
    "Programming Languages": ["JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Rust"],
    "Web Frontend": ["React", "Next.js", "Vue", "Tailwind CSS", "Redux", "HTML", "CSS"],
    "Web Backend": ["Node.js", "Spring Boot", "Express", "Django", "Flask", "FastAPI"],
    "Databases": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite"],
    "DevOps & Cloud": ["Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Terraform"],
    "Data & ML": ["NumPy", "Pandas", "scikit-learn", "PyTorch", "TensorFlow", "Prompt Engineering"],
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  /* ---------- Load Saved Profile ---------- */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("profile.basic");
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile((prev) => ({ ...prev, ...parsed }));
      }
    } catch (err) {
      console.error("Error loading saved profile:", err);
    }
  }, []);

  /* ---------- Fetch Skills ---------- */
  const fetchSkills = async () => {
    try {
      const res = await fetch(`${API_BASE}/skills`);
      if (!res.ok) throw new Error("Failed to fetch skills");
      const data = await res.json();
      const mapped = data.map((s: any) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        level: s.level || 1,
      }));
      setSkills(mapped);
    } catch (e) {
      console.error("Error fetching skills:", e);
      showToast("Error loading skills");
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  /* ---------- Save Profile ---------- */
  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        "profile.basic",
        JSON.stringify({
          fullName: profile.fullName,
          availability: profile.availability,
          contact: profile.contact,
        })
      );
      showToast("✅ Profile saved!");
    } catch (err) {
      console.error("Error saving profile:", err);
      showToast("❌ Failed to save profile");
    }
  };

  /* ---------- Add Skill ---------- */
  const addSkill = async () => {
    if (!selectedSkill) return;
    try {
      const res = await fetch(`${API_BASE}/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: selectedSkill, category: selectedCategory || "General" }),
      });
      if (!res.ok) throw new Error("Failed to add skill");

      await fetchSkills();
      showToast("Skill added!");
      setSelectedSkill("");
      setSelectedCategory("");

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("skills-updated"));
      }, 250);
    } catch (e) {
      console.error("Error adding skill:", e);
      showToast("Error adding skill");
    }
  };

  /* ---------- Update Skill ---------- */
  const updateSkillLevel = async (id: number, level: number) => {
    try {
      const skill = skills.find((s) => s.id === id);
      if (!skill) return;
      const res = await fetch(`${API_BASE}/skills`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...skill, level }),
      });
      if (!res.ok) throw new Error("Failed to update skill");
      setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, level } : s)));
      showToast(`${skill.name} updated`);
      window.dispatchEvent(new CustomEvent("skills-updated"));
    } catch (e) {
      console.error("Error updating skill:", e);
      showToast("Error updating skill");
    }
  };

  /* ---------- Remove Skill ---------- */
  const removeSkill = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/skills/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete skill");
      setSkills((prev) => prev.filter((s) => s.id !== id));
      showToast("Skill removed");
      window.dispatchEvent(new CustomEvent("skills-updated"));
    } catch (e) {
      console.error("Error removing skill:", e);
      showToast("Error removing skill");
    }
  };

  const taken = useMemo(() => new Set(skills.map((s) => s.name)), [skills]);

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen px-4 md:px-8 py-10 text-white space-y-10">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-['Orbitron'] tracking-[0.25em] leading-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 motion-safe:animate-[textGlow_4s_ease-in-out_infinite_alternate]">
          Profile
        </h1>
        <p className="text-white/70 font-['Rajdhani'] text-lg">
          Update your info or manage your skills.
        </p>
      </header>

      {/* Profile Form */}
      <form
        onSubmit={saveProfile}
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 md:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.35)] space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="block">
            <span className="text-sm text-white/80 font-['Rajdhani'] mb-1">Full Name</span>
            <input
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full rounded-xl bg-black/25 text-white border border-white/15 px-4 py-3"
              placeholder="Your name"
            />
          </label>

          <label className="block">
            <span className="text-sm text-white/80 font-['Rajdhani'] mb-1">Weekly Availability</span>
            <select
              value={profile.availability}
              onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
              className="w-full rounded-xl bg-black/25 text-white border border-white/15 px-4 py-3"
            >
              <option value="1-3h">1-3h</option>
              <option value="4-7h">4-7h</option>
              <option value="8-12h">8-12h</option>
              <option value="13-20h">13-20h</option>
              <option value="20+h">20+h</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="block">
            <span className="text-sm text-white/80 font-['Rajdhani'] mb-1">Email</span>
            <input
              value={profile.contact.email ?? ""}
              readOnly
              className="w-full rounded-xl bg-black/25 text-white border border-white/15 px-4 py-3 opacity-75"
            />
          </label>

          <label className="block">
            <span className="text-sm text-white/80 font-['Rajdhani'] mb-1">Discord</span>
            <input
              value={profile.contact.discord ?? ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  contact: { ...profile.contact, discord: e.target.value },
                })
              }
              placeholder="yourDiscord#1234"
              className="w-full rounded-xl bg-black/25 text-white border border-white/15 px-4 py-3"
            />
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-['Rajdhani'] border border-purple-400/50 bg-purple-500/25 hover:bg-purple-500/40 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>

      {/* Skills */}
      <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 md:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
        <h2 className="text-2xl md:text-3xl font-['Rajdhani'] text-white/95 mb-6">Your Skills</h2>

        {skills.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.04] p-6 text-white/70 font-['Rajdhani']">
            No skills yet — add some below.
          </div>
        )}

        {skills.map((s) => (
          <div key={s.id ?? s.name} className="space-y-2 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-white/85">{s.name}</span>
              <span className="inline-grid place-items-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-sm">
                <div className="leading-3 text-white/70">Lv</div>
                <div className="text-white font-semibold">{s.level ?? 1}</div>
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={s.level ?? 1}
              onChange={(e) => updateSkillLevel(s.id!, Number(e.target.value))}
              className="w-full accent-purple-400"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeSkill(s.id!)}
                className="px-3 py-1.5 rounded-lg border border-pink-400/40 bg-pink-500/20 hover:bg-pink-500/35 text-pink-200 text-sm font-semibold transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Add Skill */}
        <div className="mt-8 space-y-3">
          <div className="text-white/80 font-['Rajdhani']">Add a new skill</div>
          <div className="grid gap-3 md:grid-cols-2">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSkill("");
              }}
              className="rounded-xl bg-black/25 text-white border border-white/15 px-4 py-3"
            >
              <option value="">Select a category</option>
              {Object.keys(SKILL_CATALOG).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="rounded-xl bg-black/25 text-white border border-white/15 px-4 py-3"
              disabled={!selectedCategory}
            >
              <option value="">
                {selectedCategory ? "Select a skill" : "Pick category first"}
              </option>
              {selectedCategory &&
                SKILL_CATALOG[selectedCategory]
                  .filter((n) => !taken.has(n))
                  .map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
            </select>
          </div>
          <button
            type="button"
            onClick={addSkill}
            disabled={!selectedSkill}
            className="relative inline-flex items-center justify-center overflow-hidden rounded-xl px-5 py-3 text-white font-['Orbitron'] uppercase tracking-wide disabled:opacity-50"
          >
            <span className="relative z-[1]">Add Skill</span>
            <span
              aria-hidden
              className="absolute inset-0 rounded-xl opacity-90 [background:linear-gradient(45deg,rgba(157,45,252,0.25),rgba(2,150,255,0.25))]"
            />
            <span
              aria-hidden
              className="absolute inset-[2px] rounded-[10px] bg-[#101010]/80 border border-white/10"
            />
          </button>
        </div>
      </section>

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
