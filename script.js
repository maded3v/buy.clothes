function updateHeaderText() {
  const title = document.getElementById("title1");
  if (window.innerWidth < 1080) {
    title.textContent = "buy.clothes";
  } else {
    title.textContent = "made.dev / buy.clothes";
  }
}

window.addEventListener("load", updateHeaderText);
window.addEventListener("resize", updateHeaderText);

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll('.choose');
  const items = document.querySelectorAll('.item');

  // Фильтрация по категориям
  function setActiveCategory(category) {
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.id === category);
    });

    items.forEach(item => {
      item.style.display = (category === 'all' || item.classList.contains(category)) ? 'block' : 'none';
    });
  }

  // Назначение фильтров
  buttons.forEach(btn => {
    btn.addEventListener('click', () => setActiveCategory(btn.id));
  });

  setActiveCategory('all');

  // Поведение кнопки "+"
  document.querySelectorAll(".item").forEach(item => {
    const addButton = item.querySelector(".add-button");
    const nameEl = item.querySelector(".item-name");

    if (addButton && nameEl) {
      const originalName = nameEl.textContent;

      addButton.addEventListener("click", () => {
        nameEl.remove();
        addButton.remove();

        const sizeBox = document.createElement("div");
        sizeBox.classList.add("size-select-box");

        const labelWrapper = document.createElement("div");

        const label = document.createElement("span");
        label.textContent = "¿ what size";

        const close = document.createElement("span");
        close.classList.add("close-size");
        close.textContent = "X";

        labelWrapper.appendChild(label);
        labelWrapper.appendChild(close);
        sizeBox.appendChild(labelWrapper);

        const sizeRow = document.createElement("div");
        sizeRow.classList.add("size-buttons");

        ["S", "M", "L"].forEach(size => {
          const btn = document.createElement("div");
          btn.classList.add("size-btn");
          btn.textContent = size;

          btn.addEventListener("click", () => {
            alert(`Выбран размер: ${size}`);
            sizeBox.remove();
            restoreItem();
          });

          sizeRow.appendChild(btn);
        });

        sizeBox.appendChild(sizeRow);
        item.appendChild(sizeBox);

        // Функция восстановления исходного вида
        function restoreItem() {
          const newName = document.createElement("div");
          newName.classList.add("item-name");
          newName.textContent = originalName;

          const newAddBtn = document.createElement("div");
          newAddBtn.classList.add("add-button");
          newAddBtn.textContent = "+";

          // Повторное подключение обработчика
          newAddBtn.addEventListener("click", () => {
            newName.remove();
            newAddBtn.remove();
            item.appendChild(sizeBox);
          });

          item.appendChild(newName);
          item.appendChild(newAddBtn);
        }

        close.addEventListener("click", () => {
          sizeBox.remove();
          restoreItem();
        });
      });
    }
  });
});
