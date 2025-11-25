async function loadMedicines() {
    const response = await fetch("http://localhost:8000/medicines");
    const data = await response.json();

    const meds = data.medicines;
    const list = document.getElementById("medicine-display");
    list.innerText = "";

    for (let i = 0; i < meds.length; i++) {
        let name = meds[i].name;
        let price = meds[i].price;

        if (!name) name = "(No name)";
        if (price === null || price === undefined) price = "(No price)";

        list.innerText += (i + 1) + ". " + name + " - " + price + "\n";
    }
}

document.getElementById("load-button").addEventListener("click", loadMedicines);

async function showAveragePrice() {
    const response = await fetch("http://localhost:8000/average-price");
    const data = await response.json();
    const avgDisplay = document.getElementById("avg-display");

    avgDisplay.innerText = "Average Price: £" + data.average_price;
}

document.getElementById("avg-button").addEventListener("click", showAveragePrice);

document.getElementById("show-add-button").addEventListener("click", () => {
    document.getElementById("add-section").style.display = "block";
});

async function addMedicine() {
    const nameValue = document.getElementById("new-medicine-name").value;
    const priceValue = document.getElementById("new-medicine-price").value;
    const message = document.getElementById("add-message");

    if (nameValue === "") {
        message.innerText = "Please enter a name.";
        return;
    }

    const numberPrice = Number(priceValue);

    if (priceValue === "" || isNaN(numberPrice) || numberPrice < 0) {
        message.innerText = "Enter a valid price.";
        return;
    }

    const formData = new FormData();
    formData.append("name", nameValue);
    formData.append("price", numberPrice);

    await fetch("http://localhost:8000/create", {
        method: "POST",
        body: formData
    });

    message.innerText = "Medicine added!";
    document.getElementById("new-medicine-name").value = "";
    document.getElementById("new-medicine-price").value = "";

    await loadMedicines();
}

document.getElementById("add-button").addEventListener("click", addMedicine);

document.getElementById("show-delete-button").addEventListener("click", () => {
    document.getElementById("delete-section").style.display = "block";
});

async function deleteMedicine() {
    const numberValue = document.getElementById("delete-number").value;
    const message = document.getElementById("delete-message");

    const index = Number(numberValue) - 1;

    if (isNaN(index) || index < 0) {
        message.innerText = "Invalid number.";
        return;
    }

    const response = await fetch("http://localhost:8000/medicines");
    const data = await response.json();
    const meds = data.medicines;

    if (index >= meds.length) {
        message.innerText = "That number does not exist.";
        return;
    }

    const medName = meds[index].name;

    const formData = new FormData();
    formData.append("name", medName);

    await fetch("http://localhost:8000/delete", {
        method: "DELETE",
        body: formData
    });

    message.innerText = "Medicine deleted!";
    document.getElementById("delete-number").value = "";

    await loadMedicines();
}

document.getElementById("delete-button").addEventListener("click", deleteMedicine);
