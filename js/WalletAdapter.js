import {
    addWallet_,
    deleteWallet_,
    selectWallet_
} from "./WalletController.js";

window.addWallet = async function (walletAddress) {
    await addWallet_(walletAddress);
}

window.selectWallet = async function (walletItem) {
    await selectWallet_(walletItem);
}

window.deleteWallet = async function (deleteButton) {
    await deleteWallet_(deleteButton);
}