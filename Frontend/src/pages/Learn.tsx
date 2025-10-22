import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ---------- Types ---------- */
type Difficulty = "Novice" | "Beginner" | "Intermediate" | "Advanced" | "Expert";
type MicroProject = { title: string; description: string; relevantSkills: string[] };

const API_BASE = "http://localhost:8080/api";

/* ---------- Helpers ---------- */
const RESOURCES = [
  {
    title: "freeCodeCamp",
    url: "https://www.freecodecamp.org/",
    blurb: "Full free curriculum for web + JS.",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=70",
  },
  {
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org/",
    blurb: "Authoritative reference for web APIs.",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=70",
  },
  {
    title: "The Odin Project",
    url: "https://www.theodinproject.com/",
    blurb: "Project-based web dev learning.",
    img: "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a6?auto=format&fit=crop&w=800&q=70",
  },
  {
    title: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu/",
    blurb: "University-grade CS courses, free.",
    img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=70",
  },
  {
    title: "CS50",
    url: "https://cs50.harvard.edu/",
    blurb: "Harvard’s flagship intro to CS.",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=70",
  },
  {
    title: "Roadmap.sh",
    url: "https://roadmap.sh/",
    blurb: "Visual roadmaps for tech roles/skills.",
    img: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=800&q=70",
  },
];

/* ---------- Hardcoded Skills ---------- */
const ALL_SKILLS = [
  // Programming
  "JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Rust", "C++",
  // Web Frontend
  "HTML", "CSS", "React", "Next.js", "Tailwind", "Svelte", "Vue",
  // Web Backend
  "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET Core",
  // Databases
  "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Prisma", "ORM Basics",
  // Operating Systems
  "Linux Basics", "Windows Admin", "Shell Scripting", "Process & Memory", "Filesystems",
  // Networking
  "TCP/IP", "HTTP/HTTPS", "DNS", "Routing", "VPNs", "Firewalls",
  // Cloud & DevOps
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Terraform",
  // Cybersecurity
  "OWASP Top 10", "Threat Modeling", "AuthN/AuthZ", "Network Sec", "App Sec", "SOC Basics",
  // Data & ML
  "NumPy", "Pandas", "Matplotlib", "scikit-learn", "Prompt Engineering", "LLM Basics",
  // Mobile
  "React Native", "SwiftUI", "Kotlin Android", "Flutter", "UI/UX Basics",
];

const DEFAULT_PROJECTS: Record<string, { title: string; description: string; relevantSkills: string[] }> = {
  "HTML": {
    title: "Build a Personal Portfolio Page",
    description: "Create a personal portfolio using HTML and CSS. Include sections for your bio, skills, and links to your projects.",
    relevantSkills: ["HTML", "CSS"],
  },
  "CSS": {
    title: "Responsive Landing Page",
    description: "Design a visually appealing landing page using Flexbox or Grid. Make it mobile-friendly!",
    relevantSkills: ["CSS", "Responsive Design"],
  },
  "JavaScript": {
    title: "To-Do List App",
    description: "Build a simple to-do list that lets users add, edit, and delete tasks. Store data in localStorage.",
    relevantSkills: ["JavaScript", "HTML", "CSS"],
  },
  "React": {
    title: "Weather Dashboard",
    description: "Use a weather API to display current conditions and a 5-day forecast. Learn to handle APIs in React.",
    relevantSkills: ["React", "API Fetching", "Tailwind"],
  },
  "Python": {
    title: "Command-Line Quiz Game",
    description: "Write a small terminal quiz app that tracks user score. Use dictionaries and control flow.",
    relevantSkills: ["Python", "Logic", "CLI"],
  },
  "Node.js": {
    title: "Simple REST API",
    description: "Build a basic Express server with CRUD endpoints for managing notes.",
    relevantSkills: ["Node.js", "Express"],
  },
};

