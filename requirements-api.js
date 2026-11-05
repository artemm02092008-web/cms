document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("requirements-container");
  if (!container) return;
  fetch("http://localhost:1337/api/requirements?populate=*")
    .then((res) => res.json())
    .then((response) => {
      const reqs = response.data;
      if (!reqs || reqs.length === 0) return;
      container.innerHTML = "";
      reqs.forEach((item) => {
        const req = item.attributes ? item.attributes : item;
        const html = `
          <div class="req-item">
            <span class="req-label">${req.label}</span>
            <span class="req-value">${req.value}</span>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", html);
      });
    });
});
