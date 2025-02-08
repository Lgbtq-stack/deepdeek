import {GetUserID, Initialize} from "./GetUserID.js";

let walletList = {
    "data": [
        {
            "wallet": "GAKVPYAOBX7JWG7E74YXHSKNIYXSIKJ5J3PHCDTMAIKKMYLVB5WIY4KO",
            "balance": -10,
            "active": true,
        },
        {
            "wallet": "GBQCR3L7H2QBCJNEI3CLBRCGQFSTGPEPRW3U2NPQRUJ66ZVQ7SECSUHQ",
            "balance": -10,
            "active": false,
        },
    ]
}

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

    document.querySelectorAll('.home-section, .wallet-section').forEach(section => {
        section.classList.add('hidden');
    });

    if (selectedTab.classList.contains('home')) {
        document.querySelector('.home-section').classList.remove('hidden');
    } else if (selectedTab.classList.contains('wallet')) {
        document.getElementById('wallet-content').classList.remove('hidden');
    }
}

