export function renderProfileContent(container: HTMLElement, email: string): void {
  const p = document.createElement("p");
  p.textContent = "Logged in as ";
  const strong = document.createElement("strong");
  strong.textContent = email;
  p.appendChild(strong);

  const button = document.createElement("button");
  button.id = "sign-out-btn";
  button.textContent = "Sign out";

  container.replaceChildren(p, button);
}
