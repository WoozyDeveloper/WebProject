let title = document.getElementById("welcome_message");
let usernameStored = localStorage.getItem("sharedusername");

console.log("am iesit");
console.log(usernameStored);
title.innerHTML = title.innerHTML + " " + usernameStored;

var feedBox = document.getElementById("feed-box");
var userid;
var usermail;

fetch(`http://localhost:4002/?table=users&username=${usernameStored}`)
  .then((response) => response.json())
  .then((data) => {
    userid = data[0].id;
    usermail = data[0].email;
  });

function accountInfo() {
  while (feedBox.firstChild) {
    feedBox.removeChild(feedBox.lastChild);
  }

  let accountDetails = document.createElement("div");

  let username = document.createElement("div");
  username.style =
    "display: flex; flex-direction: column; align-items: flex-end; justify-content: center;";
  let usernamePic = document.createElement("img");
  usernamePic.src = "../images/userIcon.png";
  usernamePic.alt = "user icon stock";
  usernamePic.style = "width: 20px; height: auto;";
  let usernameInfo = document.createElement("p");
  usernameInfo.innerHTML = `Username: ${usernameStored}`;
  let userAndPic = document.createElement("div");
  userAndPic.style =
    "display: flex; flex-direction: row; align-items: center; justify-content: center;";
  userAndPic.appendChild(usernamePic);
  userAndPic.appendChild(usernameInfo);
  let changeUsername = document.createElement("button");
  changeUsername.innerHTML = "Change";
  changeUsername.onclick = function (event) {
    changeUsername.style.display = "none";
    let changeDiv = document.createElement("div");
    let changeField = document.createElement("input");
    changeField.type = "text";
    changeField.placeholder = "Type new username...";
    changeField.id = "new-username";
    let changeFieldSend = document.createElement("button");
    changeFieldSend.innerHTML = "Confirm";
    changeFieldSend.onclick = function (event) {
      console.log(document.getElementById("new-username").value);
      changeDiv.removeChild(changeDiv.firstChild);
      changeDiv.removeChild(changeDiv.firstChild);
      let succesMessage = document.createElement("p");
      succesMessage.style = "color: green;";
      succesMessage.innerHTML = "Changed with success";
      changeDiv.appendChild(succesMessage);
      userAndPic.removeChild(changeUsername);
    };
    changeDiv.appendChild(changeField);
    changeDiv.appendChild(changeFieldSend);
    username.appendChild(changeDiv);
  };
  userAndPic.appendChild(changeUsername);
  username.append(userAndPic);

  let mail = document.createElement("div");
  mail.style =
    "display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-start;";
  let mailAndPic = document.createElement("div");
  mailAndPic.style =
    "display: flex; flex-direction: row; align-items: center; justify-content: flex-start;";
  let mailPic = document.createElement("img");
  mailPic.src = "../images/mailIcon.png";
  mailPic.alt = "mail icon stock";
  mailPic.style = "width: 20px; height: auto;";
  let mailInfo = document.createElement("p");
  mailInfo.innerHTML = `Mail: ${usermail}`;
  mailAndPic.appendChild(mailPic);
  mailAndPic.appendChild(mailInfo);
  let changeMail = document.createElement("button");
  changeMail.innerHTML = "Change";
  changeMail.onclick = function (event) {
    changeMail.style.display = "none";
    let changeDiv = document.createElement("div");
    let changeField = document.createElement("input");
    changeField.type = "text";
    changeField.placeholder = "Type new mail...";
    changeField.id = "new-mail";
    let changeFieldSend = document.createElement("button");
    changeFieldSend.innerHTML = "Confirm";
    changeFieldSend.onclick = function (event) {
      console.log(document.getElementById("new-mail").value);
      changeDiv.removeChild(changeDiv.firstChild);
      changeDiv.removeChild(changeDiv.firstChild);
      let succesMessage = document.createElement("p");
      succesMessage.style = "color: green;";
      succesMessage.innerHTML = "Changed with success";
      changeDiv.appendChild(succesMessage);
    };
    changeDiv.appendChild(changeField);
    changeDiv.appendChild(changeFieldSend);
    mail.appendChild(changeDiv);
  };
  mailAndPic.appendChild(changeMail);
  mail.append(mailAndPic);

  let password = document.createElement("div");
  password.style =
    "display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-start;";
  let changePasswordDiv = document.createElement("div");
  changePasswordDiv.style =
    "display: flex; flex-direction: row; align-items: center; justify-content: flex-start;";
  let passwordText = document.createElement("p");
  passwordText.innerHTML = "Password:";
  let changePassword = document.createElement("button");
  changePassword.innerHTML = "Change password";
  changePassword.onclick = function (event) {
    changePassword.style.display = "none";
    let oldPassword = document.createElement("input");
    oldPassword.placeholder = "Type old password...";
    oldPassword.type = "text";
    oldPassword.id = "old-password";
    let newPassword = document.createElement("input");
    newPassword.placeholder = "Type new password...";
    newPassword.type = "text";
    newPassword.id = "new-password";
    let newPasswordConfirm = document.createElement("input");
    newPasswordConfirm.placeholder = "Confirm new password...";
    newPasswordConfirm.type = "text";
    newPasswordConfirm.id = "new-password-confirm";
    let changePasswordConfirm = document.createElement("button");
    changePasswordConfirm.innerHTML = "Confirm changes";
    password.appendChild(oldPassword);
    password.appendChild(newPassword);
    password.appendChild(newPasswordConfirm);
    password.appendChild(changePasswordConfirm);
    changePasswordConfirm.onclick = function (event) {
      console.log(document.getElementById("old-password").value);
      console.log(document.getElementById("new-password").value);
      console.log(document.getElementById("new-password-confirm").value);
      password.removeChild(password.lastChild);
      password.removeChild(password.lastChild);
      password.removeChild(password.lastChild);
      password.removeChild(password.lastChild);
      let succesMessage = document.createElement("p");
      succesMessage.style = "color: green;";
      succesMessage.innerHTML = "Changed with success";
      password.appendChild(succesMessage);
    };
  };
  changePasswordDiv.appendChild(passwordText);
  changePasswordDiv.appendChild(changePassword);
  password.appendChild(changePasswordDiv);

  let useridText = document.createElement("p");
  useridText.style =
    "display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-start;";
  useridText.innerHTML = `User id: ${userid}`;

  accountDetails.appendChild(username);
  accountDetails.appendChild(mail);
  accountDetails.appendChild(password);
  accountDetails.appendChild(useridText);

  feedBox.append(accountDetails);
}

