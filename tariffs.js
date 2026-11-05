document.addEventListener("DOMContentLoaded", () => {
  // Запрос к Strapi за тарифами (убедитесь, что коллекция называется Tariff)
  fetch("http://localhost:1337/api/tariffs?populate=*")
    .then((res) => res.json())
    .then((response) => {
      const tariffs = response.data;

      if (!tariffs || tariffs.length === 0) {
        console.warn("В Strapi нет тарифов.");
        return;
      }

      tariffs.forEach((tariff) => {
        // В Strapi v5 данные могут быть сразу в tariff, либо в tariff.attributes (v4)
        const data = tariff.attributes ? tariff.attributes : tariff;

        const title = data.Title || "";
        const price = data.Price || "";
        const features = data.Features || "";

        // Определяем, к какому блоку привязать (по названию)
        let idSuffix = "";
        if (title.toLowerCase().includes("лайт")) idSuffix = "lite";
        else if (title.toLowerCase().includes("комфорт")) idSuffix = "comfort";
        else if (title.toLowerCase().includes("премиум")) idSuffix = "premium";

        if (idSuffix) {
          // 1. Меняем заголовок
          const titleEl = document.getElementById(`title-${idSuffix}`);
          if (titleEl) titleEl.innerText = title;

          // 2. Меняем цену
          const priceEl = document.getElementById(`price-${idSuffix}`);
          if (priceEl) priceEl.innerText = price;

          // 3. Меняем список функций
          const featuresEl = document.getElementById(`features-${idSuffix}`);
          if (featuresEl && features) {
            // Разбиваем текст по переносам строки
            const listItems = features
              .split("\n")
              .filter((item) => item.trim() !== "");
            featuresEl.innerHTML = ""; // Очищаем старый список

            listItems.forEach((item) => {
              const li = document.createElement("li");
              li.innerText = item;
              featuresEl.appendChild(li);
            });
          }
        }
      });
    })
    .catch((err) => console.error("Ошибка загрузки тарифов:", err));
});
