"use client";

import { motion } from "framer-motion";

const CODE_SNIPPETS = [
  "app.MapControllers();",
  "[HttpGet(\"api/projects\")]",
  "public async Task<IActionResult> Get()",
  "services.AddDbContext<AppDbContext>();",
  "const [data, setData] = useState<User[]>();",
  "SELECT * FROM Users WHERE IsActive = 1",
  "return Ok(new { Success = true, Data = res });",
  "builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme);",
  "public record UserDto(string Id, string Name, string Role);",
  "const { data } = useQuery(['projects'], fetchProjects);",
];

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-radial-warm">
      {/* Subtle Grid overlay */}
      <div className="absolute inset-0 bg-grid-tech opacity-60" />

      {/* Warm Ambient Glow Orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-gradient-to-b from-amber-500/12 via-amber-700/6 to-transparent rounded-full blur-[120px]" />
      <div className="absolute top-1/3 -left-32 w-[380px] h-[380px] bg-amber-900/15 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 -right-32 w-[420px] h-[420px] bg-amber-600/10 rounded-full blur-[120px]" />

      {/* Floating Code Snippets with Restrained Animation */}
      <div className="hidden lg:block absolute inset-0 select-none font-mono text-[11px] text-amber-500/15">
        {CODE_SNIPPETS.map((snippet, idx) => {
          const positions = [
            { top: "18%", left: "6%" },
            { top: "28%", right: "8%" },
            { top: "45%", left: "4%" },
            { top: "62%", right: "6%" },
            { top: "75%", left: "10%" },
            { top: "82%", right: "12%" },
            { top: "20%", left: "42%" },
            { top: "70%", left: "48%" },
            { top: "38%", right: "22%" },
            { top: "54%", left: "20%" },
          ];
          const pos = positions[idx % positions.length];

          return (
            <motion.div
              key={idx}
              className="absolute px-3 py-1.5 rounded-lg border border-amber-500/[0.08] bg-[#120e0b]/40 backdrop-blur-[2px]"
              style={{ ...pos }}
              initial={{ opacity: 0.1, y: 0 }}
              animate={{
                opacity: [0.15, 0.35, 0.15],
                y: [0, -12, 0],
              }}
              transition={{
                duration: 6 + idx * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.4,
              }}
            >
              <span className="text-amber-400/30 font-semibold mr-1.5">$</span>
              <span>{snippet}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom vignette overlay to seamlessly blend into subsequent sections */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0807] to-transparent" />
    </div>
  );
}
