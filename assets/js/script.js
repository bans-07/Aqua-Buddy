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

// Function to add water
function addWater() {
    const amountToAdd = parseInt(waterInput.value, 10);

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
        const p = document.createElement("p")
        p.textContent= `${log.volume} ml`;
        li.classList.add("list-item")

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteLog(index);

        li.appendChild(p);
        li.appendChild(deleteButton)
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
