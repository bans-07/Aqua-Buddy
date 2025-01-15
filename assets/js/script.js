const waterElement = document.getElementById('water');
const maxCapacity = 1000; // Max capacity in ml
let currentLevel = 0; // Current water level in ml
let waterLog = []; //Stores values of logged water as an object
const logList = document.getElementById('water-log-list')

function addWater() {
    const input = document.getElementById('waterInput');
    const amountToAdd = parseInt(input.value, 10);
    const log = {
        volume: parseInt(input.value, 10),
    }

    if (isNaN(amountToAdd) || amountToAdd <= 0) {
        alert('Please enter a valid amount of water to add.');
        return;
    }

    currentLevel += amountToAdd;

    if (currentLevel > maxCapacity) {
        currentLevel = maxCapacity;
        alert('The bottle is full!');
    }

    //Checks if array is already present in local storage and appends
    waterLog = JSON.parse(localStorage.getItem("waterLog"))
    if (waterLog === null){
        waterLog = []
        waterLog.push(log)
        localStorage.setItem("waterLog", JSON.stringify(waterLog));
    } else {
        let waterLog = JSON.parse(localStorage.getItem("waterLog"));
        waterLog.push(log);
        localStorage.setItem("waterLog", JSON.stringify(waterLog));

    }

    const waterHeight = (currentLevel / maxCapacity) * 100; // Convert to percentage
    waterElement.style.height = waterHeight + '%';

    input.value = ''; // Clear the input field

    renderWaterLog()
}

function renderWaterLog() {
    waterLog = JSON.parse(localStorage.getItem("waterLog"))
    
    if (waterLog === null){
       return
    }

    logList.innerHTML= "";

    for (let i = 0; i < waterLog.length; i++) {
        
        const log = waterLog[i];

        const li = document.createElement('li');
        li.textContent = log.volume;

        const button = document.createElement('button');
        button.textContent= "Delete"

        li.appendChild(button);
        logList.appendChild(li);
        console.log("Testing")
    }
}

renderWaterLog();








