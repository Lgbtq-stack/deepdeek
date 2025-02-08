export let user_Id = "";
let localUserID = "488916773";

let isInitialized = false;
let debbug = true;

export function Initialize()
{
    isInitialized = true;

    user_Id = getUserIdFromURL();
}

function getUserIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    user_Id = urlParams.get("user_id");

    if(debbug) {
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