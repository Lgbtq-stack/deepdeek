document.addEventListener("DOMContentLoaded", function () {
    const panel = document.querySelector(".side-panel");
    const toggleButton = document.getElementById("toggle-panel");
    const arrow = toggleButton.querySelector(".arrow");

    toggleButton.addEventListener("click", () => {
        const isOpen = panel.classList.contains("open");

        if (isOpen) {
            panel.classList.remove("open");

            // ⏳ После анимации скрываем
            setTimeout(() => {
                panel.classList.remove("active");
                panel.classList.add("closed");
            }, 400);
        } else {
            panel.classList.add("active");
            panel.classList.remove("closed");

            setTimeout(() => {
                panel.classList.add("open");
            }, 10);
        }

        arrow.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
    });
});

export function updateReferralPanel(data) {
    document.getElementById("ref-level").textContent = data.level;
    document.getElementById("ref-count").textContent = data.count;
    document.getElementById("ref-next-total").textContent = data.count_to_next_total;
    document.getElementById("bonus-percent").textContent = data.percent;
    document.getElementById("bonus-next-percent").textContent = data.percent_next;
}