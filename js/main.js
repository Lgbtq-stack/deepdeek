import {GetUserID, Initialize} from "./GetUserID.js";
import {renderHistory} from "./HistorySection.js";
import {loadWalletData} from "./WalletController.js";

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

let currentTab = '';

window.setActiveTab = function(selectedTab) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    selectedTab.classList.add('active');

    let newTab = selectedTab.classList.contains('home') ? 'home' :
        selectedTab.classList.contains('wallet') ? 'wallet' :
            selectedTab.classList.contains('transaction') ? 'transaction' :
                'history';

    if (newTab === currentTab) {
        return;
    }

    currentTab = newTab;

    document.querySelectorAll('.home-section, .wallet-section, .transaction-section, .history-section').forEach(section => {
        section.classList.add('hidden');
    });

    if (currentTab === 'home') {
        document.querySelector('.home-section').classList.remove('hidden');
    } else if (currentTab === 'wallet') {
        document.getElementById('wallet-content').classList.remove('hidden');

        loadWalletData();
    }
        // else if (currentTab === 'transaction') {
    //     document.getElementById('transaction-content').classList.remove('hidden');
    // } else if (currentTab === 'history') {
    //     document.getElementById('history-content').classList.remove('hidden');
    //
    //     renderHistory();
    // }
}