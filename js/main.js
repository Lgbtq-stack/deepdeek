import {GetUserID, Initialize} from "./GetUserID.js";

export let tg = null;

document.addEventListener("DOMContentLoaded", () => {
    Telegram.WebApp.expand();
    tg = Telegram.WebApp;

    initializeData();
});

function initializeData() {
    Initialize();

    if (!GetUserID()) {
        showErrorPopup("error", "User ID is missing in the URL.");
        return false;
    }
}

window.setActiveTab = function(selectedTab) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    selectedTab.classList.add('active');

    document.querySelectorAll('.home-section, .wallet-section, .transaction-section, .history-section').forEach(section => {
        section.classList.add('hidden');
    });

    if (selectedTab.classList.contains('home')) {
        document.querySelector('.home-section').classList.remove('hidden');
    } else if (selectedTab.classList.contains('wallet')) {
        document.getElementById('wallet-content').classList.remove('hidden');
    } else if (selectedTab.classList.contains('transaction')) {
        document.getElementById('transaction-content').classList.remove('hidden');
    } else if (selectedTab.classList.contains('history')) {
        document.getElementById('history-content').classList.remove('hidden');
    }
}

