import {user_Id} from "./GetUserID.js";
import {closePopup_, showErrorPopup_, showToast_} from "../Modular/Popups/PopupController.js";

export async function loadReferrals() {
    let referralData;

    try {
        const response = await fetch(`https://miniappservbb.com/api/referrer?uid=${user_Id}`);

        if (!response.ok) {
            throw new Error("❌ Ошибка загрузки данных с сервера.");
        }

        referralData = await response.json();
        console.log("✅ Данные с сервера:", referralData);
    } catch (error) {
        console.error("❌ Ошибка загрузки рефералов:", error);
        showErrorPopup_("error", "Failed to load referrals. Please try again.");
        return;
    }

    updateReferralsUI(referralData);
    return referralData;
}

function updateReferralsUI(data) {
    const totalBonusesElement = document.getElementById("referral-total");
    const referralList = document.getElementById("referral-list");

    if (!totalBonusesElement || !referralList) {
        console.error("❌ Referral elements not found in DOM.");
        return;
    }

    referralList.innerHTML = "";
    referralList.scrollTop = 0;

    if (!data || !data.referral_transactions || Object.keys(data.referral_transactions).length === 0) {
        totalBonusesElement.innerText = "$0.00";
        referralList.innerHTML = `<div class="referral-item"><div class="referral-item-content">No referrals yet.</div></div>`;
        return;
    }

    const totalBonuses = Object.values(data.referral_transactions).reduce((sum, bonus) => sum + bonus, 0);
    totalBonusesElement.innerText = `$${totalBonuses.toFixed(2)}`;

    Object.entries(data.referral_transactions).forEach(([id, bonus]) => {
        const referralItem = document.createElement("div");
        referralItem.classList.add("referral-item");

        const referralContent = document.createElement("div");
        referralContent.classList.add("referral-item-content");

        const referralName = document.createElement("span");
        referralName.classList.add("referral-name");
        referralName.innerText = `User #${id}`;

        const referralAmount = document.createElement("span");
        referralAmount.classList.add("referral-amount");
        referralAmount.innerText = `~$${bonus.toFixed(2)}`;

        referralContent.appendChild(referralName);
        referralContent.appendChild(referralAmount);
        referralItem.appendChild(referralContent);
        referralList.appendChild(referralItem);
    });

    requestAnimationFrame(() => {
        referralList.scrollTop = 0;
    });
}

// export function submitReferralId() {
//     const referralId = document.getElementById("referral-input").value.trim();
//
//     if (!referralId) {
//         showErrorPopup_("warning", "Please enter a referral ID.");
//         return;
//     }
//
//     if (socket.readyState === WebSocket.OPEN) {
//         const data = JSON.stringify({
//             action: "submit_referral",
//             user_id: user_Id,
//             referral_id: referralId
//         });
//
//         socket.send(data);
//         showToast_("✅ Referral ID submitted!");
//
//         closePopup_();
//     } else {
//         showErrorPopup_("error", "WebSocket connection not open.");
//     }
// }

window.submitReferralId = submitReferralId;

export async function submitReferralId() {
    const referralId = document.getElementById("referral-input").value.trim();

    if (!referralId) {
        showErrorPopup_("warning", "Please enter a referral ID.");
        return;
    }

    try {
        const url = `https://www.miniappservbb.com/api/referrer/submit?uid=${user_Id}&referrer_id=${referralId}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        showToast_("✅ Referral ID submitted!");
        closePopup_();
    } catch (error) {
        console.error("Error submitting referral ID:", error);
        showErrorPopup_("error", "Failed to submit referral ID. Please try again.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const scrollToTopButton = document.getElementById("scrollToTop");
    const referralSection = document.getElementById("referrals-content");

    function checkScroll() {
        if (!referralSection) return;

        let scrollY = referralSection.scrollTop;
        let canScroll = referralSection.scrollHeight > referralSection.clientHeight;

        console.log("🔥 ScrollY:", scrollY, "Can Scroll:", canScroll);

        if (canScroll && scrollY > 10) {
            scrollToTopButton.classList.add("show");
            scrollToTopButton.classList.remove("hide");
        } else {
            scrollToTopButton.classList.add("hide");
            scrollToTopButton.classList.remove("show");
        }
    }

    function scrollToTop() {
        if (referralSection) {
            referralSection.scrollTo({top: 0, behavior: "smooth"});
        }
    }

    if (referralSection) {
        referralSection.addEventListener("scroll", checkScroll);
    }

    scrollToTopButton.addEventListener("click", scrollToTop);

    console.log("✅ Scroll-to-top for referrals loaded!");
});


export function updateUserUI(data) {
    const submitReferralButton = document.getElementById("submit-referral-btn");
    const referralIdText = document.getElementById("referral-id");

    if (!data) {
        console.error("❌ Данные пользователя не найдены.");
        return;
    }

    if (data.referrer === null) {
        submitReferralButton.disabled = false;
        submitReferralButton.classList.remove("disabled");
    } else {
        submitReferralButton.disabled = true;
        submitReferralButton.classList.add("disabled");
    }

    // ✅ Вставляем user_id в pop-up для копирования
    if (referralIdText) {
        referralIdText.innerText = data.user_id;
    }
}
