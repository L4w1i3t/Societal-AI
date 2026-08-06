document.addEventListener("DOMContentLoaded", function () {

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Parallax: background moves at ~40% of scroll speed, text at 100%
  // Result: text scrolls faster than the photo behind it
  const heroBgs = document.querySelectorAll(".hero-bg");
  if (!heroBgs.length) return;

  let ticking = false;

  function updateParallax() {
    heroBgs.forEach((bg) => {
      const section = bg.parentElement;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      // progress: 0 when section top is at viewport bottom, 1 when section bottom is at viewport top
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const offset = (progress - 0.5) * rect.height * 1.1;
      bg.style.transform = `translateY(${offset}px)`;
    });
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  // Run once on load to set initial positions
  updateParallax();
});
