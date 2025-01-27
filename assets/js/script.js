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
goalText.textContent = `Your current goal is ${goal} mLs of water per day.`
maxCapacity = goal;

// Update chart's y-axis max value
waterChart.options.scales.y.max = parseInt(maxCapacity, 10);
waterChart.update();
return;
}

function renderGoal() {
  let goal = localStorage.getItem("water-goal");
  if (goal === null) {
    goal = 0;
    localStorage.setItem("water-goal", goal);
  } 
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
  // Retrieve the water log array
  let log = JSON.parse(localStorage.getItem("waterLog")) || [];
  log = [];
  localStorage.setItem("waterLog", JSON.stringify(log));
  waterElement.style.height = "0";
  renderWaterLog();
  calculateProgress();
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

  //Delete the related data point from the chart
  deleteDataPoint(index);
  
  localStorage.setItem("waterLog", JSON.stringify(waterLog));
  //Retrieve local storage data for graph and delete entry
  /*
  let waterData = JSON.parse(localStorage.getItem("waterData"));
  waterData.splice(index,1);
  localStorage.setItem("waterData", JSON.stringify(waterData) );
  */

  renderWaterLog();
  calculateProgress();
}

// Initial render of water log
renderWaterLog();

const ctx = document.getElementById('waterChart').getContext('2d');
const waterChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Water Intake (ml)',
      data: [],
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
        max: maxCapacity,
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
    
    // Save to local storage
    let waterData = JSON.parse(localStorage.getItem('waterData')) || [];
    waterData.push({ time: currentTime, amount: waterAmount });
    localStorage.setItem('waterData', JSON.stringify(waterData));

    // Update water element and log
    addWaterToLog(waterAmount);

    //Calculate progress
    calculateProgress();
  }
}

// Function to delete a data point from the chart
function deleteDataPoint(index) {
  waterChart.data.labels.splice(index, 1);
  waterChart.data.datasets[0].data.splice(index, 1);
  waterChart.data.datasets[1].data.splice(index, 1);
  waterChart.update();
  let waterData = JSON.parse(localStorage.getItem('waterData')) || [];
  waterData.splice(index, 1);
  localStorage.setItem('waterData', JSON.stringify(waterData));
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

// Update water element when the page loads
window.onload = () => {
  loadWaterData();
  const savedWaterLog = JSON.parse(localStorage.getItem("waterLog")) || [];
  currentLevel = savedWaterLog.reduce((total, log) => total + log.volume, 0);
  const waterHeight = (currentLevel / maxCapacity) * 100;
  waterElement.style.height = waterHeight + "%";
  renderWaterLog();

  const savedGoal = localStorage.getItem("water-goal");
  if (savedGoal) {
    maxCapacity = parseInt(savedGoal, 10);
    waterChart.options.scales.y.max = maxCapacity;
    waterChart.update();
  }
};


function resetWater() {
    if (waterLog.length === 0) {
        alert("No entries to remove.");
        return;
    }

    const lastEntry = waterLog.pop();
    currentLevel -= lastEntry.volume;
    if (currentLevel < 0) currentLevel = 0;

    localStorage.setItem("waterLog", JSON.stringify(waterLog));

    const waterHeight = (currentLevel / maxCapacity) * 100;
    waterElement.style.height = waterHeight + "%";
    
    //Resets currentLevel to zero
    localStorage.setItem("currentLevel", 0)
    
    renderWaterLog();
    calculateProgress();
    

}

// Function to calculate the user's progress
function calculateProgress() {
  const now = new Date();
  const currentHour = now.getHours();
  const elapsedHours = Math.max(currentHour, 1); // Ensures at least 1 hour is counted

  // Determine the target water intake at that point in the day
  const targetIntake = (maxCapacity / 24) * elapsedHours;

  // Retrieve current level from localStorage, ensuring it's a number
  let level = parseFloat(localStorage.getItem("currentLevel")) || 0;
  let goal = parseFloat(localStorage.getItem("water-goal"))

  // Update status text
  if (level >= goal) {
    statusText.textContent = "🎉 You've met your daily water goal! Great job today!";
    statusText.style.color = "green";
  } else if (level >= targetIntake) {
    statusText.textContent = "👍 You're on track to meet your goal!";
    statusText.style.color = "blue";
  } else {
    statusText.textContent = "😅 You're falling behind. Drink more water!";
    statusText.style.color = "#800020";
  }
}

// Initializes progress text
calculateProgress();


