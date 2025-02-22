import { loadReferrals, localReferralsData } from "./Referrals.js";

// 🗓 Генерация подписей X (даты из данных)
function generateDateLabels(referralHistoryData) {
    return referralHistoryData.map(entry =>
        new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
}

// 📊 Определение шага по оси Y
function getYAxisStep(totalBalance) {
    if (totalBalance <= 500) return 100;
    if (totalBalance <= 1000) return 150;
    if (totalBalance <= 5000) return 250;
    if (totalBalance <= 10000) return 500;
    return 1000;
}

// 📈 Определение максимального значения Y
function getYAxisMax(totalBalance) {
    let step = getYAxisStep(totalBalance);
    return Math.ceil(totalBalance / step) * step;
}

// 🔄 Функция обновления графика
export function updateReferralChart(referralHistoryData) {
    const ctx = document.getElementById("referralChart")?.getContext("2d");

    if (!ctx) {
        console.error("❌ referralChart не найден в DOM!");
        return;
    }

    // Удаляем старый график перед созданием нового
    if (window.referralChart instanceof Chart) {
        window.referralChart.destroy();
    }

    let labels = generateDateLabels(referralHistoryData);
    let totalBonusesHistory = referralHistoryData.map(entry => entry.totalBonuses);
    let latestTotalBonus = totalBonusesHistory[totalBonusesHistory.length - 1] || 0;

    window.referralChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Total Bonuses Growth",
                    data: totalBonusesHistory,
                    borderColor: "green",
                    borderWidth: 2,
                    pointBackgroundColor: "green",
                    pointRadius: 5,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: getYAxisMax(latestTotalBonus),
                    ticks: {
                        stepSize: getYAxisStep(latestTotalBonus)
                    }
                }
            }
        }
    });

    console.log("✅ График обновлен!");
}

// 🚀 Инициализация графика
export async function initReferralChart() {
    console.log("📊 Запуск initReferralChart...");
    await loadReferrals(); // Загружаем данные

    let referralHistoryData = localReferralsData.history || [];

    if (referralHistoryData.length < 7) {
        let lastEntry = referralHistoryData[referralHistoryData.length - 1] || { totalBonuses: 0 };
        while (referralHistoryData.length < 7) {
            referralHistoryData.unshift({ ...lastEntry });
        }
    }

    updateReferralChart(referralHistoryData);
}

// 🛠 Добавляем глобальную функцию (если вызывается из HTML)
window.initReferralChart = initReferralChart;
