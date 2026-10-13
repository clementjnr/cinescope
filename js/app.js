
export function showPageError(message) {
  let status = document.querySelector(".status");

  if (!status) {
    status = document.createElement("p");
    status.className = "status";
    status.setAttribute("role", "alert");
    document.querySelector("main")?.prepend(status);
  }

  status.textContent = message;
}
