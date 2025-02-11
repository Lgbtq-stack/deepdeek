import {
    addWallet_,
    deleteWallet_,
    selectWallet_
} from "./WalletController.js";

window.addWallet = function(walletAddress) {
    addWallet_(walletAddress);
}

window.selectWallet = function(walletItem) {
    selectWallet_(walletItem);
}

window.deleteWallet = function(deleteButton) {
    deleteWallet_(deleteButton);
}