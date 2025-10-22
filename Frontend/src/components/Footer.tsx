import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full px-6 py-4 text-sm text-white/80 backdrop-blur bg-black/20 border-t border-white/10 flex flex-col md:flex-row items-center justify-between z-50">
      {/* Left side: copyright */}
      <p className="mb-2 md:mb-0 text-center md:text-left tracking-wide">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold text-white">Skill Synth</span>. All rights reserved.
      </p>

      {/* Right side: contact + social links */}
      <div className="flex items-center gap-5">
        {/* Contact */}
        <Link
          to="/contact"
          className="transition hover:text-cyan-300 font-medium tracking-wide"
        >
          Contact
        </Link>

        {/* GitHub */}
        <a
          href="https://github.com/HMythical/SOSE-SkillSynth"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:scale-110 hover:text-white"
          aria-label="GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.44c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.1-.76.08-.75.08-.75 1.22.09 1.87 1.27 1.87 1.27 1.08 1.86 2.84 1.32 3.53 1.01.11-.78.42-1.32.77-1.63-2.67-.31-5.48-1.33-5.48-5.9 0-1.3.47-2.37 1.24-3.21-.12-.31-.54-1.56.12-3.25 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.69.24 2.94.12 3.25.77.84 1.24 1.91 1.24 3.21 0 4.59-2.81 5.58-5.49 5.89.43.37.81 1.1.81 2.23v3.3c0 .32.22.7.83.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>

        {/* Discord */}
        <a
          href="https://discord.gg/96Hv5vwTqY"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:scale-110 hover:text-[#5865F2]"
          aria-label="Discord"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M20 0a20 20 0 00-4.48.52 1.5 1.5 0 00-.69.35c-1.96-.43-4.07-.43-6.12 0a1.5 1.5 0 00-.69-.35A20 20 0 003.99 0C.89 4.7-.29 9.25.09 13.7c.63 7.18 7.48 10.03 11.91 10.3 4.43-.27 11.28-3.12 11.91-10.3.38-4.45-.8-9-3.9-13.7zM9.45 15.62c-1.02 0-1.85-.93-1.85-2.08s.83-2.08 1.85-2.08 1.85.93 1.85 2.08-.83 2.08-1.85 2.08zm5.1 0c-1.02 0-1.85-.93-1.85-2.08s.83-2.08 1.85-2.08 1.85.93 1.85 2.08-.83 2.08-1.85 2.08z" />
          </svg>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
