async function loadMedicines() { //This function gets the list of medicines from the backend and displays them on the page
    const response = await fetch("http://localhost:8000/medicines");
    const data = await response.json();

    const meds = data.medicines; 
    const list = document.getElementById("medicine-display"); 
    list.innerText = ""; 

    for (let i = 0; i < meds.length; i++) { // Loop through every medicine and show name + price
        let name = meds[i].name;
        let price = meds[i].price;

        //handle missing name and/or price
        if (!name) name = "(No name)";
        if (price === null || price === undefined) price = "(No price)";

        list.innerText += (i + 1) + ". " + name + " - " + price + "\n"; //add to screen
    }
}

document.getElementById("load-button").addEventListener("click", loadMedicines); //Run the load function when the load button is clicked

async function showAveragePrice() { //This function shows the average price of all medicines
    const response = await fetch("http://localhost:8000/average-price");
    const data = await response.json();
    const avgDisplay = document.getElementById("avg-display");
    avgDisplay.innerText = "Average Price: £" + data.average_price; //Show the result
}

document.getElementById("avg-button").addEventListener("click", showAveragePrice); //Run the average price function when the average button is clicked

function showAddSection() { // This function shows the add medicine section
    document.getElementById("add-section").style.display = "block";
}

document.getElementById("show-add-button").addEventListener("click", showAddSection); // Run showAddSection when the add button is clicked

async function addMedicine() { // This function lets the user add a medicine to the backend
    const nameValue = document.getElementById("new-medicine-name").value;
    const priceValue = document.getElementById("new-medicine-price").value;
    const message = document.getElementById("add-message");

    if (nameValue === "") { // check name is not empty
        message.innerText = "Please enter a name.";
        return;
    }

    const numberPrice = Number(priceValue); // convert price to a number

    // validate price is not empty, is a number, and is not negative
    if (priceValue === "" || isNaN(numberPrice) || numberPrice < 0) {
        message.innerText = "Enter a valid price.";
        return;
    }

    const formData = new FormData(); //create form data to send to backend
    formData.append("name", nameValue);
    formData.append("price", numberPrice);

    await fetch("http://localhost:8000/create", {
        method: "POST",
        body: formData
    }); // send data to /create endpoint

    message.innerText = "Medicine added!"; 
    document.getElementById("new-medicine-name").value = ""; 
    document.getElementById("new-medicine-price").value = "";

    await loadMedicines(); 
}

document.getElementById("add-button").addEventListener("click", addMedicine); // Run addMedicine when Add Medicine button is clicked

function showDeleteSection() { // This function shows the delete section
    document.getElementById("delete-section").style.display = "block";
}

document.getElementById("show-delete-button").addEventListener("click", showDeleteSection); // Run showDeleteSection when delete section button is clicked

async function deleteMedicine() { // This function deletes a medicine chosen by its number in the list
    const numberValue = document.getElementById("delete-number").value;
    const message = document.getElementById("delete-message");

    const index = Number(numberValue) - 1; // convert the number to an index 

    if (isNaN(index) || index < 0) { //validation for the number
        message.innerText = "Invalid number.";
        return;
    }

    const response = await fetch("http://localhost:8000/medicines");
    const data = await response.json();
    const meds = data.medicines;

    if (index >= meds.length) { //make sure that number exists in the list
        message.innerText = "That number does not exist.";
        return;
    }

    const medName = meds[index].name; //get the name of the medicine we want to delete

    const formData = new FormData(); //create form data to send to backend
    formData.append("name", medName);

    await fetch("http://localhost:8000/delete", {
        method: "DELETE",
        body: formData
    }); // send delete request to backend

    message.innerText = "Medicine deleted!"; 
    document.getElementById("delete-number").value = ""; 

    await loadMedicines(); 
}

document.getElementById("delete-button").addEventListener("click", deleteMedicine); // Run deleteMedicine when Delete button is clicked
