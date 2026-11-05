document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("popular-topics-container");
  if (!container) return; // Если контейнера нет, выходим

  // Запрос к Strapi за популярными темами
  fetch("http://localhost:1337/api/popular-topics?populate=*")
    .then((res) => res.json())
    .then((response) => {
      const topics = response.data;

      if (!topics || topics.length === 0) {
        container.innerHTML = "<p>Популярных тем пока нет.</p>";
        return;
      }

      container.innerHTML = ""; // Очищаем контейнер

      topics.forEach((item) => {
        // Поддержка формата Strapi v5 и v4
        const topic = item.attributes ? item.attributes : item;

        // Берем данные (имена полей должны совпадать с тем, как вы их назвали в Strapi)
        const title = topic.title || "Без названия";
        const author = topic.author || "Неизвестный автор";
        const replies = topic.replies || 0;
        const views = topic.views || "0 просмотров";
        const lastReply = topic.lastReply || "";

        // Формируем HTML карточки (классы как в вашем CSS)
        const cardHTML = `
          <div class="topic-item">
            <div class="topic-icon">📌</div>
            <div class="topic-info">
              <a href="#" class="topic-title">${title}</a>
              <div class="topic-meta">
                <span>автор: ${author}</span>
                <span>💬 ${replies} ответов</span>
                <span>${views}</span>
              </div>
            </div>
            <div class="topic-last">
              <span class="last-reply">Последний ответ: ${lastReply}</span>
            </div>
          </div>
        `;

        container.insertAdjacentHTML("beforeend", cardHTML);
      });
    })
    .catch((err) => {
      console.error("Ошибка загрузки популярных тем:", err);
      container.innerHTML = "<p>Ошибка загрузки тем. Проверьте Strapi.</p>";
    });
});
