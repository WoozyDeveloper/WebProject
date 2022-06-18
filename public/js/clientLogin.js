window.onload = function LoadWindow(event) {
  if (localStorage.getItem("sharedemail")) {
    window.location.href = "http://localhost:3000/pages/user.html";
  }
};

document.forms[0].onsubmit = async (e) => {
  e.preventDefault();
  const data = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  }; //get data from form

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
      //if the user exists(email and password match with those in the db)
      localStorage.setItem("sharedemail", data.email);
      window.location.href = "http://localhost:3000/pages/user.html";
    } else {
      //the user doesn't exist
      const para = document.createElement("p");
      const node = document.createTextNode(
        "Sorry the credentials you are using are invalid"
      );
      para.appendChild(node);

      const element = document.getElementById("box");
      console.log("element= " + element);
      element.appendChild(para);
    }
  } catch (err) {
    console.log(err);
  }
};
