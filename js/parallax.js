// Modern parallax and animation effects
document.addEventListener("DOMContentLoaded", function () {
  // Parallax effect for hero background
  const parallaxBg = document.querySelector(".parallax-bg");
  const neuralGrid = document.querySelector(".neural-grid");
  const floatingParticles = document.querySelector(".floating-particles");

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Optimized parallax scroll effect with throttling
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.2; // Reduced parallax intensity

        if (parallaxBg) {
          parallaxBg.style.transform = `translateY(${rate}px)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  });

  // Optimized particles for better performance
  function createParticles() {
    if (!floatingParticles) return;

    // Reduce particle count for better performance
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 15 + "s";
      particle.style.animationDuration = Math.random() * 15 + 20 + "s";
      floatingParticles.appendChild(particle);
    }
  }

  // AI nodes animation
  function animateNodes() {
    const nodes = document.querySelectorAll(".node");
    const connections = document.querySelectorAll(".connection");

    nodes.forEach((node, index) => {
      node.style.animationDelay = index * 0.5 + "s";
    });

    connections.forEach((connection, index) => {
      connection.style.animationDelay = index * 0.3 + 1 + "s";
    });
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document
    .querySelectorAll(".pillar-card, .quote-modern, .section-header")
    .forEach((el) => {
      observer.observe(el);
    });

  // Initialize effects
  createParticles();
  animateNodes();

  // Optimized mouse movement parallax effect with throttling
  let mouseTicking = false;
  document.addEventListener("mousemove", (e) => {
    if (!mouseTicking) {
      requestAnimationFrame(() => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        const aiNodes = document.querySelector(".ai-nodes");
        if (aiNodes) {
          const moveX = (mouseX - 0.5) * 10; // Reduced movement intensity
          const moveY = (mouseY - 0.5) * 10;
          aiNodes.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }

        mouseTicking = false;
      });
      mouseTicking = true;
    }
  });
});
