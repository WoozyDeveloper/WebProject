let title = document.getElementById("welcome_message");
let emailStored = localStorage.getItem("sharedemail");
let mmap = document.getElementById("map");
mmap.style =
  "width: 400px; height: 400px; display: none; position: relative; margin-top: -10%; margin-bottom: 20%;";

console.log("am iesit");
console.log(emailStored);
title.innerText = title.innerText + " " + emailStored;

var feedBox = document.getElementById("feed-box");
var userid;
var usermail;
var coords;
var usr;

function escapeHtml(text) {
  var map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return String(text).replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

fetch(
  `http://localhost:4002/?table=users&email=${escapeHtml(emailStored)}`
)
  .then((response) => response.json())
  .then((data) => {
    userid = escapeHtml(data[0].id);
    usermail = escapeHtml(data[0].email);
    usr = escapeHtml(data[0].username)
  });

function accountInfo() {
  while (feedBox.firstChild) {
    feedBox.removeChild(feedBox.lastChild);
  }

  addStyle("accountinfo");

  let accountDetails = document.createElement("div");

  let username = document.createElement("div");
  username.style =
    "display: flex; flex-direction: column; align-items: flex-end; justify-content: center;";
  let usernamePic = document.createElement("img");
  usernamePic.src = "../images/userIcon.png";
  usernamePic.alt = "user icon stock";
  usernamePic.style = "width: 20px; height: auto;";
  let usernameInfo = document.createElement("p");
  usernameInfo.innerText = `Username: ${escapeHtml(usr)}`;
  let userAndPic = document.createElement("div");
  userAndPic.style =
    "display: flex; flex-direction: row; align-items: center; justify-content: center;";
  userAndPic.appendChild(usernamePic);
  userAndPic.appendChild(usernameInfo);
  let changeUsername = document.createElement("button");
  changeUsername.innerText = "Change";
  changeUsername.onclick = function (event) {
    changeUsername.style.display = "none";
    let changeDiv = document.createElement("div");
    let changeField = document.createElement("input");
    changeField.type = "text";
    changeField.placeholder = "Type new username...";
    changeField.id = "new-username";
    let changeFieldSend = document.createElement("button");
    changeFieldSend.innerText = "Confirm";
    changeFieldSend.onclick = function (event) {
      console.log(document.getElementById("new-username").value);
      changeDiv.removeChild(changeDiv.firstChild);
      changeDiv.removeChild(changeDiv.firstChild);
      let succesMessage = document.createElement("p");
      succesMessage.style = "color: green;";
      succesMessage.innerText = "Changed with success";
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
  mailInfo.innerText = `Mail: ${escapeHtml(usermail)}`;
  mailAndPic.appendChild(mailPic);
  mailAndPic.appendChild(mailInfo);
  let changeMail = document.createElement("button");
  changeMail.innerText = "Change";
  changeMail.onclick = function (event) {
    changeMail.style.display = "none";
    let changeDiv = document.createElement("div");
    let changeField = document.createElement("input");
    changeField.type = "text";
    changeField.placeholder = "Type new mail...";
    changeField.id = "new-mail";
    let changeFieldSend = document.createElement("button");
    changeFieldSend.innerText = "Confirm";
    changeFieldSend.onclick = function (event) {
      console.log(document.getElementById("new-mail").value);
      changeDiv.removeChild(changeDiv.firstChild);
      changeDiv.removeChild(changeDiv.firstChild);
      let succesMessage = document.createElement("p");
      succesMessage.style = "color: green;";
      succesMessage.innerText = "Changed with success";
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
  passwordText.innerText = "Password:";
  let changePassword = document.createElement("button");
  changePassword.innerText = "Change password";
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
    changePasswordConfirm.innerText = "Confirm changes";
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
      succesMessage.innerText = "Changed with success";
      password.appendChild(succesMessage);
    };
  };
  changePasswordDiv.appendChild(passwordText);
  changePasswordDiv.appendChild(changePassword);
  password.appendChild(changePasswordDiv);

  let useridText = document.createElement("p");
  useridText.style =
    "display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-start;";
  useridText.innerText = `User id: ${escapeHtml(userid)}`;

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

  addStyle("event");

  let response = document.createElement("div");

  let line1 = document.createElement("p");
  line1.innerText = `These are my added events!`;

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

  addStyle("preference");

  let locations = document.createElement("div");
  locations.style =
    "display: flex; flex-direction: column; align-items: flex-start; justify-content: center;";

  removalPromise.then(
    fetch(
      `http://localhost:4002/?table=UserPreferences&userid=${escapeHtml(
        userid
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          let preferenceid = escapeHtml(data[i].preferenceid);
          let location = escapeHtml(data[i].location);
          let eventtype = escapeHtml(data[i].eventtype);
          let latitude = escapeHtml(data[i].latitude);
          let longitude = escapeHtml(data[i].longitude);
          let notificationmethod = escapeHtml(data[i].notificationmethod);
          let eventid = escapeHtml(data[i].eventid);

          let locationDiv = document.createElement("div");
          locationDiv.style =
            "display: flex; flex-direction: column; align-items: flex-start; justify-content: center;";

          let locationNr = document.createElement("h1");
          locationNr.innerText = `Location number: ${i + 1}`;
          let locationNode = document.createElement("p");
          locationNode.innerText = `Location: ${location}`;
          let eventtypeNode = document.createElement("p");
          eventtypeNode.innerText = `Event type: ${eventtype}`;
          let latNode = document.createElement("p");
          latNode.innerText = `Latitude: ${latitude}`;
          let longNode = document.createElement("p");
          longNode.innerText = `Longitude: ${longitude}`;
          let notificationmethodNode = document.createElement("p");
          notificationmethodNode.innerText = `Notification method: ${notificationmethod}`;
          let modifyButton = document.createElement("button");
          modifyButton.innerText = "Modify";
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
            locationInputText.innerText = "Location: ";

            locationInputDiv.appendChild(locationInputText);
            locationInputDiv.appendChild(locationInput);
            form.appendChild(locationInputDiv);

            let eventtypeInputDiv = document.createElement("div");
            eventtypeInputDiv.style =
              "display: flex; flex-direction: row; align-items: center; justify-content: center;";
            let eventtypeInput = document.createElement("select");
            eventtypeInput.id = "eventtype-input";
            let eventtypeInputText = document.createElement("p");
            eventtypeInputText.innerText = "Event type: ";

            let earthquakeOption = document.createElement("option");
            earthquakeOption.value = "earthquake";
            earthquakeOption.innerText = "Earthquakes";
            let floodOption = document.createElement("option");
            floodOption.value = "flood";
            floodOption.innerText = "Floods";
            let weatherOption = document.createElement("option");
            weatherOption.value = "weather";
            weatherOption.innerText = "Weather";

            if (eventtype === "earthquake") {
              earthquakeOption.selected = true;
            } else if (eventtype === "flood") {
              floodOption.selected = true;
            } else if (eventtype === "weather") {
              weatherOption.selected = true;
            }
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
            coordButton.innerText = "Click to pick coordinates";
            let coordText = document.createElement("p");
            coordText.innerText = "Location: ";
            coordButton.onclick = function (response) {
              mmap.style.display = "block";
              coordButton.style.display = "none";

              let latDisplayDiv = document.createElement("div");
              latDisplayDiv.style =
                "display: flex; flex-direction: row; align-items: center; justify-content: center;";
              let latDisplay = document.createElement("p");
              latDisplay.innerText = "Latitude: ";
              let latDisplayVal = document.createElement("input");
              latDisplayVal.name = "lat-display-val";
              latDisplayVal.id = "lat-display-val";
              latDisplayVal.type = "number";
              latDisplayVal.step = "any";
              latDisplayVal.value = latitude;
              latDisplayDiv.appendChild(latDisplay);
              latDisplayDiv.appendChild(latDisplayVal);

              let longDisplayDiv = document.createElement("div");
              longDisplayDiv.style =
                "display: flex; flex-direction: row; align-items: center; justify-content: center;";
              let longDisplay = document.createElement("p");
              longDisplay.innerText = "Longitude: ";
              let longDisplayVal = document.createElement("input");
              longDisplayVal.name = "long-display-val";
              longDisplayVal.id = "long-display-val";
              longDisplayVal.type = "number";
              longDisplayVal.step = "any";
              longDisplayVal.value = longitude;
              longDisplayDiv.appendChild(longDisplay);
              longDisplayDiv.appendChild(longDisplayVal);

              form.insertBefore(mmap, notifDiv);
              form.insertBefore(latDisplayDiv, notifDiv);
              form.insertBefore(longDisplayDiv, notifDiv);
            };

            coordDiv.appendChild(coordText);
            coordDiv.appendChild(coordButton);
            form.append(coordDiv);

            let notifDiv = document.createElement("div");
            notifDiv.style =
              "display: flex; flex-direction: row; align-items: center; justify-content: center;";
            let notifLabel = document.createElement("p");
            notifLabel.innerText = "Notification method:";
            let notifSelect = document.createElement("select");
            notifSelect.value = notificationmethod;
            notifSelect.id = "notif-select";

            let emailOption = document.createElement("option");
            emailOption.value = "email";
            emailOption.innerText = "E-mail";
            let smsOption = document.createElement("option");
            smsOption.value = "sms";
            smsOption.innerText = "SMS";

            if (notificationmethod === "sms") {
              smsOption.selected = true;
            } else if (notificationmethod === "email") {
              emailOption.selected = true;
            }

            notifSelect.appendChild(emailOption);
            notifSelect.appendChild(smsOption);

            notifDiv.appendChild(notifLabel);
            notifDiv.appendChild(notifSelect);

            form.append(notifDiv);

            let submit = document.createElement("button");
            submit.innerText = "Submit";
            form.appendChild(submit);

            locations.insertBefore(
              locationNr,
              locations.children[currentIndex]
            ); //insereaza nr locatiei
            locations.insertBefore(form, locations.children[currentIndex + 1]); //insereaza formul dedesubt

            form.addEventListener("submit", function (event) {
              event.preventDefault();
            });
            submit.onclick = async function (event) {
              console.log(form);
              let latitude;
              let longitude;
              if (document.getElementById("lat-display-val") === null) {
                // elementul asta s-ar putea sa nu fie creat
                latitude = latitude;
              } else
                latitude = document.getElementById("lat-display-val").value;
              if (document.getElementById("lat-display-val") === null) {
                // elementul asta s-ar putea sa nu fie creat
                longitude = longitude;
              } else
                longitude = document.getElementById("long-display-val").value;
              let location = document.getElementById("location-input").value;
              let eventtype = document.getElementById("eventtype-input").value;
              let notificationmethod =
                document.getElementById("notif-select").value;

              const data = {
                table: "UserPreferences",
                operation: "replace",
                location: location,
                eventtype: eventtype,
                latitude: latitude,
                longitude: longitude,
                preferenceid: preferenceid,
                notificationmethod: notificationmethod,
              };

              const settings = {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: JSON.stringify(data),
              };

              console.log("intru sa fac post macar?");
              try {
                const fetchResponse = await fetch(
                  "http://localhost:4002",
                  settings
                );
                const response = await fetchResponse.json();
                console.log(response);

                form.removeChild(form.lastChild); //remove submit
                let message = document.createElement("p");
                if (response.executed === "yes") {
                  message.innerText = "Changes applied successfully";
                  message.style = "color: green;";
                } else {
                  message.innerText = "You fucked up"; //??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                  message.style = "color: red;";
                }
                form.appendChild(message);
              } catch (err) {
                console.log(err);
              }
            };
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

function setCoordinates(coordinates) {
  document.getElementById("long-display-val").value = coordinates.lng;
  document.getElementById("lat-display-val").value = coordinates.lat;
  console.log(coordinates);
}

function addStyle(what) {
  let addBox = document.getElementById("add-box");
  while (addBox.firstChild) {
    addBox.removeChild(addBox.lastChild);
  }
  if (what === "preference") {
    let addButton = document.createElement("button");
    addButton.innerText = "Add preference";

    addButton.onclick = function (event) {
      addBox.removeChild(addButton);

      let form = document.createElement("form");
      form.style =
        "display: flex; flex-direction: column; align-items: center; justify-content: center;";

      let locationInputDiv = document.createElement("div");
      locationInputDiv.style =
        "display: flex; flex-direction: row; align-items: center; justify-content: center;";
      let locationInput = document.createElement("input");
      locationInput.type = "text";
      locationInput.id = "location-input";
      let locationInputText = document.createElement("p");
      locationInputText.innerText = "Location: ";

      locationInputDiv.appendChild(locationInputText);
      locationInputDiv.appendChild(locationInput);
      form.appendChild(locationInputDiv);

      let eventtypeInputDiv = document.createElement("div");
      eventtypeInputDiv.style =
        "display: flex; flex-direction: row; align-items: center; justify-content: center;";
      let eventtypeInput = document.createElement("select");
      eventtypeInput.id = "eventtype-input";
      let eventtypeInputText = document.createElement("p");
      eventtypeInputText.innerText = "Event type: ";

      let earthquakeOption = document.createElement("option");
      earthquakeOption.value = "earthquake";
      earthquakeOption.innerText = "Earthquakes";
      let floodOption = document.createElement("option");
      floodOption.value = "flood";
      floodOption.innerText = "Floods";
      let weatherOption = document.createElement("option");
      weatherOption.value = "weather";
      weatherOption.innerText = "Weather";
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
      coordButton.innerText = "Click to pick coordinates";
      let coordText = document.createElement("p");
      coordText.innerText = "Location: ";
      coordButton.onclick = function (response) {
        mmap.style.display = "block";
        coordButton.style.display = "none";

        let latDisplayDiv = document.createElement("div");
        latDisplayDiv.style =
          "display: flex; flex-direction: row; align-items: center; justify-content: center;";
        let latDisplay = document.createElement("p");
        latDisplay.innerText = "Latitude: ";
        let latDisplayVal = document.createElement("input");
        latDisplayVal.name = "lat-display-val";
        latDisplayVal.id = "lat-display-val";
        latDisplayVal.type = "number";
        latDisplayVal.step = "any";
        latDisplayDiv.appendChild(latDisplay);
        latDisplayDiv.appendChild(latDisplayVal);

        let longDisplayDiv = document.createElement("div");
        longDisplayDiv.style =
          "display: flex; flex-direction: row; align-items: center; justify-content: center;";
        let longDisplay = document.createElement("p");
        longDisplay.innerText = "Longitude: ";
        let longDisplayVal = document.createElement("input");
        longDisplayVal.name = "long-display-val";
        longDisplayVal.id = "long-display-val";
        longDisplayVal.type = "number";
        longDisplayVal.step = "any";
        longDisplayDiv.appendChild(longDisplay);
        longDisplayDiv.appendChild(longDisplayVal);

        form.insertBefore(mmap, notifDiv);
        form.insertBefore(latDisplayDiv, notifDiv);
        form.insertBefore(longDisplayDiv, notifDiv);
      };

      coordDiv.appendChild(coordText);
      coordDiv.appendChild(coordButton);
      form.append(coordDiv);

      let notifDiv = document.createElement("div");
      notifDiv.style =
        "display: flex; flex-direction: row; align-items: center; justify-content: center;";
      let notifLabel = document.createElement("p");
      notifLabel.innerText = "Notification method:";
      let notifSelect = document.createElement("select");
      notifSelect.id = "notif-select";

      let emailOption = document.createElement("option");
      emailOption.value = "email";
      emailOption.innerText = "E-mail";
      let smsOption = document.createElement("option");
      smsOption.value = "sms";
      smsOption.innerText = "SMS";

      notifSelect.appendChild(emailOption);
      notifSelect.appendChild(smsOption);

      notifDiv.appendChild(notifLabel);
      notifDiv.appendChild(notifSelect);

      form.append(notifDiv);

      let submit = document.createElement("button");
      submit.innerText = "Submit";
      form.appendChild(submit);

      addBox.append(form);

      form.addEventListener("submit", function (event) {
        event.preventDefault();
      });
      submit.onclick = async function (event) {
        console.log(form);
        let latitude;
        let longitude;
        if (document.getElementById("lat-display-val") === null) {
          // elementul asta s-ar putea sa nu fie creat
          latitude = latitude;
        } else latitude = document.getElementById("lat-display-val").value;
        if (document.getElementById("lat-display-val") === null) {
          // elementul asta s-ar putea sa nu fie creat
          longitude = longitude;
        } else longitude = document.getElementById("long-display-val").value;
        let location = document.getElementById("location-input").value;
        let eventtype = document.getElementById("eventtype-input").value;
        let notificationmethod = document.getElementById("notif-select").value;

        const data = {
          table: "UserPreferences",
          operation: "add",
          userid: userid,
          location: location,
          eventtype: eventtype,
          latitude: latitude,
          longitude: longitude,
          notificationmethod: notificationmethod,
        };

        const settings = {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: JSON.stringify(data),
        };

        console.log("intru sa fac post macar?");
        try {
          const fetchResponse = await fetch("http://localhost:4002", settings);
          const response = await fetchResponse.json();
          console.log(response);

          form.removeChild(form.lastChild); //remove submit
          let message = document.createElement("p");
          if (response.executed === "yes") {
            message.innerText = "Successfully added";
            message.style = "color: green;";
          } else {
            message.innerText = "You fucked up";
            message.style = "color: red;";
          }
          form.appendChild(message);
        } catch (err) {
          console.log(err);
        }
      };
    };

    addBox.appendChild(addButton);
  } else if (what === "event") {
    let addButton = document.createElement("button");
    addButton.innerText = "Add event";

    addBox.appendChild(addButton);
  } else if (what === "accountinfo") {
  }
}
