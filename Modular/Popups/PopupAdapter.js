import {
    closeErrorPopup_,
    closePopup_,
    copyToClipboard_,
    disableScroll_,
    enableScroll_,
    openRechargePopup_,
    openTestPage1_,
    openTestPage2_,
    openWalletPopup_,
    openWebPage_,
    openWithdrawPopup_,
    showErrorPopup_,
    showToast_
} from "./PopupController.js";

window.openWithdrawPopup = function(title = "Withdraw Funds", placeholder = "Enter amount", buttonText = "Confirm") {
    openWithdrawPopup_(title, placeholder, buttonText);
}

window.openWalletPopup = function(title = "Add Wallet", placeholder = "Enter wallet address", buttonText = "Add Wallet") {
    openWalletPopup_(title, placeholder, buttonText);
}

window.openRechargePopup = function() {
    openRechargePopup_();
}

window.openWebPage = function() {
    openWebPage_();
}

window.openTestPage1 = function() {
    openTestPage1_();
}

window.openTestPage2 = function() {
    openTestPage2_();
}

window.showErrorPopup = function(type, message) {
    showErrorPopup_(type, message);
}

window.closeErrorPopup = function() {
    closeErrorPopup_();
}

window.closePopup = function() {
    closePopup_();
}

window.showToast = function(message) {
    showToast_(message);
}

window.copyToClipboard = function(elementId) {
    copyToClipboard_(elementId);
}

window.disableScroll = function() {
    disableScroll_();
}

window.enableScroll = function() {
    enableScroll_();
}