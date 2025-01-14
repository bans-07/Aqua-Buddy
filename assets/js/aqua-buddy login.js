let redirectURL = '';

const redirectPage = function (url) {
    redirectURL = url;
    location.assign(url);
    };
    
document.getElementById("submit-button")
document.addEventListener("click", function (event) {
   
    event.preventDefault();

    // login functions
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let usernameError = document.getElementById("username-error");
    let passwordError = document.getElementById("password-error");

    //Reset if incorrect input
    usernameError.innerHTML = "";
    passwordError.innerHTML = "";

    if (username === "" || username === null) {
      usernameError.innerHTML = "Username is required";
    }
    if (password === "" || password === null) {
      passwordError.innerHTML = "Password is required";
    }

    // If both fields are filled, redirect to the main page.
    if (username !== "" && password !== "") {
      redirectPage('index.html');  //needs to be updated to correct path when ready. You can use your relative path to the file to use it currently.
    }
  });
