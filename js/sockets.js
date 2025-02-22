const socket = new WebSocket("ws://your-server-address:port");

socket.onopen = () => {
    console.log("WebSocket подключен");
    socket.send(JSON.stringify({ type: "subscribe", message: "Подключился к серверу" }));
};

socket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        console.log("Получены данные от сервера:", data);

        if (data.type === "update") {
            updateUI(data);
        }
    } catch (error) {
        console.error("Ошибка обработки данных WebSocket:", error);
    }
};

socket.onclose = () => {
    console.log("WebSocket отключен");
};

socket.onerror = (error) => {
    console.error("Ошибка WebSocket:", error);
};

// Функция обновления UI
function updateUI(data) {
    if (data.balance !== undefined) {
        document.getElementById("balance-value").innerText = `$${data.balance}`;
    }

    if (data.referrals) {
        document.getElementById("referral-list").innerHTML = data.referrals
            .map((ref) => `<div class="referral-item"><span>${ref.name}</span> <span>+${ref.bonus.toFixed(2)}</span></div>`)
            .join("");
    }
}
