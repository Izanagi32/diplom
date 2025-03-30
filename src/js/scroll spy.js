const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".links__link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("links__link--active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("links__link--active");
    }
  });
});
