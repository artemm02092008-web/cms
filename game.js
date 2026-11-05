document.addEventListener("DOMContentLoaded", () => {
  console.log("Скрипт game.js загружен!");

  // 1. Пытаемся взять ID из localStorage (сохранен при клике на карточку)
  let gameId = localStorage.getItem("selectedGameId");

  // 2. Если в localStorage пусто, пробуем взять из ссылки (на всякий случай)
  if (!gameId) {
    const urlParams = new URLSearchParams(window.location.search);
    gameId = urlParams.get("id");
  }

  // 3. Если ID так и нет — показываем ошибку
  if (!gameId) {
    document.getElementById("game-title").innerText = "Ошибка: Игра не выбрана";
    document.getElementById("game-description").innerText =
      "Вернитесь в магазин и нажмите на игру.";
    return;
  }

  console.log("Загружаю игру с ID:", gameId);

  // 4. Очищаем старые данные
  document.getElementById("game-title").innerText = "Загрузка...";
  document.getElementById("game-description").innerText = "";
  document.getElementById("game-price").innerText = "";
  document.getElementById("game-image").src = "./img/placeholder.png";
  document.getElementById("game-developer").innerText = "";
  document.getElementById("game-year").innerText = "";
  document.getElementById("game-genre").innerText = "";
  document.getElementById("game-platform").innerText = "";

  // 5. Загружаем данные из Strapi
  fetch(`http://localhost:1337/api/games/${gameId}?populate=*`)
    .then((res) => {
      if (!res.ok) throw new Error("Strapi вернул ошибку " + res.status);
      return res.json();
    })
    .then((response) => {
      const game = response.data;
      if (!game) {
        document.getElementById("game-title").innerText = "Игра не найдена";
        return;
      }

      // Картинка
      let imageUrl = "./img/placeholder.png";
      if (game.Cover && game.Cover.url) {
        imageUrl = `http://localhost:1337${game.Cover.url}`;
      }
      document.getElementById("game-image").src = imageUrl;

      // Название и цена
      document.getElementById("game-title").innerText =
        game.Title || "Без названия";
      document.getElementById("game-price").innerText = `${game.Price || 0} ₽`;

      // Описание
      const descEl = document.getElementById("game-description");
      const descContainer = document.getElementById("desc-container");
      const toggleBtn = document.getElementById("toggle-desc-btn");

      descEl.innerText = game.Description || "Описание отсутствует";

      if (descEl.innerText.length > 150) {
        toggleBtn.style.display = "block";
        const newToggleBtn = toggleBtn.cloneNode(true);
        toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
        newToggleBtn.innerText = "▼ Показать полностью";

        newToggleBtn.addEventListener("click", () => {
          descContainer.classList.toggle("expanded");
          descEl.classList.toggle("expanded");
          newToggleBtn.innerText = descEl.classList.contains("expanded")
            ? "▲ Скрыть"
            : "▼ Показать полностью";
        });
      } else {
        toggleBtn.style.display = "none";
      }

      // Теги
      if (game.developer)
        document.getElementById("game-developer").innerText = game.developer;
      if (game.game_year)
        document.getElementById("game-year").innerText = game.game_year;
      if (game.Genre)
        document.getElementById("game-genre").innerText = game.Genre;
      if (game.Platform)
        document.getElementById("game-platform").innerText = game.Platform;
    })
    .catch((err) => {
      console.error("ОШИБКА:", err);
      document.getElementById("game-title").innerText =
        "Ошибка загрузки. Смотрите консоль.";
    });
});

// --- МОДАЛЬНОЕ ОКНО ---
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("buy-btn")) {
    const balanceModal = document.getElementById("balanceModal");
    if (balanceModal) balanceModal.classList.add("active");
  }
  if (e.target.classList.contains("balance-close-btn")) {
    const balanceModal = document.getElementById("balanceModal");
    if (balanceModal) balanceModal.classList.remove("active");
  }
  if (e.target.id === "balanceModal") {
    e.target.classList.remove("active");
  }
});
