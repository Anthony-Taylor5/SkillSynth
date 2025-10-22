// src/pages/Contact.tsx
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook up to backend/email service
    setSent(true);
    setName("");
    setEmail("");
    setMsg("");
    setTimeout(() => setSent(false), 3500);
  };

  return (
    <div className="w-[min(1100px,95%)] mx-auto py-10 md:py-14 space-y-8 overflow-visible">
      {/* Title */}
      <header className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-['Orbitron'] tracking-[0.3em]
                       text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300
                       leading-tight">
          Contact Us
        </h1>
        <p className="text-white/75 font-['Rajdhani'] text-lg">
          Have a question, feedback, or a collaboration idea? We’re here to help.
        </p>
      </header>

      {/* Card */}
      <section className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 md:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-50"
          style={{
            background: "linear-gradient(120deg, rgba(157,45,252,0.18), rgba(2,150,255,0.18))",
            filter: "blur(18px)",
            zIndex: -1,
          }}
        />
        <div className="space-y-1 mb-5">
          <h2 className="text-2xl md:text-3xl font-['Rajdhani'] text-white/95">
            <span className="font-semibold">Send us a message</span>
          </h2>
          <p className="text-white/70 font-['Rajdhani']">
            We’d love to hear from you. Fill out the form below and we’ll get back to you as soon
            as possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* Name */}
          <label className="grid gap-2">
            <span className="text-white/80 font-['Rajdhani']">Name</span>
            <input
              type="text"
              required
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl bg-black/25 text-white placeholder-white/45
                         border border-white/15 focus:outline-none
                         focus:ring-2 focus:ring-cyan-300/70 focus:border-cyan-300/70
                         px-4 py-3 font-['Rajdhani'] tracking-wide"
            />
          </label>

          {/* Email */}
          <label className="grid gap-2">
            <span className="text-white/80 font-['Rajdhani']">Email</span>
            <input
              type="email"
              required
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl bg-black/25 text-white placeholder-white/45
                         border border-white/15 focus:outline-none
                         focus:ring-2 focus:ring-purple-300/70 focus:border-purple-300/70
                         px-4 py-3 font-['Rajdhani'] tracking-wide"
            />
          </label>

          {/* Message */}
          <label className="grid gap-2">
            <span className="text-white/80 font-['Rajdhani']">Message</span>
            <textarea
              rows={6}
              required
              placeholder="Your message..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="rounded-xl bg-black/25 text-white placeholder-white/45
                         border border-white/15 focus:outline-none
                         focus:ring-2 focus:ring-cyan-300/70 focus:border-cyan-300/70
                         px-4 py-3 font-['Rajdhani'] tracking-wide resize-vertical"
            />
          </label>

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-5 py-3
                         text-white font-['Orbitron'] uppercase tracking-wide"
            >
              <span className="relative z-[1]">Send Message</span>
              {/* neon sweep + glass inner */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-xl opacity-90
                           [background:linear-gradient(45deg,rgba(157,45,252,0.28),rgba(2,150,255,0.28))]"
              />
              <span
                aria-hidden
                className="absolute inset-[2px] rounded-[10px] bg-[#101010]/85 border border-white/10"
              />
              {/* Paper-plane glyph */}
              <svg
                className="relative z-[1] h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </form>
      </section>

      {/* Toast */}
      {sent && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[120]">
          <div className="rounded-xl border border-white/10 bg-black/70 backdrop-blur-md px-4 py-2 text-white font-['Rajdhani'] shadow-[0_10px_35px_rgba(0,0,0,0.45)]">
            Thanks — your message was sent.
          </div>
        </div>
      )}
    </div>
  );
}
