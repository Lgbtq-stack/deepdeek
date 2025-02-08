import {
    closeErrorPopup_,
    closePopup_, copyToClipboard_,
    disableScroll_,
    enableScroll_, openRechargePopup_,
    openWalletPopup_, openWebPage_,
    openWithdrawPopup_,
    showErrorPopup_
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

window.showErrorPopup = function(type, message) {
    showErrorPopup_(type, message);
}

window.closeErrorPopup = function() {
    closeErrorPopup_();
}

window.closePopup = function() {
    closePopup_();
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