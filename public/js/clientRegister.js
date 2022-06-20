document.forms[0].onsubmit = async (e) => {
  e.preventDefault();
  console.log('TESTTT');
  const data = {
    email: document.getElementById('email').value,
    username: document.getElementById('username').value,
    password: document.getElementById('password').value,
  }; //data from the form
  var sharedInfo = data.email;
  localStorage.setItem('sharedemail', sharedInfo); //save username to local storage

  console.log(data);
  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },

    body: JSON.stringify(data), //send data as json
  };
  try {
    const fetchResponse = await fetch(
      'http://localhost:4000/register',
      settings
    );
    const response = await fetchResponse.json(); //response from the server
    console.log(response);

    if (response.status === 'new user') {
      //new user created - > redirect
      console.log(sharedInfo);
      window.location.href = '/login';
    } else {
      //user with that email already exists
      const para = document.createElement('p');
      const node = document.createTextNode(
        'An account with that email already exists'
      );
      para.appendChild(node);

      const element = document.getElementById('box');
      console.log('element= ' + element);
      element.appendChild(para);
    }
  } catch (err) {
    console.log(err);
  }
};
