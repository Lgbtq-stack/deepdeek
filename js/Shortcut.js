document.addEventListener("DOMContentLoaded", function () {
    const panelButton = document.getElementById("toggle-panel");
    const infoPanel = document.getElementById("info-panel");
    const arrow = panelButton.querySelector(".arrow");

    panelButton.addEventListener("click", function () {
        const isVisible = infoPanel.classList.contains("visible");

        if (!isVisible) {
            infoPanel.classList.add("visible");

            setTimeout(() => {
                infoPanel.classList.add("active");
            }, 50);

            arrow.textContent = "➡";
            panelButton.classList.remove("bouncing");
        } else {
            infoPanel.classList.remove("active");

            setTimeout(() => {
                infoPanel.classList.remove("visible");
            }, 400);

            arrow.textContent = "⬅";
            panelButton.classList.add("bouncing");
        }
    });

    panelButton.classList.add("bouncing");
});
