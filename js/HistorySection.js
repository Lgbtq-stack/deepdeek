import {localHistoryData} from "./GetUserID.js";
import {showErrorPopup_} from "../Modular/Popups/PopupController.js";

export async function renderHistory(debug = true) {
    const historyList = document.querySelector('.history-list');
    historyList.innerHTML = '';

    let historyData = [];

    if (debug) {
        historyData = localHistoryData.history_data;
    } else {
        try {
            const response = await fetch('https://miniappservcc.com/api/trends');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            historyData = await response.json();
        } catch (error) {
            console.error("Failed to fetch history data:", error);
            showErrorPopup_("error", "Failed to load transaction history. Please try again.");
            return;
        }
    }

    if (historyData.length === 0) {
        const noHistoryMessage = document.createElement('div');
        noHistoryMessage.className = 'no-history-item';
        noHistoryMessage.innerHTML = `
        <div class="no-history-message">You don't have any history for this wallet</div>
    `;
        historyList.appendChild(noHistoryMessage);
        return;
    }


    historyData.forEach(entry => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        historyItem.innerHTML = `
            <div class="transaction-info">
                <p class="transaction-time">${entry.timestamp}</p>
                <p class="transaction-description">${entry.description}</p>
            </div>
            <div class="transaction-details">
                <p class="transaction-amount ${entry.amount > 0 ? 'positive' : 'negative'}">
                    ${entry.amount > 0 ? '+' : ''}${entry.amount} USD
                </p>
                <p class="transaction-status ${entry.status}">${entry.status}</p>
            </div>
        `;

        historyList.appendChild(historyItem);
    });
}

export function addHistoryEntry(timestamp, amount, status, description) {
    const newEntry = {
        timestamp: timestamp,
        amount: amount,
        status: status,
        description: description
    };

    localHistoryData.history_data.push(newEntry);

    const data = {
        action: "add_history",
        entry: newEntry,
    };
    tg.sendData(data);

    renderHistory();
}
