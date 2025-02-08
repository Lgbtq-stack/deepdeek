import StellarSdk from 'https://cdn.jsdelivr.net/npm/@stellar/stellar-sdk/+esm';
const server = new StellarSdk.Horizon.Server("https://horizon.stellar.org");

export async function checkTrustline(accountId) {
    try {
        const assetCode = "NFT";
        const assetIssuer = "GBBWC7PI3LX4GNQ2AMF3HOHJCTHFWSIADMCB2DZIRNM6IKIVRTXMJTRG";
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