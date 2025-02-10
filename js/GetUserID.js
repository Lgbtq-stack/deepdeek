export let user_Id = "";
let localUserID = "488916773";
export const localUserData = {
    "user_data": [
        {
            "tokens": 0,
            "balance": 0
        }
    ]
}
export let activeWallet = "";

export const localWalletData = {
    "wallet_data": [
        {
            "wallet": "GAKVPYAOBX7JWG7E74YXHSKNIYXSIKJ5J3PHCDTMAIKKMYLVB5WIY4KO",
            "balance": -10,
            "active": true,
        },
        {
            "wallet": "GBQCR3L7H2QBCJNEI3CLBRCGQFSTGPEPRW3U2NPQRUJ66ZVQ7SECSUHQ",
            "balance": -10,
            "active": false,
        },
    ]
}

export const localHistoryData = {
    "history_data": []
}

let isInitialized = false;
export let debug = true;

export function Initialize()
{
    isInitialized = true;

    user_Id = getUserIdFromURL();
}

function getUserIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    user_Id = urlParams.get("user_id");

    if(debug) {
        user_Id = localUserID;
    }

    if (user_Id) {
        console.log(`User ID from URL: ${user_Id}`);
        return user_Id;
    } else {
        console.warn("User ID not found in the URL.");
        return null;
    }
}

export function GetUserID() {
    return user_Id;
}