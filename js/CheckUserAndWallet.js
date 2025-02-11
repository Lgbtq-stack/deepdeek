import {debug, localUserData} from './GetUserID.js';
import {openWalletPopup_, showErrorPopup_} from "../Modular/Popups/PopupController.js";
import {addWalletsFromConfig, loadWalletData} from "./WalletController.js";

export function updateBalanceUI(balance) {
    const balanceElement = document.getElementById("balance-tokens");
    balanceElement.innerText = `Tokens: ${balance}`;
}

export async function checkUserAndWallets() {
    if (debug) {
        console.log("Debug mode: Loading wallets from local config.");
        addWalletsFromConfig(localUserData.wallets);
    } else {
        console.log("Fetching wallets from API...");
        await fetchWalletDataFromAPI();
    }

    if (!localUserData.wallets || localUserData.wallets.length === 0) {
        setActiveTab(document.querySelector('.nav-item.wallet'));
        openWalletPopup_("Add Wallet", "Enter wallet address", "Add Wallet");
        blockOtherTabs();
    }
}

function blockOtherTabs() {
    const navItems = document.querySelectorAll('.nav-item:not(.wallet)');
    navItems.forEach(item => {
        item.style.pointerEvents = 'none';
        item.style.opacity = '.25';
    });
}

function unblockOtherTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.style.pointerEvents = 'auto';
        item.style.opacity = '1';
    });
}

export function onWalletAdded() {
    unblockOtherTabs();
    showErrorPopup_("success", "Wallet added successfully. You can now use the site.");
}