function addedEvents() {
  while (feedBox.firstChild) {
    feedBox.removeChild(feedBox.lastChild);
  }

  let response = document.createElement("div");

  let line1 = document.createElement("p");
  line1.innerHTML = `These are my added events!`;

  response.appendChild(line1);

  feedBox.append(response);
}

function preferences() {
  let removalPromise = new Promise(function (resolve, reject) {
    while (feedBox.firstChild) {
      feedBox.removeChild(feedBox.lastChild);
    }
    resolve();
  });

  let locations = document.createElement("div");
  locations.style =
    "display: flex; flex-direction: column; align-items: flex-start; justify-content: center;";

  removalPromise.then(
    fetch(`http://localhost:4002/?table=UserPreferences&userid=${userid}`)
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          let userid = data[i].userid;
          let location = data[i].location;
          let eventtype = data[i].eventtype;
          let latitude = data[i].latitude;
          let longitude = data[i].longitude;
          let notificationmethod = data[i].notificationmethod;

          let locationDiv = document.createElement("div");
          locationDiv.style =
            "display: flex; flex-direction: column; align-items: flex-start; justify-content: center;";

          let locationNr = document.createElement("h1");
          locationNr.innerHTML = `Location number: ${i + 1}`;
          let locationNode = document.createElement("p");
          locationNode.innerHTML = `Location: ${location}`;
          let eventtypeNode = document.createElement("p");
          eventtypeNode.innerHTML = `Event type: ${eventtype}`;
          let latNode = document.createElement("p");
          latNode.innerHTML = `Latitude: ${latitude}`;
          let longNode = document.createElement("p");
          longNode.innerHTML = `Longitude: ${longitude}`;
          let notificationmethodNode = document.createElement("p");
          notificationmethodNode.innerHTML = `Notification method: ${notificationmethod}`;
          let modifyButton = document.createElement("button");
          modifyButton.innerHTML = "Modify";
          modifyButton.onclick = function (response) {
            let currentIndex = Array.from(locations.children).indexOf(
              locationDiv
            );
            locations.removeChild(locationDiv);

            let form = document.createElement("form");
            form.style =
              "display: flex; flex-direction: column; align-items: center; justify-content: center;";

            let locationInputDiv = document.createElement("div");
            locationInputDiv.style =
              "display: flex; flex-direction: row; align-items: center; justify-content: center;";
            let locationInput = document.createElement("input");
            locationInput.type = "text";
            locationInput.id = "location-input";
            locationInput.value = location;
            let locationInputText = document.createElement("p");
            locationInputText.innerHTML = "Location: ";

            locationInputDiv.appendChild(locationInputText);
            locationInputDiv.appendChild(locationInput);
            form.appendChild(locationInputDiv);

            let eventtypeInputDiv = document.createElement("div");
            eventtypeInputDiv.style =
              "display: flex; flex-direction: row; align-items: center; justify-content: center;";
            let eventtypeInput = document.createElement("select");
            eventtypeInput.id = "eventtype-input";
            eventtypeInput.value = eventtype;
            let eventtypeInputText = document.createElement("p");
            eventtypeInputText.innerHTML = "Event type: ";

            let earthquakeOption = document.createElement("option");
            earthquakeOption.value = "earthquake";
            earthquakeOption.innerHTML = "Earthquakes";
            let floodOption = document.createElement("option");
            floodOption.value = "flood";
            floodOption.innerHTML = "Floods";
            let weatherOption = document.createElement("option");
            weatherOption.value = "weather";
            weatherOption.innerHTML = "Weather";

            eventtypeInput.appendChild(earthquakeOption);
            eventtypeInput.appendChild(floodOption);
            eventtypeInput.appendChild(weatherOption);

            eventtypeInputDiv.appendChild(eventtypeInputText);
            eventtypeInputDiv.appendChild(eventtypeInput);
            form.appendChild(eventtypeInputDiv);

            let coordDiv = document.createElement("div");
            coordDiv.style =
              "display: flex; flex-direction: row; align-items: center; justify-content: center;";
            let coordButton = document.createElement("button");
            coordButton.innerHTML = "Click to pick coordinates";
            let coordText = document.createElement("p");
            coordText.innerHTML = "Location: ";

            coordDiv.appendChild(coordText);
            coordDiv.appendChild(coordButton);
            form.append(coordDiv);

            let submit = document.createElement("button");
            submit.innerHTML = "Submit";
            form.appendChild(submit);

            locations.insertBefore(
              locationNr,
              locations.children[currentIndex]
            ); //insereaza nr locatiei
            locations.insertBefore(form, locations.children[currentIndex + 1]); //insereaza formul dedesubt
          };
          locationDiv.appendChild(locationNr);
          locationDiv.appendChild(locationNode);
          locationDiv.appendChild(eventtypeNode);
          locationDiv.appendChild(latNode);
          locationDiv.appendChild(longNode);
          locationDiv.appendChild(notificationmethodNode);
          locationDiv.appendChild(modifyButton);

          locations.append(locationDiv);
        }
        feedBox.append(locations);
      })
  );
}
