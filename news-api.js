document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cybersport-container");
  if (!container) return; // Если контейнера нет, выходим

  // Запрос к Strapi за новостями. ВАЖНО: путь совпадает с Plural API ID в Strapi
  fetch("http://localhost:1337/api/cybersport-news-items?populate=*")
    .then((res) => res.json())
    .then((response) => {
      const news = response.data;

      if (!news || news.length === 0) {
        container.innerHTML = "<p>Новостей пока нет.</p>";
        return;
      }

      container.innerHTML = ""; // Очищаем контейнер

      news.forEach((item) => {
        // Поддержка Strapi v4/v5
        const article = item.attributes ? item.attributes : item;

        const time = article.time || "";
        const title = article.title || "Без названия";
        const description = article.description || "";

        // Теги приходят строкой (например, "Dota 2, Team Spirit")
        // Разбиваем по запятой и создаем HTML-теги
        const tagsArray = article.tags ? article.tags.split(",") : [];
        const tagsHTML = tagsArray
          .map((tag) => `<span class="news-tag">${tag.trim()}</span>`)
          .join("");

        // Формируем HTML карточки новости
        const cardHTML = `
          <div class="news-item">
            <div class="news-time">${time}</div>
            <div class="news-content">
              <h3>${title}</h3>
              <p>${description}</p>
              <div class="news-tags">
                ${tagsHTML}
              </div>
            </div>
          </div>
        `;

        container.insertAdjacentHTML("beforeend", cardHTML);
      });
    })
    .catch((err) => {
      console.error("Ошибка загрузки новостей:", err);
      container.innerHTML =
        "<p>Ошибка загрузки новостей. Проверьте Strapi.</p>";
    });
});
