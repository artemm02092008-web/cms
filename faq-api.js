document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("faq-container");
  if (!container) return; // Если контейнера нет, выходим

  // Запрос к Strapi за вопросами
  fetch("http://localhost:1337/api/faqs?populate=*")
    .then((res) => res.json())
    .then((response) => {
      const faqs = response.data;

      if (!faqs || faqs.length === 0) {
        container.innerHTML = "<p>Вопросов пока нет.</p>";
        return;
      }

      container.innerHTML = ""; // Очищаем контейнер

      faqs.forEach((item) => {
        // Поддержка Strapi v4/v5
        const faq = item.attributes ? item.attributes : item;

        const question = faq.question || "Вопрос";
        const answer = faq.answer || "Ответ отсутствует";

        // Формируем HTML карточки (классы как у вас в CSS)
        const cardHTML = `
          <div class="faq-item">
            <div class="faq-question">${question}</div>
            <div class="faq-answer">${answer}</div>
          </div>
        `;

        container.insertAdjacentHTML("beforeend", cardHTML);
      });

      // --- ЛОГИКА ДЛЯ РАСКРЫТИЯ/СКРЫТИЯ ОТВЕТОВ (аккордеон) ---
      const faqItems = container.querySelectorAll(".faq-item");
      faqItems.forEach((item) => {
        const questionEl = item.querySelector(".faq-question");
        if (questionEl) {
          questionEl.addEventListener("click", () => {
            // Если вы хотите, чтобы открывался только один вопрос за раз:
            // faqItems.forEach(i => i.classList.remove("active"));

            item.classList.toggle("active");
          });
        }
      });
    })
    .catch((err) => {
      console.error("Ошибка загрузки FAQ:", err);
      container.innerHTML = "<p>Ошибка загрузки вопросов.</p>";
    });
});
