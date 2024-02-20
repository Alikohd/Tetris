document.addEventListener("DOMContentLoaded", function() {
    const usernameInput = document.getElementById("usernameInput");

    // чтение из локального хранилища
    const storedUsername = localStorage.getItem("tetris.username");

    if (storedUsername) {
        // если имя пользователя найдено в локальном хранилище ввод заполнен
        usernameInput.value = storedUsername;
    }

    // обработчик для сохранения имени
    const usernameForm = document.getElementById("usernameForm");
    usernameForm.addEventListener("submit", function (event) {
        event.preventDefault();
        store(); // сохраняем имя в локальном хранилище
        window.location.href = "index.html";
    });

    function store() {
        const username = usernameInput.value;
        localStorage.setItem("tetris.username", username);
    }
});

