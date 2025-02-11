import {showErrorPopup_} from "../Modular/Popups/PopupController.js";
import {tg} from "./main.js";

import {
    activeWallet, debug,
    userData,
    user_Id, SetUserData
} from "./GetUserID.js";

import {checkWalletExists, onWalletAdded} from "./CheckUserAndWallet.js";
import {checkTrustline} from "./CheckTrustline.js";

export let selectedWalletAddress = "";
let isProcessing = false;
const walletAddressInput = document.getElementById("wallet-input");

export async function loadWalletData() {
    if (!debug) {
        console.log("Debug mode is ON: Loading wallets from userData config.");
        addWalletsFromConfig(userData.wallets);
        console.log(userData);
    } else {
        console.log("Debug mode is OFF: Fetching wallets from API...");
        await fetchWalletDataFromAPI();
    }
}

export async function fetchWalletDataFromAPI() {
    try {
        const response = await fetch(`https://miniappservbb.com/api/user?uid=${user_Id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch wallet data from API.');
        }

        const apiResponse = await response.json();

        console.log(apiResponse);

        SetUserData(apiResponse);

        if (apiResponse && apiResponse.wallets) {
            addWalletsFromConfig(apiResponse.wallets);
        } else {
            showErrorPopup_("error", "Invalid API response.");
            console.error("API response did not contain wallets.");
        }
    } catch (error) {
        showErrorPopup_("error", "Failed to fetch wallets.");
        console.error("Error fetching wallets:", error);
    }
}

export function addWalletsFromConfig(walletData) {
    const walletListContainer = document.querySelector('.wallet-list');
    walletListContainer.innerHTML = '';

    walletData.forEach(wallet => {
        const walletItemContainer = document.createElement('div');
        walletItemContainer.className = 'wallet-item-container';

        const activeClass = wallet.is_active ? 'active-wallet' : '';

        walletItemContainer.innerHTML = `
            <div class="wallet-item ${activeClass}" data-wallet-id="${wallet.id}" onclick="selectWallet(this)">
                <span class="active-indicator"></span>
                <div class="wallet-info">
                    <span class="wallet-address">${wallet.address}</span>
                </div>
            </div>
            <button class="delete-wallet-btn" onclick="deleteWallet(this)">
                <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ff4d4d">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M16 9v10H8V9h8m-1.5-6h-5L9 4H4v2h16V4h-5.5zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
                </svg>
            </button>
        `;
        walletListContainer.appendChild(walletItemContainer);
    });
}

export async function walletValidator(wallet) {
    if (isProcessing) {
        return { isValid: false, message: "Please wait before trying again." };
    }

    let walletAddress = walletAddressInput.value.trim();
    isProcessing = true;

    if (!wallet) {
        isProcessing = false;
        return { isValid: false, message: "Wallet address cannot be empty." };
    }

    if (!wallet.startsWith("G")) {
        isProcessing = false;
        return { isValid: false, message: "Wallet address must start with the letter 'G'." };
    }

    if (wallet.length !== 56) {
        isProcessing = false;
        return { isValid: false, message: "Wallet address must be exactly 56 characters long." };
    }

    if (!wallet.match(/^[A-Z0-9]+$/)) {
        isProcessing = false;
        return { isValid: false, message: "Wallet address must contain only uppercase letters and digits." };
    }

    const walletCheck = await checkWalletExists(user_Id, walletAddress);
    if (walletCheck.exists) {
        isProcessing = false;
        return { isValid: false, message: "Wallet already exists for this user." };
    }

    try {
        const response = await fetch(`https://horizon.stellar.org/accounts/${walletAddress}`);

        if (!response.ok) {
            isProcessing = false;
            return { isValid: false, message: "Wallet address not found on the Stellar network." };
        }

        const walletData = await response.json();

        if (!walletData.paging_token || walletData.paging_token !== walletAddress) {
            isProcessing = false;
            return { isValid: false, message: "This wallet doesn't exist in blockchain." };
        }

        // const hasTrustline = await checkTrustline(walletAddress);
        // if (!hasTrustline) {
        //     isProcessing = false;
        //     return { isValid: false, message: "No trustline assigned to the NFT asset." };
        // }

    } catch (error) {
        console.error("Error fetching wallet data:", error);
        isProcessing = false;
        return { isValid: false, message: "Failed to validate wallet address. Please try again." };
    }

    isProcessing = false;
    return { isValid: true };
}

export async function addWallet_() {
    const walletAddress = document.getElementById('wallet-input').value.trim();

    const validation = await walletValidator(walletAddress);

    if (!validation.isValid) {
        showErrorPopup_("warning", validation.message);
        return;
    }

    try {
        const url = `https://www.miniappservbb.com/api/wallet/add?uid=${user_Id}&address=${walletAddress}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        if (!result || !result.id) {
            throw new Error("Invalid server response: Missing wallet ID.");
        }

        console.log("Wallet successfully added on server:", result);

        const walletId = result.id;

        const walletItemContainer = document.createElement('div');
        walletItemContainer.className = 'wallet-item-container';

        walletItemContainer.innerHTML = `
            <div class="wallet-item" data-wallet-id="${walletId}" onclick="selectWallet_(this)">
                <span class="active-indicator"></span>
                <div class="wallet-info">
                    <span class="wallet-address">${walletAddress}</span>
                </div>
            </div>
            <button class="delete-wallet-btn" onclick="deleteWallet_(this)">
                <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ff4d4d">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M16 9v10H8V9h8m-1.5-6h-5L9 4H4v2h16V4h-5.5zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
                </svg>
            </button>
        `;

        document.querySelector('.wallet-list').appendChild(walletItemContainer);

        document.getElementById('wallet-popup').style.display = 'none';
        document.getElementById('wallet-input').value = '';

        checkAndSetActiveWallet();

        console.log("Added wallet address sent:", walletAddress);
        onWalletAdded();

    } catch (error) {
        console.error("Error adding wallet to server:", error);
        showErrorPopup_("error", "Failed to add wallet. Please try again.");
    }
}

let activeWalletLocal = "";
export function selectWallet_(walletItem) {
    document.querySelectorAll('.wallet-item').forEach(item => {
        item.classList.remove('active-wallet');
    });

    walletItem.classList.add('active-wallet');

    const selectedWalletAddress = walletItem.querySelector('.wallet-address').innerText.trim();

    const wallet = userData.wallets.find(w => w.address === selectedWalletAddress);
    const walletId = wallet ? wallet.id : null;

    if (!walletId) {
        console.error("Wallet ID not found for address:", selectedWalletAddress);
        showErrorPopup_("error", "Failed to select wallet. Try again.");
        return;
    }

    activeWalletLocal = selectedWalletAddress;

    console.log("Selected wallet id and address sent:", walletId, selectedWalletAddress);
}

export async function deleteWallet_(deleteButton) {
    const walletContainer = deleteButton.closest('.wallet-item-container');
    const walletAddress = walletContainer.querySelector('.wallet-address').innerText.trim();

    const wallet = userData.wallets.find(w => w.address === walletAddress);
    const walletId = wallet ? wallet.id : null;

    if (!walletId) {
        console.error("Wallet ID not found for address:", walletAddress);
        showErrorPopup_("error", "Failed to remove wallet. Try again.");
        return;
    }

    try {
        const url = `https://www.miniappservbb.com/api/wallet/remove?uid=${user_Id}&address_id=${walletId}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log("Wallet successfully removed from server:", result);

        walletContainer.remove();

        console.log("Deleted wallet id and address sent:", walletId, walletAddress);

    } catch (error) {
        console.error("Error removing wallet from server:", error);
        showErrorPopup_("error", "Failed to remove wallet. Please try again.");
    }
}


export function checkAndSetActiveWallet() {
    const walletItems = document.querySelectorAll('.wallet-item');

    if (walletItems.length === 1) {
        const singleWallet = walletItems[0];
        selectWallet_(singleWallet);
    }
}