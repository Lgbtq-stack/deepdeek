import {
    addWallet_,
    deleteWallet_,
    selectWallet_
} from "./WalletController.js";

window.addWallet = function() {
    addWallet_();
}

window.selectWallet = function(walletItem) {
    selectWallet_(walletItem);
}

window.deleteWallet = function(deleteButton) {
    deleteWallet_(deleteButton);
}