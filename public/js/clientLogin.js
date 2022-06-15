document.forms[0].onsubmit = async (e) => {
  e.preventDefault();
  console.log("TESTTT");
  const data = {
    email: document.getElementById("email").value,

    password: document.getElementById("password").value,
  };

  console.log(email + password);
  var sharedInfo = data.username;
  localStorage.setItem("sharedusername", sharedInfo);

  console.log(data);
  const settings = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },

    body: JSON.stringify(data),
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
