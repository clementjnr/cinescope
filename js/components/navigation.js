
export function initNavigation() {
  const currentPath = window.location.pathname;

  document.querySelectorAll(".site-nav a").forEach((link) => {
    const linkPath = new URL(link.href).pathname;

    if (linkPath === currentPath) {
      link.setAttribute("aria-current", "page");
    }
  });
}
