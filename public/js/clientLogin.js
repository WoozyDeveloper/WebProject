const crypto = require("crypto-js");
const key = Buffer.from(
  "xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=",
  "base64"
);
const iv = Buffer.from("81dFxOpX7BPG1UpZQPcS6w==", "base64");

function encrypt_token(data) {
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encryptedData = cipher.update(data, "utf8", "base64");
  return encryptedData;
}

function decrypt_token(data) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decripted = decipher.update(data, "base64", "utf8");
  return decripted;
}

document.forms[0].onsubmit = async (e) => {
  e.preventDefault();
  console.log("TESTTT");
  const data = {
    email: document.getElementById("email").value,

    password: document.getElementById("password").value,
  };

  console.log(data);
  var sharedInfo = data.username;
  localStorage.setItem("sharedusername", sharedInfo);

  const encryption = encrypt_token(data);
  console.log(encryption);
  const settings = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },

    body: JSON.stringify(encyption),
  };
  try {
    const fetchResponse = await fetch("http://localhost:4000/login", settings);
    const response = await fetchResponse.json();
    console.log(response);

    if (response.status === "existent user") {
      console.log(sharedInfo);
      window.location.href = "http://localhost:3000/pages/user.html";
    } else {
    }
  } catch (err) {
    console.log(err);
  }
};