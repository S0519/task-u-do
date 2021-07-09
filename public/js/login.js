//get the email and password and send to the backend

//if the login was successful redirect to dashboard
//if not display errors
let email, password;

const handleLogin = (email, password) => {
	fetch(`/api/user/login`, {
		method: 'POST',
		body: JSON.stringify({
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
	document.querySelector('#doLogin').addEventListener('click',function(){
		//get the email address and password
		email = document.querySelector('#loginEmail').value;
		password = document.querySelector('#loginPassword').value;
		handleLogin(email, password);
	});
});
