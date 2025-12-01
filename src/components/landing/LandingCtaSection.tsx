"use client";

export default function LandingCtaSection() {
  const handleCtaClick = () => {
    // Scroll to hero-input section
    document.getElementById("hero-input")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Focus the park input after a short delay to allow scroll to complete
    setTimeout(() => {
      const input = document.getElementById("park-search") as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 500);
  };

  return (
    <section className="rounded-xl bg-surface-background p-6 md:p-8 text-center space-y-4">
      <h2 className="text-3xl md:text-4xl font-semibold text-text-primary">
        Ready to plan your national park trip?
      </h2>
      <button
        onClick={handleCtaClick}
        className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-base md:text-lg font-semibold text-white hover:bg-brand-hover transition"
      >
        Start Planning My Trip
      </button>
    </section>
  );
}
