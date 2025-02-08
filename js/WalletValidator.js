import {checkTrustline} from "./CheckTrustline";
import {showErrorPopup_} from "../Modular/Popups/PopupController.js";
import {tg} from "./main.js";

let isProcessing = false;
const walletAddressInput = document.getElementById("wallet-input");

export async function walletValidator(wallet) {
    if (isProcessing) {
        showErrorPopup_("warning", "Please wait before trying again.");
        return;
    }

    let walletAddress = walletAddressInput.value.trim();

    isProcessing = true;

    if (!wallet) {
        showErrorPopup_("error", "Wallet address cannot be empty.");
        isProcessing = false;
        return;
    }

    if (!wallet.startsWith("G")) {
        showErrorPopup_("error", "Wallet address must start with the letter 'G'.");
        isProcessing = false;
        return;
    }

    if (wallet.length !== 56) {
        showErrorPopup_("error", "Wallet address must be exactly 56 characters long.");
        isProcessing = false;
        return;
    }

    if (!wallet.match(/^[A-Z0-9]+$/)) {
        showErrorPopup_("error", "Wallet address must contain only uppercase letters and digits.");
        isProcessing = false;
        return;
    }

    // if (isNaN(amount) || amount <= 0) {
    //     showErrorPopup_("error", "Please enter a valid amount.");
    //     isProcessing = false;
    //     return;
    // }

    // if (amount > userDataCache.data.balance) {
    //     showErrorPopup("error", "Entered amount exceeds your balance.");
    //     isProcessing = false;
    //     return;
    // }

    try {
        const response = await fetch(`https://horizon.stellar.org/accounts/${walletAddress}`);

        if (!response.ok) {
            showErrorPopup("error", "Wallet address not found on the Stellar network.");
            isProcessing = false;
            return;
        }

        const walletData = await response.json();

        if (!walletData.paging_token || walletData.paging_token !== walletAddress) {
            showErrorPopup("error", "This wallet doesn't exist in blockchain.");
            isProcessing = false;
            return;
        }

        const hasTrustline = await checkTrustline(walletAddress);
        if (!hasTrustline) {
            showErrorPopup("error", "No trustline exists for the NFT asset.");

            isProcessing = false;
            return;
        }

    } catch (error) {
        console.error("Error fetching wallet data:", error);
        showErrorPopup("error", "Failed to validate wallet address. Please try again.");

        isProcessing = false;
        return;
    }

    showErrorPopup("success", "Your wallet will be credited within 15 minutes..")
    walletAddressInput.value = "";

    setTimeout(() => {
        isProcessing = false;
    }, 5000);
}

export function addWallet() {
    const walletAddress = document.getElementById('wallet-input').value.trim();

    if (!walletValidator(walletAddress)) {
        showErrorPopup("warning", "Please enter a valid wallet address.");
        return;
    }

    const walletItemContainer = document.createElement('div');
    walletItemContainer.className = 'wallet-item-container';

    walletItemContainer.innerHTML = `
        <div class="wallet-item" onclick="selectWallet(this, '${walletAddress}')">
            <span class="active-indicator"></span>
            <div class="wallet-info">
                <span class="wallet-address">${walletAddress}</span>
            </div>
        </div>
        <button class="delete-wallet-btn" onclick="deleteWallet(this)">
            <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ff4d4d">
                <path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M16 9v10H8V9h8m-1.5-6h-5L9 4H4v2h16V4h-5.5zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
            </svg>
        </button>
    `;

    document.querySelector('.wallet-list').appendChild(walletItemContainer);

    document.getElementById('wallet-popup').style.display = 'none';
    document.getElementById('wallet-input').value = '';

    const data = {
        action: "add_wallet",
        walletAddress: walletAddress,
    };
    tg.sendData(data);
    console.log("Added wallet address sent:", walletAddress);
}

function selectWallet(walletItem) {
    document.querySelectorAll('.wallet-item').forEach(item => {
        item.classList.remove('active-wallet');
    });
    walletItem.classList.add('active-wallet');

    const selectedWalletAddress = walletItem.querySelector('.wallet-address').innerText.trim();

    const data = {
        action: "select_wallet",
        walletAddress: selectedWalletAddress,
    };
    tg.sendData(data);
    console.log("Selected wallet address sent:", selectedWalletAddress);
}

function deleteWallet(deleteButton) {
    const walletContainer = deleteButton.closest('.wallet-item-container');
    const walletAddress = walletContainer.querySelector('.wallet-address').innerText.trim();

    walletContainer.remove();

    const data = {
        action: "delete_wallet",
        walletAddress: walletAddress,
    };
    tg.sendData(data);
    console.log("Deleted wallet address sent:", walletAddress);
}
