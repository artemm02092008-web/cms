document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("streams-container");
  if (!container) return;

  fetch("http://localhost:1337/api/streams?populate=*")
    .then((res) => res.json())
    .then((response) => {
      const streams = response.data;

      if (!streams || streams.length === 0) {
        container.innerHTML = "<p>Прямых эфиров пока нет.</p>";
        return;
      }

      container.innerHTML = "";

      streams.forEach((item) => {
        // Поддержка Strapi v4/v5
        const stream = item.attributes ? item.attributes : item;

        console.log("Данные стрима из Strapi:", stream); // Для отладки (посмотрите в консоль F12)

        const streamer = stream.streamer || "Неизвестный стример";
        const title = stream.title || "Без названия";
        const viewers = stream.viewers || "0 зрителей";
        const game = stream.game || "";
        const tags = stream.tags || "";

        // --- УНИВЕРСАЛЬНЫЙ ПОИСК КАРТИНОК ---
        // Функция проверяет все возможные структуры, которые может вернуть Strapi
        function getImageUrl(media) {
          if (!media) return null;
          // Если это просто объект с url (Strapi v5 flat)
          if (media.url) return `http://localhost:1337${media.url}`;
          // Если это вложенный объект data.attributes (Strapi v4)
          if (media.data && media.data.attributes && media.data.attributes.url)
            return `http://localhost:1337${media.data.attributes.url}`;
          // Если это массив (если выбрано multiple media)
          if (Array.isArray(media) && media.length > 0)
            return getImageUrl(media[0]);

          return null;
        }

        let previewUrl = getImageUrl(stream.preview) || "./img/placeholder.png";
        let avatarUrl =
          getImageUrl(stream.avatar) || "./img/default-avatar.png";

        // Теги
        const tagsArray = tags ? tags.split(",") : [];
        const tagsHTML = tagsArray
          .map(
            (tag) =>
              `<span class="stream-tag" style="background: #333; padding: 4px 10px; border-radius: 12px; font-size: 12px;">${tag.trim()}</span>`
          )
          .join("");

        // --- ФОРМИРУЕМ КАРТОЧКУ (С ИСПРАВЛЕННЫМИ СТИЛЯМИ) ---
        const cardHTML = `
          <div class="stream-card" style="background: #1a1a1a; border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
            <div class="stream-preview" style="position: relative; height: 200px; width: 100%;">
              <img src="${previewUrl}" alt="${streamer}" style="width: 100%; height: 100%; object-fit: cover;">
              <span class="live-badge" style="position: absolute; top: 10px; left: 10px; background: #ef4444; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">LIVE</span>
              <span class="stream-viewers" style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${viewers}</span>
            </div>
            <div class="stream-info" style="display: flex; gap: 15px; padding: 15px;">
              <div class="streamer-avatar" style="width: 50px; height: 50px; flex-shrink: 0;">
                <img src="${avatarUrl}" alt="${streamer}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid #8b5cf6;">
              </div>
              <div class="stream-details">
                <h4 style="margin: 0 0 5px 0; font-size: 16px;">${streamer}</h4>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #aaa;">${title}</p>
                <div class="stream-tags" style="display: flex; gap: 8px;">
                  <span class="stream-tag" style="background: #333; padding: 4px 10px; border-radius: 12px; font-size: 12px;">${game}</span>
                  ${tagsHTML}
                </div>
              </div>
            </div>
          </div>
        `;

        container.insertAdjacentHTML("beforeend", cardHTML);
      });
    })
    .catch((err) => {
      console.error("Ошибка загрузки стримов:", err);
      container.innerHTML = "<p>Ошибка загрузки стримов.</p>";
    });
});
