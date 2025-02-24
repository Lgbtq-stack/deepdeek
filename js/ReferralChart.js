import { loadReferrals } from "./Referrals.js";

function formatChartData(chartInfo) {
    const labels = Object.keys(chartInfo).sort().map(date => formatDate(date));
    const data = labels.map((_, index) => Object.values(chartInfo)[index] ?? 0);

    return { labels, data };
}

// 📅 Форматирует дату в MM/DD/YY
function formatDate(dateStr) {
    let date = new Date(dateStr);
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    let year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
}

// 📊 Логика для вычисления шагов по Y оси
function getYAxisStep(totalBalance) {
    if (totalBalance <= 100) return 10;
    if (totalBalance <= 1000) return 100;
    if (totalBalance <= 10000) return 1000;
    return 5000;
}

function getYAxisMax(totalBalance) {
    let step = getYAxisStep(totalBalance);
    return Math.ceil(totalBalance / step) * step;
}

// 🔄 Обновление графика
export function updateReferralChart(chartInfo) {
    const ctx = document.getElementById('referralChart')?.getContext('2d');

    if (!ctx) {
        console.error("❌ referralChart не найден в DOM!");
        return;
    }

    // 🛑 Удаляем старый график перед созданием нового
    if (window.referralChart instanceof Chart) {
        window.referralChart.destroy();
    }

    const { labels, data } = formatChartData(chartInfo);

    console.log("📊 Labels:", labels);
    console.log("📈 Data:", data);

    window.referralChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Bonuses Growth',
                data: data,
                borderColor: 'green',
                borderWidth: 2,
                pointBackgroundColor: 'green',
                pointRadius: 5, // 🔥 Показываем точки всегда
                showLine: true,
                spanGaps: false, // 🔥 Линия не прерывается, даже если 0
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: getYAxisMax(Math.max(...data)),
                    ticks: {
                        stepSize: getYAxisStep(Math.max(...data))
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
    let referralData = await loadReferrals();

    if (!referralData || !referralData.chart_info) {
        console.error("❌ Нет данных для графика!");
        return;
    }

    updateReferralChart(referralData.chart_info);
}

window.initReferralChart = initReferralChart;
