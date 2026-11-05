document.addEventListener("DOMContentLoaded", () => {
  const gamesContainer = document.querySelector(".games-grid");

  if (gamesContainer) {
    fetch("http://localhost:1337/api/games?populate=*")
      .then((res) => res.json())
      .then((response) => {
        const games = response.data;

        games.forEach((game) => {
          // Картинка
          let imageUrl = "./img/placeholder.png";
          if (game.Cover && game.Cover.url) {
            imageUrl = `http://localhost:1337${game.Cover.url}`;
          }

          // Данные
          const gameTitle = game.Title || "Без названия";
          const gamePrice = game.Price || 0;
          const gameId = game.documentId; // Уникальный ID

          // Формируем карточку. В onclick сохраняем ID в localStorage
          const cardHTML = `
            <div class="game-card">
              <img src="${imageUrl}" alt="${gameTitle}">
              <h4>${gameTitle}</h4>
              <span class="price">${gamePrice} ₽</span>
              <a href="game.html" 
                 onclick="localStorage.setItem('selectedGameId', '${gameId}')" 
                 class="sellgame2" 
                 style="display: block; text-align: center; text-decoration: none; box-sizing: border-box;">
                 Купить
              </a>
            </div>
          `;

          gamesContainer.insertAdjacentHTML("beforeend", cardHTML);
        });
      })
      .catch((err) => console.error("Ошибка Strapi:", err));
  }
});
