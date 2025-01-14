const waterElement = document.getElementById('water');
const maxCapacity = 1000; // Max capacity in ml
let currentLevel = 0; // Current water level in ml

function addWater() {
    const input = document.getElementById('waterInput');
    const amountToAdd = parseInt(input.value, 10);

    if (isNaN(amountToAdd) || amountToAdd <= 0) {
        alert('Please enter a valid amount of water to add.');
        return;
    }

    currentLevel += amountToAdd;

    if (currentLevel > maxCapacity) {
        currentLevel = maxCapacity;
        alert('The bottle is full!');
    }

    const waterHeight = (currentLevel / maxCapacity) * 100; // Convert to percentage
    waterElement.style.height = waterHeight + '%';

    input.value = ''; // Clear the input field
}
