let title = document.getElementById('welcome_message');
let sharedInfo = localStorage.getItem("sharedusername");

console.log("am iesit");
console.log(sharedInfo);
title.innerHTML = title.innerHTML + " " + sharedInfo;

var feedBox = document.getElementById("feed-box")

function accountInfo() {
    while (feedBox.firstChild) {
        feedBox.removeChild(feedBox.lastChild)
    }

    let accountDetails = document.createElement("div")

    let username = document.createElement("div")
    username.style = "display: flex; flex-direction: column; align-items: center; justify-content: center;"
    let usernamePic = document.createElement("img")
    usernamePic.src = "../images/userIcon.png"
    usernamePic.alt = "user icon stock"
    usernamePic.style = "width: 20px; height: auto;"
    let usernameInfo = document.createElement("p")
    usernameInfo.innerHTML = `Username: ${sharedInfo}`
    let userAndPic = document.createElement("div")
    userAndPic.style = "display: flex; flex-direction: row; align-items: center; justify-content: center;"
    userAndPic.appendChild(usernamePic)
    userAndPic.appendChild(usernameInfo)
    let changeUsername = document.createElement("button")
    changeUsername.innerHTML = "Change"
    changeUsername.onclick = function (event) {
        let changeDiv = document.createElement("div")
        let changeField = document.createElement("input")
        changeField.type = "text"
        changeField.placeholder = "Type new username..."
        changeField.id = "new-username"
        let changeFieldSend = document.createElement("button")
        changeFieldSend.innerHTML = "Confirm"
        changeFieldSend.onclick = function (event) {
            console.log(document.getElementById("new-username").value)
            changeDiv.removeChild(changeDiv.firstChild)
            changeDiv.removeChild(changeDiv.firstChild)
            let succesMessage = document.createElement("p")
            succesMessage.style = "color: green;"
            succesMessage.innerHTML = "Changed with success"
            changeDiv.appendChild(succesMessage)
        }
        changeDiv.appendChild(changeField)
        changeDiv.appendChild(changeFieldSend)
        username.appendChild(changeDiv)
    }
    userAndPic.appendChild(changeUsername)
    username.append(userAndPic)

    let mail = document.createElement("div")
    mail.style = "display: flex; flex-direction: column; align-items: center; justify-content: flex-start;"
    let mailAndPic = document.createElement("div")
    mailAndPic.style = "display: flex; flex-direction: row; align-items: center; justify-content: flex-start;"
    let mailPic = document.createElement("img")
    mailPic.src = "../images/mailIcon.png"
    mailPic.alt = "mail icon stock"
    mailPic.style = "width: 20px; height: auto;"
    let mailInfo = document.createElement("p")
    mailInfo.innerHTML = `Mail: to be fetched`
    mailAndPic.appendChild(mailPic)
    mailAndPic.appendChild(mailInfo)
    let changeMail = document.createElement("button")
    let changeMailClicked = document.createAttribute("clicked")
    changeMailClicked.value = "false"
    changeMail.setAttribute(changeMailClicked)
    changeMail.innerHTML = "Change"
    changeMail.onclick = function (event) {
        let changeDiv = document.createElement("div")
        let changeField = document.createElement("input")
        changeField.type = "text"
        changeField.placeholder = "Type new mail..."
        changeField.id = "new-mail"
        let changeFieldSend = document.createElement("button")
        changeFieldSend.innerHTML = "Confirm"
        changeFieldSend.onclick = function (event) {
            console.log(document.getElementById("new-mail").value)
            changeDiv.removeChild(changeDiv.firstChild)
            changeDiv.removeChild(changeDiv.firstChild)
            let succesMessage = document.createElement("p")
            succesMessage.style = "color: green;"
            succesMessage.innerHTML = "Changed with success"
            changeDiv.appendChild(succesMessage)
        }
        changeDiv.appendChild(changeField)
        changeDiv.appendChild(changeFieldSend)
        mail.appendChild(changeDiv)
    }
    mailAndPic.appendChild(changeMail)
    mail.append(mailAndPic)

    let password = document.createElement("div")
    password.style = "display: flex; flex-direction: column; align-items: center; justify-content: flex-start;"
    let changePasswordDiv = document.createElement("div")
    changePasswordDiv.style = "display: flex; flex-direction: row; align-items: center; justify-content: flex-start;"
    let passwordText = document.createElement("p")
    passwordText.innerHTML = "Password:"
    let changePassword = document.createElement("button")
    changePassword.innerHTML = "Change password"
    changePassword.onclick = function (event) {
        let oldPassword = document.createElement("input")
        oldPassword.placeholder = "Type old password..."
        oldPassword.type = "text"
        oldPassword.id = "old-password"
        let newPassword = document.createElement("input")
        newPassword.placeholder = "Type new password..."
        newPassword.type = "text"
        newPassword.id = "new-password"
        let newPasswordConfirm = document.createElement("input")
        newPasswordConfirm.placeholder = "Confirm new password..."
        newPasswordConfirm.type = "text"
        newPasswordConfirm.id = "new-password-confirm"
        let changePasswordConfirm = document.createElement("button")
        changePasswordConfirm.innerHTML = "Confirm changes"
        password.appendChild(oldPassword)
        password.appendChild(newPassword)
        password.appendChild(newPasswordConfirm)
        password.appendChild(changePasswordConfirm)
        changePasswordConfirm.onclick = function(event)
        {
            console.log(document.getElementById("old-password").value)
            console.log(document.getElementById("new-password").value)
            console.log(document.getElementById("new-password-confirm").value)
            password.removeChild(password.lastChild)
            password.removeChild(password.lastChild)
            password.removeChild(password.lastChild)
            password.removeChild(password.lastChild)
            let succesMessage = document.createElement("p")
            succesMessage.style = "color: green;"
            succesMessage.innerHTML = "Changed with success"
            password.appendChild(succesMessage)
        }

    }
    changePasswordDiv.appendChild(passwordText)
    changePasswordDiv.appendChild(changePassword)
    password.appendChild(changePasswordDiv)


    accountDetails.appendChild(username)
    accountDetails.appendChild(mail)
    accountDetails.appendChild(password)

    feedBox.append(accountDetails)
}


function addedEvents() {
    while (feedBox.firstChild) {
        feedBox.removeChild(feedBox.lastChild)
    }

    let response = document.createElement("div")

    let line1 = document.createElement("p")
    line1.innerHTML = `These are my added events!`

    response.appendChild(line1)

    feedBox.append(response)
}