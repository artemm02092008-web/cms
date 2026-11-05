document.addEventListener("DOMContentLoaded", () => {
  const storeContent = document.querySelector(".store-content");
  const btnStore = document.getElementById("btn-store");
  const cloudPage = document.querySelector(".cloud-page");

  // 1. Функция для скрытия всего
  function hideAll() {
    if (storeContent) storeContent.style.display = "none";
    if (cloudPage) cloudPage.style.display = "none";

    const profilePage = document.querySelector(".profile-page");
    if (profilePage) profilePage.style.display = "none";
  }

  // 2. Показываем store
  if (btnStore) {
    btnStore.addEventListener("click", (e) => {
      e.preventDefault();
      hideAll();
      if (storeContent) {
        storeContent.style.display = "block";
      }
    });
  }

  // ВСЁ! Никакого кода для Strapi здесь больше быть не должно.
  // Он находится в файле strapi-games.js
});
