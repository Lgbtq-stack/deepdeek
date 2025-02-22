import {GetUserID, Initialize} from "./GetUserID.js";
import {renderHistory} from "./HistorySection.js";
import {loadWalletData} from "./WalletController.js";
import {loadReferrals} from "./Referrals.js";

export let tg = null;

document.addEventListener("DOMContentLoaded", () => {
    Telegram.WebApp.expand();
    tg = Telegram.WebApp;

    setupSwipeToRefresh();
    initializeData();
});

function setupSwipeToRefresh() {
    let startY = 0;
    let isSwiping = false;

    document.addEventListener("touchstart", (e) => {
        startY = e.touches[0].clientY;
        isSwiping = true;
    });

    document.addEventListener("touchmove", (e) => {
        if (!isSwiping) return;
        let moveY = e.touches[0].clientY;
        let diff = moveY - startY;

        if (diff > 100) {
            isSwiping = false;
            Telegram.WebApp.expand();
            window.location.reload();
        }
    });

    document.addEventListener("touchend", () => {
        isSwiping = false;
    });
}

function initializeData() {
    Initialize();

    if (!GetUserID()) {
        showErrorPopup("error", "User ID is missing in the URL.");
        return false;
    }
}

let currentTab = '';

window.setActiveTab = async function (selectedTab) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    selectedTab.classList.add('active');

    let newTab = selectedTab.classList.contains('home') ? 'home' :
        selectedTab.classList.contains('wallet') ? 'wallet' :
            selectedTab.classList.contains('transaction') ? 'transaction' :
                selectedTab.classList.contains('referrals') ? 'referrals' :
                    selectedTab.classList.contains('history') ? 'history' : null;

    if (newTab === currentTab) return;

    currentTab = newTab;

    document.querySelectorAll('.home-section, .wallet-section, .transaction-section, .history-section, .referrals-section')
        .forEach(section => {
            section.classList.add('hidden');
            section.style.display = "none";
        });

    if (currentTab !== 'referrals') {
        document.getElementById('referral-list').innerHTML = "";
    }

    let activeSection = document.getElementById(`${currentTab}-content`);
    if (activeSection) {
        activeSection.classList.remove('hidden');
        activeSection.style.display = "block";
    }

    if(currentTab !== 'referrals') {
        document.body.classList.remove('referrals-active');
    }

    if (currentTab === 'wallet') {
        await loadWalletData();
    } else if (currentTab === 'transaction') {
        // Логика для транзакций
    } else if (currentTab === 'referrals') {
        document.getElementById('referrals-content').classList.remove('hidden');
        document.body.classList.add('referrals-active');
        await loadReferrals();
    } else if (currentTab === 'history') {
        await renderHistory();
    }
};