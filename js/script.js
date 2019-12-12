if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
         navigator.serviceWorker.register('/sw.js');
     });
 }

 window.addEventListener('online', (event) => {
    var title = document.querySelector('.title');
    title.innerHTML = "To-Do App"; 
    console.log("online");
});

window.addEventListener('offline', (event) => {
    var title = document.querySelector('.title');
    title.innerHTML = title.innerHTML + " - Offline"; 
    console.log("offline");
});


let btn = document.querySelector('#new');
btn.addEventListener('click', addTodo, false);
console.log("In script");
document.querySelector('h2').hidden = true;

let inputBox = document.querySelector('#name');
inputBox.addEventListener("keyup", saveTextInTextBox);

const textBoxValueStoredKey = "textBoxValueStoredKey";
var textBoxValue = document.querySelector('#name').value.trim();

function addTodo(event) {
    event.preventDefault();
    console.log("In addTodo");
    const addTOElement = document.querySelector('#app');
    const todoAdded = document.querySelector('#name').value.trim();

    if (todoAdded.length > 0) {
        document.querySelector('h2').hidden = false;
        const template = document.querySelector('#myTemplate');
        const newItem = document.importNode(template.content, true);
        const newItemListItem = newItem.querySelector('#toAdd');
        const newItemLabel = newItemListItem.querySelector('#tmplLabel');
        const newItemCheckbox = newItemListItem.querySelector('#tmplCheckbox');

        const hash = (Date.now().toString(36).substr(2, 4) + performance.now().toString().replace('.', '').substr(0, 4) +
            Math.random().toString(36).substr(3, 4)).toUpperCase();

        const listId = `toAdd-${hash}`;
        newItemListItem.setAttribute('id', listId);

        const labelId = `tmplLabel-${hash}`;
        newItemLabel.setAttribute('id', labelId);
        const checkboxId = `tmplCheckbox-${hash}`;
        newItemCheckbox.setAttribute('id', checkboxId);

        newItemLabel.textContent = todoAdded;

        document.querySelector('#name').value = "";

        addTOElement.appendChild(newItem);

        window.localStorage.setItem(labelId, todoAdded);
    }
    if (window.localStorage.getItem(textBoxValueStoredKey) != null) {
        window.localStorage.removeItem(textBoxValueStoredKey);
    }
}

function saveTextInTextBox(event) {
    if (event.isComposing || event.keyCode === 229) {
        return;
    }
    event = (event) ? event : window.event;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
        return false;
    }

    window.localStorage.setItem(textBoxValueStoredKey, document.querySelector('#name').value.trim());
}

function getTextWhichWasInTextBox() {
    if (window.localStorage.getItem(textBoxValueStoredKey) != null) {
        var previousValue = window.localStorage.getItem(textBoxValueStoredKey);
        document.querySelector('#name').value = previousValue;
    }
}

function getElementsFromLocalStorage() {
    const addTOElement = document.querySelector('#app');
    const template = document.querySelector('#myTemplate');

    for (var i = localStorage.length - 1; i >= 0; i--) {

        var key = localStorage.key(i);
        if (key.localeCompare(textBoxValueStoredKey) != 0) {
            var value = localStorage.getItem(key);

            var newItem = document.importNode(template.content, true);
            var newItemListItem = newItem.querySelector('#toAdd');
            var newItemLabel = newItemListItem.querySelector('#tmplLabel');
            var newItemCheckbox = newItemListItem.querySelector('#tmplCheckbox');

            console.log('Key: ' + key + ', Value: ' + value);

            var hash = (Date.now().toString(36).substr(2, 4) + performance.now().toString().replace('.', '').substr(0, 4) +
                Math.random().toString(36).substr(3, 4)).toUpperCase();

            var listId = `toAdd-${hash}`;
            newItemListItem.setAttribute('id', listId);

            newItemLabel.setAttribute('id', key);

            newItemLabel.textContent = value;


            addTOElement.appendChild(newItem);
            document.querySelector('h2').hidden = false;
        }
    }
}

getElementsFromLocalStorage();
getTextWhichWasInTextBox();

let list = document.querySelector('#app');

    list.onclick = function(event) {
      let target = event.target;

      while (target != this) {
        if (target.id == 'delete') {
        	var parent1 = target.parentNode;
		window.localStorage.removeItem(parent1.childNodes[1].id);
		var parent2 = parent1.parentNode;
		parent2.removeChild(parent1);
		if(localStorage.length == 0) {
			document.querySelector('h2').hidden = true;
		}
          	return;
        }
        target = target.parentNode;
      }
    }
