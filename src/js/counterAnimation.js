const counters = document.querySelectorAll(".stat-card__number");
let animated = false;

function animateCounters() {
  if (animated) return;

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    const suffix = counter.getAttribute("data-suffix") || "";
    const speed = 200;

    const updateCount = () => {
      const current = +counter.innerText.replace(/[^\d]/g, "");
      const increment = Math.ceil(target / speed);

      if (current < target) {
        counter.innerText = (current + increment).toLocaleString() + suffix;
        setTimeout(updateCount, 10);
      } else {
        counter.innerText = target.toLocaleString() + suffix;
      }
    };

    updateCount();
  });

  animated = true;
}

const section = document.querySelector(".trust-stats");

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
    }
  },
  { threshold: 0.5 }
);

if (section) {
  observer.observe(section);
}
