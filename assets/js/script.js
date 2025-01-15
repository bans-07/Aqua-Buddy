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
  