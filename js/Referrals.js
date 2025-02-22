import {user_Id} from "./GetUserID.js";
import {closePopup_, showErrorPopup_, showToast_} from "../Modular/Popups/PopupController.js";
import {updateReferralChart} from "./ReferralChart.js";

export const localReferralsData = {
    totalBonuses: 61.7,
    referrals: [
        { name: "Alice", bonus: 12.5 },
        { name: "Bob", bonus: 8.0 },
        { name: "Charlie", bonus: 15.3 },
        { name: "David", bonus: 5.2 },
        { name: "Eve", bonus: 20.7 },
        { name: "Alice", bonus: 12.5 },
        { name: "Bob", bonus: 8.0 },
        { name: "Charlie", bonus: 15.3 },
        { name: "David", bonus: 5.2 },
        { name: "Eve", bonus: 20.7 },
        { name: "Alice", bonus: 12.5 },
        { name: "Bob", bonus: 8.0 },
        { name: "Charlie", bonus: 15.3 },
        { name: "David", bonus: 5.2 },
        { name: "Eve", bonus: 20.7 },
        { name: "Alice", bonus: 12.5 },
        { name: "Bob", bonus: 8.0 },
        { name: "Charlie", bonus: 15.3 },
        { name: "David", bonus: 5.2 },
        { name: "Eve", bonus: 20.7 },
    ]
};

const referralHistoryData = [
    { date: "2024-02-16", totalBonuses: 50 },
    { date: "2024-02-17", totalBonuses: 75 },
    { date: "2024-02-18", totalBonuses: 90 },
    { date: "2024-02-19", totalBonuses: 110 },
    { date: "2024-02-20", totalBonuses: 150 },
    { date: "2024-02-21", totalBonuses: 200 },
    { date: "2024-02-22", totalBonuses: 246 } // Сегодняшний день
];

export async function loadReferrals() {
    let referralData;
    let debug = true;
    // try {
        if (debug) {
            console.log("Debug mode is ON: Using local referral data.");
            referralData = localReferralsData;
        } else {
            const response = await fetch(`https://miniappservbb.com/api/referrals?uid=${user_Id}`);

            if (!response.ok) {
                throw new Error("Failed to fetch referral data.");
            }

            referralData = await response.json();
            console.log("Referrals loaded from API:", referralData);
        }

        updateReferralsUI(referralData);

        updateReferralChart(referralHistoryData);
    // } catch (error) {
    //     console.error("Error loading referrals:", error);
    //     showErrorPopup_("error", "Failed to load referrals. Please try again.");
    //     updateReferralsUI({ totalBonuses: 0, referrals: [] });
    // }
}

function updateReferralsUI(data) {
    const totalBonusesElement = document.getElementById("referral-total");
    const referralList = document.getElementById("referral-list");

    if (!totalBonusesElement || !referralList) {
        console.error("Referral elements not found in DOM.");
        return;
    }

    referralList.innerHTML = "";

    referralList.scrollTop = 0;

    if (!data || !Array.isArray(data.referrals) || data.referrals.length === 0) {
        totalBonusesElement.innerText = "$0.00";
        referralList.innerHTML = `
            <div class="referral-item">
                <div class="referral-item-content">You don't have any referrals</div>
            </div>`;
        return;
    }

    const totalBonuses = data.referrals.reduce((sum, r) => sum + (r.bonus || 0), 0);
    totalBonusesElement.innerText = `$${totalBonuses.toFixed(2)}`;

    data.referrals.forEach(referral => {
        const referralItem = document.createElement("div");
        referralItem.classList.add("referral-item");

        const referralContent = document.createElement("div");
        referralContent.classList.add("referral-item-content");

        const referralName = document.createElement("span");
        referralName.classList.add("referral-name");
        referralName.innerText = referral.name;

        const referralAmount = document.createElement("span");
        referralAmount.classList.add("referral-amount");
        referralAmount.innerText = `+$${(referral.bonus || 0).toFixed(2)}`;

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

export async function submitReferralId() {
    const referralId = document.getElementById("referral-input").value.trim();

    if (!referralId) {
        showErrorPopup_("warning", "Please enter a referral ID.");
        return;
    }

    try {
        const url = `https://www.miniappservbb.com/api/referral/submit?uid=${user_id}&referral_id=${referralId}`;
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
            referralSection.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    if (referralSection) {
        referralSection.addEventListener("scroll", checkScroll);
    }

    scrollToTopButton.addEventListener("click", scrollToTop);

    console.log("✅ Scroll-to-top for referrals loaded!");
});


