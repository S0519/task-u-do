const showMessage = (messages) => {
	const messageElement = document.querySelector('#message-modal');
	const messageContent = document.querySelector('#message-content');
	messageContent.innerHTML = '';

	messages.forEach(x => {
		const div = document.createElement('div');
		const divContent = document.createTextNode(x);
		div.appendChild(divContent);
		messageContent.appendChild(div);
	})
	const modal = new bootstrap.Modal(messageElement);
	modal.show();
}
