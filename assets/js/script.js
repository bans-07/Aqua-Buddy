// Consolidated and fixed script.js
const waterElement = document.getElementById("water");
const waterInput = document.getElementById("waterInput");
const logList = document.getElementById("water-log-list");
const maxCapacity = 1000; // Max capacity in ml
let currentLevel = 0; // Current water level in ml

// Retrieve water log and username from localStorage
let waterLog = JSON.parse(localStorage.getItem("waterLog")) || [];
const username = localStorage.getItem("username") || "Aqua Buddy";
document.getElementById("username").textContent = username;

// Function to add water to log
function addWaterToLog(amountToAdd) {
  if (isNaN(amountToAdd) || amountToAdd <= 0) {
    alert("Please enter a valid amount of water to add.");
    return;
  }

  currentLevel += amountToAdd;
  if (currentLevel > maxCapacity) {
    currentLevel = maxCapacity;
    alert("The bottle is full!");
  }

  // Update water log
  const log = { volume: amountToAdd };
  waterLog.push(log);
  localStorage.setItem("waterLog", JSON.stringify(waterLog));

  // Update water level visually
  const waterHeight = (currentLevel / maxCapacity) * 100; // Convert to percentage
  waterElement.style.height = waterHeight + "%";

  // Clear input and re-render log
  waterInput.value = "";
  renderWaterLog();
}

// Function to reset water level and log
function resetWater() {
  currentLevel = 0;
  waterLog = [];
  localStorage.removeItem("waterLog");
  waterElement.style.height = "0";
  renderWaterLog();
}

// Function to render water log
function renderWaterLog() {
  logList.innerHTML = "Water Log:"; // Reset list

  waterLog.forEach((log, index) => {
    const li = document.createElement("li");
    li.textContent = `${log.volume} ml`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteLog(index);

    li.appendChild(deleteButton);
    logList.appendChild(li);
  });
}

// Function to delete a log entry
function deleteLog(index) {
  waterLog.splice(index, 1);
  localStorage.setItem("waterLog", JSON.stringify(waterLog));
  renderWaterLog();
}

// Initial render of water log
renderWaterLog();

const ctx = document.getElementById('waterChart').getContext('2d');
const waterChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [], // Time labels will be added dynamically
    datasets: [{
      label: 'Water Intake (ml)',
      data: [], // Data points will be added dynamically
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      fill: false
    }, {
      label: 'Total Water Intake (ml)',
      data: [], // Cumulative total data points
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
      fill: false
    }]
  },
  options: {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          min: new Date().setHours(0, 0, 0, 0), // Start of the day
          max: new Date().setHours(23, 59, 59, 999) // End of the day
        },
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 1000,
        title: {
          display: true,
          text: 'Water Intake (ml)'
        }
      }
    }
  }
});

function addWater() {
  const waterAmount = parseInt(waterInput.value);
  if (!isNaN(waterAmount) && waterAmount > 0) {
    const currentTime = new Date();
    waterChart.data.labels.push(currentTime);
    waterChart.data.datasets[0].data.push(waterAmount);

    // Calculate the new total water intake
    const totalWaterIntake = waterChart.data.datasets[1].data.length > 0
      ? waterChart.data.datasets[1].data[waterChart.data.datasets[1].data.length - 1] + waterAmount
      : waterAmount;
    waterChart.data.datasets[1].data.push(totalWaterIntake);

    waterChart.update();
    
    // Save the data to local storage
    let waterData = JSON.parse(localStorage.getItem('waterData')) || [];
    waterData.push({ time: currentTime, amount: waterAmount });
    localStorage.setItem('waterData', JSON.stringify(waterData));

    // Update water element and log
    addWaterToLog(waterAmount);
  }
}

// Load data from local storage and update the chart
function loadWaterData() {
  let waterData = JSON.parse(localStorage.getItem('waterData')) || [];
  let totalWaterIntake = 0;
  waterData.forEach(entry => {
    waterChart.data.labels.push(new Date(entry.time));
    waterChart.data.datasets[0].data.push(entry.amount);
    totalWaterIntake += entry.amount;
    waterChart.data.datasets[1].data.push(totalWaterIntake);
  });
  waterChart.update();
}

// Clear chart data and local storage
function resetChart() {
  waterChart.data.labels = [];
  waterChart.data.datasets[0].data = [];
  waterChart.data.datasets[1].data = [];
  waterChart.update();
  localStorage.removeItem('waterData');
}

// Call loadWaterData when the page loads
window.onload = loadWaterData;
// Update water element when the page loads
window.onload = () => {
  loadWaterData();
  const savedWaterLog = JSON.parse(localStorage.getItem("waterLog")) || [];
  currentLevel = savedWaterLog.reduce((total, log) => total + log.volume, 0);
  const waterHeight = (currentLevel / maxCapacity) * 100;
  waterElement.style.height = waterHeight + "%";
  renderWaterLog();
};