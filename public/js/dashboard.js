//handle the new list click

let saveType = 0;
let currentListId = 0;

let dashboardModal, modalTitle, listInput, createButton;

const editList = (title) => {
	modalTitle.innerHTML = "Edit List";
	createButton.innerHTML = "Update List";
	listInput.value = title;
	dashboardModal.show();
}

const newList = () => {
	modalTitle.innerHTML = "New List";
	createButton.innerHTML = "Create List";
	listInput.value = '';
	dashboardModal.show();
}

const deleteList = () => {
	fetch(`/api/lists/${currentListId}`, {
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
	currentListId = 0;
}

const saveNewList = (title) => {
	fetch(`/api/lists`, {
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
			showMessage(['New List Created!']);
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
	currentListId = 0;
}

const saveExistingList = (title) => {
	fetch(`/api/lists/${currentListId}`, {
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
			showMessage(['List Updated!']);
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
	currentListId = 0;
}

const saveList = (title) => {
	if (!title){
		showMessage(['You must enter a list name']);
		return;
	}

	dashboardModal.hide();

	if (saveType){
		saveExistingList(title);
	}else{
		saveNewList(title);
	}
}

window.addEventListener('load', (event) => {
	//get all our items

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
		saveList(inputVal);
	});

	//handle click for new list
	document.querySelector('#new-list-button').addEventListener('click',function(){
		newList();
	});

	//handle text click for new list
	const newListText = document.querySelector('#new-list-text');
	if (newListText) {
		document.querySelector('#new-list-text').addEventListener('click', function () {
			newList();
		});
	}

	//add edit clicks to links
	const editButtons = document.querySelectorAll('.edit-list');
	editButtons.forEach(editButton => {
		editButton.addEventListener('click',function(e){
			const currentButton = e.currentTarget;
			const listTitle = currentButton.dataset.title;
			currentListId = currentButton.dataset.id;
			saveType = 1;
			editList(listTitle);
		})
	})

	//add delete clicks to links
	const deleteButtons = document.querySelectorAll('.delete-list');
	deleteButtons.forEach(deleteButton => {
		deleteButton.addEventListener('click',function(e){
			const currentButton = e.currentTarget;
			currentListId = currentButton.dataset.id;
			deleteList();
		})
	})
});

