document.addEventListener("DOMContentLoaded", () => {
    const waterContainer = document.getElementById("water");
    const waterInput = document.getElementById("waterInput");
  
    // Maximum height for water in the container
    const maxHeight = 350; // Matches the bottle height in CSS (350px)
    let currentHeight = 0;
  
    // Function to add water
    window.addWater = function () {
      const input = parseInt(waterInput.value, 10);
  
      if (isNaN(input) || input <= 0) {
        alert("Please enter a valid positive number.");
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

//Retrieve username from localStorage
const username = localStorage.getItem('username');

// If a username is stored, display it, otherwise the default "Aqua Buddy" will display instead
if (username) {
    document.getElementById('username').textContent = username;
}
      }
  
      const newHeight = currentHeight + (input / 1000) * maxHeight;
  
      // Check if the new height exceeds the maximum allowed
      if (newHeight > maxHeight) {
        currentHeight = maxHeight;
        alert("The bottle is full!");
      } else {
        currentHeight = newHeight;
      }
  
      // Update water level
      waterContainer.style.height = `${currentHeight}px`;
    };
  });
  
