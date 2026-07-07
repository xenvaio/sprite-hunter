export default function LobbyBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <img
        src="/sprite hunter background.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "brightness(0.4) saturate(0.85)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 40%, transparent 20%, rgba(10,14,26,0.7) 80%)",
        }}
      />
    </div>
  );
}
