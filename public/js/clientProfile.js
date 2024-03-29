let title = document.getElementById("welcome_message");
let emailStored = localStorage.getItem("sharedemail");
let mmap = document.getElementById("map");
mmap.style =
  "width: 400px; height: 400px; display: none; position: relative; margin-top: -10%; margin-bottom: 20%;";

console.log("am iesit");
console.log(emailStored);
title.innerText = title.innerText + " " + emailStored;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function deleteCookie(name) {
  if (getCookie(name))
    document.cookie = `username=${name}; expires=Thu, 18 Dec 1999 12:00:00 UTC; path=/`;
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

console.log(parseJwt(getCookie("token")));
var feedBox = document.getElementById("feed-box");
var userid;
var usermail = parseJwt(getCookie("token")).email;
var coords;
var usr;
var role;

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

fetch(`http://localhost:4002/?table=users&email=${escapeHtml(usermail)}`)
  .then((response) => response.json())
  .then((data) => {
    userid = escapeHtml(data[0].id);
    usermail = escapeHtml(data[0].email);
    usr = escapeHtml(data[0].username);
    title.innerText = title.innerText + " " + usr;
    role = escapeHtml(data[0].role);
    if (role === "admin") {
      document.getElementsByClassName("setting")[1].style.display = "none";
    }
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
    let userInputData = "";
    changeFieldSend.innerText = "Confirm";
    changeFieldSend.onclick = async function (event) {
      userInputData = document.getElementById("new-username").value;
      console.log(userInputData);

      //begin update----------------------------------------
      let json = {
        username: userInputData,
        id: userid,
      };
      console.log(json);
      const settings = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      };
      try {
        const fetchResponse = await fetch(
          "http://localhost:4002/updateUsername",
          settings
        );
        const response = await fetchResponse.json();
        if (response === "updated user") {
          changeDiv.removeChild(changeDiv.firstChild);
          changeDiv.removeChild(changeDiv.firstChild);

          let succesMessage = document.createElement("p");
          succesMessage.style = "color: green;";
          succesMessage.innerText = "Changed with success";
          changeDiv.appendChild(succesMessage);
          userAndPic.removeChild(changeUsername);
          if (getCookie("token")) {
          }

          window.location.href = "/login.html";
        }
        console.log(response);
      } catch (err) {
        console.log(err);
      }
      //update done-----------------------------------------
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

    changeFieldSend.onclick = async function (event) {
      let json = {
        email: document.getElementById("new-mail").value,
        id: userid,
      };
      console.log(json);
      const settings = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      };
      try {
        const fetchResponse = await fetch(
          "http://localhost:4002/updateEmail",
          settings
        );
        const response = await fetchResponse.json();
        console.log("punem " + json.email);
        console.log("Avem:" + response.status);
        if (response.status === "updated user") {
          localStorage.setItem("sharedemail", json.email);
          console.log(response);
          changeDiv.removeChild(changeDiv.firstChild);
          changeDiv.removeChild(changeDiv.firstChild);
          let succesMessage = document.createElement("p");
          succesMessage.style = "color: green;";
          succesMessage.innerText = "Changed with success";
          changeDiv.appendChild(succesMessage);
          deleteCookie("token");
          window.location.href = "/login";
        } else if (response.status === "user not updated") {
          console.log(response);
          changeDiv.removeChild(changeDiv.firstChild);
          changeDiv.removeChild(changeDiv.firstChild);
          let succesMessage = document.createElement("p");
          succesMessage.style = "color: red;";
          succesMessage.innerText = "Email already exists";
          changeDiv.appendChild(succesMessage);
        }
      } catch (err) {
        console.log(err);
      }

      console.log(document.getElementById("new-mail").value);
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
    changePasswordConfirm.onclick = async function (event) {
      if (
        document.getElementById("new-password").value ===
        document.getElementById("new-password-confirm").value
      ) {
        let json = {
          oldpassword: document.getElementById("old-password").value,
          password: document.getElementById("new-password").value,
          id: userid,
        };
        console.log(json);
        const settings = {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(json),
        };
        try {
          const fetchResponse = await fetch(
            "http://localhost:4002/updatePassword",
            settings
          );
          const response = await fetchResponse.json();
          console.log("punem " + json.password);
          console.log("Avem:" + response.status);
          if (response.status === "updated user") {
            console.log(response);
            password.removeChild(password.lastChild);
            password.removeChild(password.lastChild);
            password.removeChild(password.lastChild);
            password.removeChild(password.lastChild);
            let succesMessage = document.createElement("p");
            succesMessage.style = "color: green;";
            succesMessage.innerText = "Changed with success";
            password.appendChild(succesMessage);
          } else if (response.status === "user not updated") {
            console.log(response);
            password.removeChild(password.lastChild);
            password.removeChild(password.lastChild);
            password.removeChild(password.lastChild);
            password.removeChild(password.lastChild);
            let succesMessage = document.createElement("p");
            succesMessage.style = "color: red;";
            succesMessage.innerText = "Password not updated";
            password.appendChild(succesMessage);
          } else if (response.status === "passwords don't match") {
            console.log(response);
            password.removeChild(password.lastChild);
            password.removeChild(password.lastChild);
            password.removeChild(password.lastChild);
            password.removeChild(password.lastChild);
            let succesMessage = document.createElement("p");
            succesMessage.style = "color: red;";
            succesMessage.innerText = "Old password is wrong";
            password.appendChild(succesMessage);
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log("no match!!!");
        changeDiv.removeChild(changeDiv.firstChild);
        changeDiv.removeChild(changeDiv.firstChild);
        let succesMessage = document.createElement("p");
        succesMessage.style = "color: red;";
        succesMessage.innerText = "Passwords don't match!";
        changeDiv.appendChild(succesMessage);
      }

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

  let roleDiv = document.createElement("div");
  roleDiv.style =
    "display: flex; flex-direction: row; align-items: flex-end; justify-content: flex-end;";
  let roleLabel = document.createElement("p");
  roleLabel.innerHTML = "Role: ";
  let roleText = document.createElement("p");
  roleText.innerHTML = `${role}`;
  roleColor = role === "admin" ? "blue" : "green";
  roleText.style = `color: ${roleColor};`;
  roleDiv.appendChild(roleLabel);
  roleDiv.appendChild(roleText);

  accountDetails.appendChild(username);
  accountDetails.appendChild(mail);
  accountDetails.appendChild(password);
  accountDetails.appendChild(useridText);
  accountDetails.appendChild(roleDiv);

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
            earthquakeOption.value = "Geo";
            earthquakeOption.innerText = "Geo";
            /*let floodOption = document.createElement("option");
            floodOption.value = "flood";
            floodOption.innerText = "Floods";*/
            let weatherOption = document.createElement("option");
            weatherOption.value = "Met";
            weatherOption.innerText = "Met";
            let safetyOption = document.createElement("option");
            safetyOption.value = "Safety";
            safetyOption.innerText = "Safety";
            let securityOption = document.createElement("option");
            securityOption.value = "Security";
            securityOption.innerText = "Security";
            let rescueOption = document.createElement("option");
            rescueOption.value = "Rescue";
            rescueOption.innerText = "Rescue";
            let fireOption = document.createElement("option");
            fireOption.value = "Fire";
            fireOption.innerText = "Fire";
            let healthOption = document.createElement("option");
            healthOption.value = "Health";
            healthOption.innerText = "Health";
            let envOption = document.createElement("option");
            envOption.value = "Env";
            envOption.innerText = "Env";
            let transportOption = document.createElement("option");
            transportOption.value = "Transport";
            transportOption.innerText = "Transport";
            let infraOption = document.createElement("option");
            infraOption.value = "Infra";
            infraOption.innerText = "Infra";
            let cbrneOption = document.createElement("option");
            cbrneOption.value = "CBRNE";
            cbrneOption.innerText = "CBRNE";
            let otherOption = document.createElement("option");
            otherOption.value = "Other";
            otherOption.innerText = "Other";

            if (eventtype === "Geo") {
              earthquakeOption.selected = true;
            } else if (eventtype === "Met") {
              weatherOption.selected = true;
            } else if (eventtype === "Safety") {
              safetyOption.selected = true;
            } else if (eventtype === "Security") {
              securityOption.selected = true;
            } else if (eventtype === "Fire") {
              fireOption.selected = true;
            } else if (eventtype === "Rescue") {
              rescueOption.selected = true;
            } else if (eventtype === "Health") {
              healthOption.selected = true;
            } else if (eventtype === "Env") {
              envOption.selected = true;
            } else if (eventtype === "Transport") {
              transportOption.selected = true;
            } else if (eventtype === "Infra") {
              infraOption.selected = true;
            } else if (eventtype === "CBRNE") {
              cbrneOption.selected = true;
            } else if (eventtype === "Other") {
              otherOption.selected = true;
            }
            eventtypeInput.appendChild(earthquakeOption);
            //eventtypeInput.appendChild(floodOption);
            eventtypeInput.appendChild(weatherOption);
            eventtypeInput.appendChild(safetyOption);
            eventtypeInput.appendChild(securityOption);
            eventtypeInput.appendChild(rescueOption);
            eventtypeInput.appendChild(fireOption);
            eventtypeInput.appendChild(healthOption);
            eventtypeInput.appendChild(envOption);
            eventtypeInput.appendChild(transportOption);
            eventtypeInput.appendChild(infraOption);
            eventtypeInput.appendChild(cbrneOption);
            eventtypeInput.appendChild(otherOption);

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
                  message.innerText = "Something went wrong";
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
      earthquakeOption.value = "Geo";
      earthquakeOption.innerText = "Geo";
      /*let floodOption = document.createElement("option");
      floodOption.value = "flood";
      floodOption.innerText = "Floods";*/
      let weatherOption = document.createElement("option");
      weatherOption.value = "Met";
      weatherOption.innerText = "Met";
      let safetyOption = document.createElement("option");
      safetyOption.value = "Safety";
      safetyOption.innerText = "Safety";
      let securityOption = document.createElement("option");
      securityOption.value = "Security";
      securityOption.innerText = "Security";
      let rescueOption = document.createElement("option");
      rescueOption.value = "Rescue";
      rescueOption.innerText = "Rescue";
      let fireOption = document.createElement("option");
      fireOption.value = "Fire";
      fireOption.innerText = "Fire";
      let healthOption = document.createElement("option");
      healthOption.value = "Health";
      healthOption.innerText = "Health";
      let envOption = document.createElement("option");
      envOption.value = "Env";
      envOption.innerText = "Env";
      let transportOption = document.createElement("option");
      transportOption.value = "Transport";
      transportOption.innerText = "Transport";
      let infraOption = document.createElement("option");
      infraOption.value = "Infra";
      infraOption.innerText = "Infra";
      let cbrneOption = document.createElement("option");
      cbrneOption.value = "CBRNE";
      cbrneOption.innerText = "CBRNE";
      let otherOption = document.createElement("option");
      otherOption.value = "Other";
      otherOption.innerText = "Other";

      eventtypeInput.appendChild(earthquakeOption);
      //eventtypeInput.appendChild(floodOption);
      eventtypeInput.appendChild(weatherOption);
      eventtypeInput.appendChild(safetyOption);
      eventtypeInput.appendChild(securityOption);
      eventtypeInput.appendChild(rescueOption);
      eventtypeInput.appendChild(fireOption);
      eventtypeInput.appendChild(healthOption);
      eventtypeInput.appendChild(envOption);
      eventtypeInput.appendChild(transportOption);
      eventtypeInput.appendChild(infraOption);
      eventtypeInput.appendChild(cbrneOption);
      eventtypeInput.appendChild(otherOption);

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
