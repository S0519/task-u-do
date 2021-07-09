//handle the new list click

const STATUSES = {
	'Completed': 1,
};

let listId = 0;
let saveType = 0;
let currentTaskId = 0;

let dashboardModal, modalTitle, listInput, createButton;

const editTask = (title) => {
	modalTitle.innerHTML = "Edit Task";
	createButton.innerHTML = "Update Task";
	listInput.value = title;
	dashboardModal.show();
}

const newTask = () => {
	modalTitle.innerHTML = "New Task";
	createButton.innerHTML = "Create Task";
	listInput.value = '';
	dashboardModal.show();
}

const completeTask = () => {
	fetch(`/api/tasks/status/${listId}/${currentTaskId}`, {
		method: 'PUT',
		body: JSON.stringify({
			status: STATUSES.Completed
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
			showMessage(['Task Completed!']);
			//wait for 1 second and redirect
			setTimeout(() => {
				location.reload();
			}, 1000);
		})
		.catch(error => {
			console.log(error);
			showMessage(['There was a error on the backend, contact support']);
		})

	//just in case
	saveType = 0;
	currentTaskId = 0;
}

const deleteTask = () => {
	fetch(`/api/tasks/${listId}/${currentTaskId}`, {
		method: 'DELETE',
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
				location.reload();
			}, 1000);
		})
		.catch(error => {
			console.log(error);
			showMessage(['There was a error on the backend, contact support']);
		})

	//just in case
	saveType = 0;
	currentTaskId = 0;
}

const saveNewTask = (title) => {
	fetch(`/api/tasks/${listId}`, {
		method: 'POST',
		body: JSON.stringify({
			title
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
			showMessage(['New Task Created!']);
			//wait for 1 second and redirect
			setTimeout(() => {
				location.reload();
			}, 1000);
		})
		.catch(error => {
			console.log(error);
			showMessage(['There was a error on the backend, contact support']);
		})

	//just in case
	saveType = 0;
	currentTaskId = 0;
}

const saveExistingTask = (title) => {
	fetch(`/api/tasks/${listId}/${currentTaskId}`, {
		method: 'PUT',
		body: JSON.stringify({
			title
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
			showMessage(['Task Updated!']);
			//wait for 1 second and redirect
			setTimeout(() => {
				location.reload();
			}, 1000);
		})
		.catch(error => {
			console.log(error);
			showMessage(['There was a error on the backend, contact support']);
		})

	saveType = 0;
	currentTaskId = 0;
}

const saveTask = (title) => {
	if (!title){
		showMessage(['You must enter a task name']);
		return;
	}

	dashboardModal.hide();

	if (saveType){
		saveExistingTask(title);
	}else{
		saveNewTask(title);
	}
}

window.addEventListener('load', (event) => {
	//get all our items
	listId = document.querySelector('#list-id').value;

	//prepare the modal
	dashboardModal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#new-list-modal'));

	//set other items
	modalTitle = document.querySelector('#new-list-title');
	listInput = document.querySelector('#new-list-input');
	createButton = document.querySelector('#button-create');

	//handle submit
	createButton.addEventListener('click',function(){
		//get the value and send to create list
		const inputVal = document.querySelector('#new-list-input').value;
		saveTask(inputVal);
	});

	//handle click for new list
	document.querySelector('#new-list-button').addEventListener('click',function(){
		newTask();
	});

	//handle text click for new list
	const newListText = document.querySelector('#new-list-text');
	if (newListText) {
		document.querySelector('#new-list-text').addEventListener('click', function () {
			newTask();
		});
	}

	//add edit clicks to links
	const editButtons = document.querySelectorAll('.edit-list');
	editButtons.forEach(editButton => {
		editButton.addEventListener('click',function(e){
			const currentButton = e.currentTarget;
			const listTitle = currentButton.dataset.title;
			currentTaskId = currentButton.dataset.id;
			saveType = 1;
			editTask(listTitle);
		})
	})

	//add delete clicks to links
	const deleteButtons = document.querySelectorAll('.delete-list');
	deleteButtons.forEach(deleteButton => {
		deleteButton.addEventListener('click',function(e){
			const currentButton = e.currentTarget;
			currentTaskId = currentButton.dataset.id;
			deleteTask();
		})
	})

	const startButtons = document.querySelectorAll('.task-start');
	startButtons.forEach(startButton => {
		startButton.addEventListener('click',function(e){
			const currentButton = e.currentTarget;
			currentTaskId = currentButton.dataset.id;
			startTask();
		})
	})

	const completeButtons = document.querySelectorAll('.task-complete');
	completeButtons.forEach(completeButton => {
		completeButton.addEventListener('click',function(e){
			const currentButton = e.currentTarget;
			currentTaskId = currentButton.dataset.id;
			completeTask();
		})
	})

});

