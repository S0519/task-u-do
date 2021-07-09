let email, password, username;

const handleSignup = (email, password, username) => {
	fetch(`/api/user`, {
		method: 'POST',
		body: JSON.stringify({
			username,
			email,
			password
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => response.json())
		.then(data => {
			if (data && data.errors){
				showMessage(data.errors);
				return;
			}
			showMessage(data.message);
			//wait for 1 second and redirect
			setTimeout(() => {
				window.location.href = "/dashboard";
			}, 1000);
		})
		.catch(error => {
			console.log(error);
			showMessage(['There was a error on the backend, contact support']);
		})
}

window.addEventListener('load', (event) => {
	//attach event listener to button
	document.querySelector('#doSignup').addEventListener('click',function(){
		//get the email address and password
		email = document.querySelector('#signupEmail').value;
		password = document.querySelector('#signupPassword').value;
		username = document.querySelector('#signupUsername').value;
		handleSignup(email, password, username);
	});
});
