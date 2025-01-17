// Consolidated and fixed script.js
const waterElement = document.getElementById("water");
const waterInput = document.getElementById("waterInput");
const logList = document.getElementById("water-log-list");
const statusText = document.getElementById("statusText") // Updates based off of if user is meeting goal
let maxCapacity = 1000; // Max capacity in ml
let currentLevel = 0; // Current water level in ml

//Function to update goal
function updateGoal(){
const goal = document.getElementById("water-goal").value;
if (isNaN(goal) || goal === ""){
  alert("Please enter a number for your goal in mLs.");
  return;
}
localStorage.setItem("water-goal", goal);
const goalText = document.getElementById("goal-text");
goalText.textContent = `Your current goal is ${goal} mLs.`
maxCapacity = goal;
}

function renderGoal() {
  const goal = localStorage.getItem("water-goal");
  const goalText = document.getElementById("goal-text");
  goalText.textContent = `Your current goal is ${goal} mLs of water per day.`;
}

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
  localStorage.setItem("currentLevel", JSON.stringify(currentLevel));
  if (currentLevel > maxCapacity) {
    currentLevel = maxCapacity;
    alert("The bottle is full! Great Job!");
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
  logList.innerHTML = ""; // Reset list

  waterLog.forEach((log, index) => {
    const li = document.createElement("li");
    const p = document.createElement("p")
    p.textContent = `${log.volume} ml`;
    li.classList.add("list-item")

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button")
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteLog(index);

    li.appendChild(p);
    li.appendChild(deleteButton);
    logList.appendChild(li);
  });
}

// Function to delete a log entry
function deleteLog(index) {
  //Adjust current water level height in bottle
  const amountToSubtract = waterLog[index].volume;
  currentLevel = currentLevel - amountToSubtract;
  const waterHeight = (currentLevel / maxCapacity) * 100; // Convert to percentage
  waterElement.style.height = waterHeight + "%";
  //Retrieve local storage data for water log and delete entry
  localStorage.getItem("waterLog");
  waterLog.splice(index, 1);
  localStorage.setItem("waterLog", JSON.stringify(waterLog));
  renderWaterLog();
  //Retrieve local storage data for water level and subtract 
  let level = parseFloat(localStorage.getItem("currentLevel"));
  level -= amountToSubtract;
  localStorage.setItem("currentLevel", currentLevel);
  
  localStorage.setItem("waterLog", JSON.stringify(waterLog));
  //Retrieve local storage data for graph and delete entry
  /*
  let waterData = JSON.parse(localStorage.getItem("waterData"));
  waterData.splice(index,1);
  localStorage.setItem("waterData", JSON.stringify(waterData) );
  */

  calculateProgress();
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

    //Calculate progress
    calculateProgress();
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
  calculateProgress()
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

// Function to calculate the user's progress
function calculateProgress() {
  const now = new Date();
  const currentHour = now.getHours();
  const elapsedHours = Math.max(currentHour, 1); // Ensures at least 1 hour is counted

  // Determine the target water intake at that point in the day
  const targetIntake = (maxCapacity / 24) * elapsedHours;

  // Retrieve current level from localStorage, ensuring it's a number
  let level = parseFloat(localStorage.getItem("currentLevel")) || 0;

  // Update status text
  if (level >= maxCapacity) {
    statusText.textContent = "🎉 You've met your daily water goal! Great job today!";
    statusText.style.color = "green";
  } else if (level >= targetIntake) {
    statusText.textContent = "👍 You're on track to meet your goal!";
    statusText.style.color = "blue";
  } else {
    statusText.textContent = "😅 You're falling behind. Drink more water!";
    statusText.style.color = "red";
  }
}

// Initializes progress text
calculateProgress();

//Initializes goal text
renderGoal()


