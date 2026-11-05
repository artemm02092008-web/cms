document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("contacts-container");
  if (!container) return;
  fetch("http://localhost:1337/api/contacts?populate=*")
    .then((res) => res.json())
    .then((response) => {
      const contacts = response.data;
      if (!contacts || contacts.length === 0) return;
      container.innerHTML = "";
      contacts.forEach((item) => {
        const contact = item.attributes ? item.attributes : item;
        const cardHTML = `
          <div class="contact-card">
            <div class="contact-icon">${contact.icon || "📧"}</div>
            <h3>${contact.title}</h3>
            <p>${contact.value}</p>
            <button class="contact-btn" onclick="${
              contact.link
                ? `window.location.href='${contact.link}'`
                : `openChat()`
            }">${contact.buttonText}</button>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", cardHTML);
      });
    });
});
