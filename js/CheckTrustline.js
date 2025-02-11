import StellarSdk from 'https://cdn.jsdelivr.net/npm/@stellar/stellar-sdk/+esm';
import {updateBalanceUI} from "./CheckUserAndWallet.js";
const server = new StellarSdk.Horizon.Server("https://horizon.stellar.org");

const assetCode = "NFT";
const assetIssuer = "GBBWC7PI3LX4GNQ2AMF3HOHJCTHFWSIADMCB2DZIRNM6IKIVRTXMJTRG";

export async function checkTrustline(accountId) {
    try {
        const account = await server.loadAccount(accountId);

        const trustlineExists = account.balances.some(balance =>
            balance.asset_code === assetCode && balance.asset_issuer === assetIssuer
        );
        console.log(`Trustline to ${assetCode} (${assetIssuer}) exists:`, trustlineExists);

        return trustlineExists;
    } catch (error) {
        console.error("Error checking trustline:", error);
        return false;
    }
}

export async function getWalletBalance(accountId) {
    try {
        const account = await server.loadAccount(accountId);
        const nativeBalance = account.balances.find(balance => balance.asset_type === "native");

        if (nativeBalance) {
            console.log(`Balance of ${accountId}: ${nativeBalance.balance}`);
            return nativeBalance.balance;
        } else {
            console.warn("No balance found.");
            return "0";
        }
    } catch (error) {
        console.error("Error fetching wallet balance:", error);
        return "0";
    }
}

