document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("forums-container");
  if (!container) return; // Если контейнера нет, выходим

  // Запрос к Strapi. Убедитесь, что коллекция называется ForumCategory
  fetch("http://localhost:1337/api/forum-categories?populate=*")
    .then((res) => res.json())
    .then((response) => {
      const categories = response.data;

      if (!categories || categories.length === 0) {
        container.innerHTML = "<p>Категории форумов пока не добавлены.</p>";
        return;
      }

      container.innerHTML = ""; // Очищаем контейнер

      categories.forEach((item) => {
        // В Strapi v5 данные могут быть сразу в item, либо в item.attributes (v4)
        const cat = item.attributes ? item.attributes : item;

        // Берем данные (имена полей должны совпадать с тем, как вы их назвали в Strapi)
        const title = cat.title || "Без названия";
        const desc = cat.description || "";
        const topics = cat.topicsCount || "0 тем";
        const messages = cat.messagesCount || "0 сообщений";
        const lastTopic = cat.lastTopic || "";
        const lastTime = cat.lastTime || "";
        const icon = cat.icon || "💬";

        // Формируем HTML карточки (классы как в вашем CSS)
        const cardHTML = `
          <div class="category-card">
            <div class="category-icon">${icon}</div>
            <div class="category-info">
              <h3>${title}</h3>
              <p>${desc}</p>
              <div class="category-stats">
                <span>${topics}</span>
                <span>💬 ${messages}</span>
              </div>
            </div>
            <div class="category-last">
              <span class="last-topic">Последняя тема: ${lastTopic}</span>
              <span class="last-time">${lastTime}</span>
            </div>
          </div>
        `;

        container.insertAdjacentHTML("beforeend", cardHTML);
      });
    })
    .catch((err) => {
      console.error("Ошибка загрузки форумов:", err);
      container.innerHTML = "<p>Ошибка загрузки форумов. Проверьте Strapi.</p>";
    });
});
