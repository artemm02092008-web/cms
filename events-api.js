document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("events-container");
  if (!container) return;

  // Функция загрузки событий
  function loadEvents() {
    container.innerHTML = "<p>Загрузка...</p>";

    fetch("http://localhost:1337/api/events?populate=*")
      .then((res) => res.json())
      .then((response) => {
        const events = response.data;

        if (!events || events.length === 0) {
          container.innerHTML = "<p>Событий пока нет.</p>";
          return;
        }

        container.innerHTML = "";

        events.forEach((item) => {
          const event = item.attributes ? item.attributes : item;

          const day = event.day || "01";
          const month = event.month || "Мес";
          const title = event.title || "Без названия";
          const description = event.description || "";
          const time = event.time || "";
          const platform = event.platform || "";

          const cardHTML = `
            <div class="event-card">
              <div class="event-date">
                <span class="event-day">${day}</span>
                <span class="event-month">${month}</span>
              </div>
              <div class="event-info">
                <h3>${title}</h3>
                <p class="event-desc">${description}</p>
                <div class="event-meta">
                  <span class="event-time">${time}</span>
                  <span class="event-platform">${platform}</span>
                </div>
              </div>
            </div>
          `;

          container.insertAdjacentHTML("beforeend", cardHTML);
        });
      })
      .catch((err) => {
        console.error("Ошибка загрузки событий:", err);
        container.innerHTML = "<p>Ошибка загрузки событий.</p>";
      });
  }

  // 1. Загружаем при первой загрузке страницы
  loadEvents();

  // 2. Вешаем обработчик на кнопку "Предстоящие"
  // Используем делегирование, чтобы поймать клик даже если кнопка пересоздается
  document.addEventListener("click", (e) => {
    // Проверяем, что кликнули именно на кнопку "Предстоящие"
    if (e.target.closest('.events-tab-btn[data-tab="upcoming"]')) {
      // Небольшая задержка, чтобы ваш events.js успел показать вкладку
      setTimeout(loadEvents, 150);
    }
  });
});