/* ---------- Difficulty Helper ---------- */
function difficultyToLevel(d: Difficulty): number {
  switch (d) {
    case "Novice": return 1;
    case "Beginner": return 2;
    case "Intermediate": return 3;
    case "Advanced": return 4;
    case "Expert": return 5;
    default: return 3;
  }
}
/* ---------- Component ---------- */
export default function Learn() {
  
  const [skills] = useState<string[]>(ALL_SKILLS);
  const [selectedSkill, setSelectedSkill] = useState(ALL_SKILLS[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("Novice");
  const [timeAvailability, setTimeAvailability] = useState<number>(5);
  const [projects, setProjects] = useState<MicroProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  

  /* ---------- Infinite Carousel Animation ---------- */
  const [offset, setOffset] = useState(0);
  const CARD_WIDTH = 280; // px
  const SCROLL_SPEED = 1.2; // pixels per frame

  useEffect(() => {
    let rafId: number;
    const animate = () => {
      setOffset((prev) => {
        const totalWidth = RESOURCES.length * CARD_WIDTH;
        const newOffset = (prev + SCROLL_SPEED) % totalWidth;
        return newOffset;
      });
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  /* ---------- Generate from backend ---------- */
  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSkill) return;
    setLoading(true);
    setProjects([]);

    try {
      const body = {
        main_skills: [selectedSkill],
        time_availability: timeAvailability,
        experience_level: difficultyToLevel(difficulty),
      };

      const res = await fetch(`${API_BASE}/ml/generate-project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      const p = data?.project;

      // 🔹 Detect if backend returned a "fallback" message instead of a real idea
      const isBackendFallback =
        !p ||
        !p.description ||
        p.description.toLowerCase().includes("ai generation service unavailable");

      if (isBackendFallback) {
        console.warn("⚠️ Backend AI unavailable, using local defaults instead.");

        const fallback = DEFAULT_PROJECTS[selectedSkill] || {
          title: `${selectedSkill} Practice Project`,
          description: `Build something small using ${selectedSkill}. Focus on its core concepts.`,
          relevantSkills: [selectedSkill],
        };

        setProjects([fallback]);
        showToast("⚠️ AI unavailable — showing default project for this skill.");
        return;
      }

      // ✅ Normal AI-generated project flow
      const mp: MicroProject = {
        title: p.project_name || `${selectedSkill} Practice Project`,
        description: p.description || "No description provided by model.",
        relevantSkills: p.relevant_skills || [],
      };

      setProjects([mp]);
      showToast("✅ Generated project using backend AI!");
    } catch (err) {
      console.error("Backend generation failed:", err);
      showToast("⚠️ AI unavailable — showing default project for this skill.");

      const fallback = DEFAULT_PROJECTS[selectedSkill] || {
        title: `${selectedSkill} Practice Project`,
        description: `Build something small using ${selectedSkill}. Focus on its core concepts.`,
        relevantSkills: [selectedSkill],
      };

      setProjects([fallback]);
    } finally {
      setLoading(false);
      setTimeout(() => trackRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
    }
  }


  /* ---------- Add project ---------- */
  async function addToProjects(p: MicroProject) {
    try {
      // Build backend payload
      const projectBody = {
        name: p.title.trim(),
        projectDescription: p.description.trim(),
        recommendedSkills: p.relevantSkills.map((s) => ({ name: s, category: "General" })),
        experienceLevel: difficultyToLevel(difficulty),
        dateRange: `${timeAvailability}h/week`,
      };

      // Send to backend
      const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectBody),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Project creation failed");
      }

      // ✅ Notify both Dashboard & Projects pages to refresh
      window.dispatchEvent(new Event("spaces-updated")); // dashboard & projects listen to this

      // ✅ Optional small delay for UX smoothness
      showToast("🚀 Added to Projects & Dashboard!");
      setTimeout(() => {
        navigate("/projects");
      }, 1000);
    } catch (err) {
      console.error("Add to Projects failed:", err);
      showToast("⚠️ Could not add project to backend");
    }
  }


  function deleteProject(title: string) {
    setProjects((prev) => prev.filter((p) => p.title !== title));
    showToast("🗑️ Deleted project");
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  /* ---------- UI ---------- */
  return (
    <div className="w-[min(1100px,95%)] mx-auto py-10 md:py-14 space-y-10 overflow-visible">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-['Orbitron'] tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
          Generate AI-Powered Projects
        </h1>
        <p className="text-white/75 font-['Rajdhani'] text-lg max-w-3xl">
          Pick a skill, difficulty, and your weekly time commitment to generate tailored project ideas.
        </p>
      </header>

      {/* Form */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-6 shadow-lg">
        <form
          onSubmit={handleGenerate}
          className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end"
        >
          {/* Skill */}
          <label className="grid gap-2">
            <span className="text-white/80 font-['Rajdhani']">Skill</span>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="rounded-xl bg-black/25 text-white border border-white/15 px-4 py-3"
            >
              {skills.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>

          {/* Difficulty */}
          <label className="grid gap-2">
            <span className="text-white/80 font-['Rajdhani']">Difficulty</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="rounded-xl bg-black/25 text-white border border-white/15 px-4 py-3"
            >
              <option>Novice</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
          </label>

          {/* Time Availability */}
          <label className="grid gap-2">
            <span className="text-white/80 font-['Rajdhani']">Time Availability</span>
            <select
              value={timeAvailability}
              onChange={(e) => setTimeAvailability(parseInt(e.target.value))}
              className="rounded-xl bg-black/25 text-white border border-white/15 px-4 py-3"
            >
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1 === 20 ? "20+ hours/week" : `${i + 1} hour${i + 1 > 1 ? "s" : ""}/week`}
                </option>
              ))}
            </select>
          </label>

          {/* Generate Button */}
          <div className="pt-6 md:pt-0">
            <button
              type="submit"
              disabled={loading}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-5 py-3 text-white font-['Orbitron'] uppercase tracking-wide disabled:opacity-50"
            >
              <span className="relative z-[1]">{loading ? "Generating..." : "Generate"}</span>
              <span
                aria-hidden
                className="absolute inset-0 rounded-xl opacity-90 [background:linear-gradient(45deg,rgba(157,45,252,0.28),rgba(2,150,255,0.28))]"
              />
              <span
                aria-hidden
                className="absolute inset-[2px] rounded-[10px] bg-[#101010]/85 border border-white/10"
              />
            </button>
          </div>
        </form>
      </section>

      {/* Generated Results */}
      {projects.length > 0 && (
        <section ref={trackRef} className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-['Rajdhani'] text-white/95">Generated Project</h2>
          {projects.map((p, i) => (
            <article
              key={i}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-md space-y-3"
            >
              <h3 className="text-xl text-white font-['Rajdhani']">{p.title}</h3>
              <p className="text-white/80 font-['Rajdhani'] whitespace-pre-wrap">{p.description}</p>
              {p.relevantSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {p.relevantSkills.map((s, j) => (
                    <span
                      key={j}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/90 text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => addToProjects(p)}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-4 py-2 text-white font-['Rajdhani']"
                >
                  <span className="relative z-[1]">Add to Projects</span>
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-xl opacity-90 [background:linear-gradient(45deg,rgba(157,45,252,0.28),rgba(2,150,255,0.28))]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-[2px] rounded-[10px] bg-[#101010]/85 border border-white/10"
                  />
                </button>
                <button
                  onClick={() => deleteProject(p.title)}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-4 py-2 text-white font-['Rajdhani']"
                >
                  <span className="relative z-[1]">Delete</span>
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-xl opacity-90 [background:linear-gradient(45deg,rgba(244,63,94,0.30),rgba(219,39,119,0.30))]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-[2px] rounded-[10px] bg-[#101010]/85 border border-white/10"
                  />
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Infinite Learning Resources Carousel */}
      <section className="relative overflow-hidden mt-8">
        <h2 className="text-2xl md:text-3xl font-['Rajdhani'] text-white/95 mb-3">
          Learning Resources
        </h2>

        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-[0ms]"
            style={{
              transform: `translateX(-${offset}px)`,
              width: `${RESOURCES.length * 2 * CARD_WIDTH}px`,
            }}
          >
            {[...RESOURCES, ...RESOURCES].map((r, idx) => (
              <a
                key={`${r.url}-${idx}`}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="relative w-[260px] shrink-0 mx-2 rounded-2xl overflow-hidden border border-white/10"
                style={{
                  backgroundImage: `url(${r.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/55" />
                <div className="relative z-10 p-4 text-white space-y-1 h-[160px] flex flex-col justify-end">
                  <h4 className="font-['Rajdhani'] text-lg">{r.title}</h4>
                  <p className="text-sm opacity-85">{r.blurb}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[220]">
          <div className="rounded-xl border border-white/10 bg-black/70 px-4 py-2 text-white font-['Rajdhani'] shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
