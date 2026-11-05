document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("useful-links-container");
  if (!container) return;
  fetch("http://localhost:1337/api/useful-links?populate=*")
    .then((res) => res.json())
    .then((response) => {
      const links = response.data;
      if (!links || links.length === 0) return;
      container.innerHTML = "";
      links.forEach((item) => {
        const link = item.attributes ? item.attributes : item;
        const html = `<li><a href="${link.url}" class="useful-link">${link.text}</a></li>`;
        container.insertAdjacentHTML("beforeend", html);
      });
    });
});
