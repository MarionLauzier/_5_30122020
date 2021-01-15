// const basicsummary = () => {
// 	var k = 0;
// 	let table = document.getElementById("summary");
// 	while (k < localStorage.length) {
// 		let productRow = document.createElement("tr");
// 		let productK = localStorage.key(k);
// 		let quantityK = localStorage.getItem(productK);
// 		productRow.innerHTML =
// 			"<td>" + productK + "</td><td>" + quantityK + "</td>";
// 		table.appendChild(productRow);

// 		k++;
// 	}
// };
// basicsummary();

async function fetchId(productId) {
	const response = await fetch(
		"http://localhost:3000/api/teddies/" + productId
	);
	const json = await response.json();
	return json;
}

const removeItem = (rowIndex) => {
	//supprime la ligne
	let table = document.getElementById("summary");
	let row = table.childNodes[rowIndex];

	table.removeChild(row);
	//Mettre à jour le local storage
	let product = localStorage.key(rowIndex);
	localStorage.removeItem(product);
	//Mettre à jour le badge panier
	cartContent();
};
const updateRowIndex = (rowDeleted) => {
	let rows = document.querySelectorAll("[data-index]");
	for (let row of rows) {
		let index = Number(row.getAttribute("data-index"));
		if (index > rowDeleted) {
			row.setAttribute("data-index", index - 1);
		}
	}
};

const updateTotalPrice = (productDeleteButton) => {
	let priceElement = productDeleteButton.parentElement.previousElementSibling;
	let price = priceElement.textContent.slice(0, -1);
	let totalPriceElement = document.querySelector("#totalCell strong");
	let totalPrice = totalPriceElement.textContent.slice(0, -1);
	let newPrice = Number(totalPrice) - Number(price);
	totalPriceElement.textContent = newPrice.toFixed(2) + "€";
};
// fetchId("5beaa8bf1c9d440000a57d94").then((rep) => console.log(rep.name));

// let table = document.getElementById("summary");

// async function createRow(productId) {
// 	const response = await fetchId(productId);
// 	let productRow = document.createElement("tr");
// 	productRow.innerHTML = "<td>" + response.name + "</td>";
// 	table.appendChild(productRow);
// 	return response;
// }
//createRow("5beaa8bf1c9d440000a57d94").then();

async function summary() {
	var k = 0;
	let table = document.getElementById("summary");
	let totalPrice = 0;
	if (localStorage.length == 0) {
		table.parentElement.parentElement.parentElement.classList.add("d-none");
		let alert = document.createElement("div");
		let h1 = document.getElementsByTagName("h1")[0];
		h1.after(alert);
		alert.classList.add("alert", "alert-warning");
		alert.innerHTML =
			"<strong>Votre panier est vide!</strong> <br/>Veuillez ajouter des articles pour passer commande.";
		document.getElementsByTagName("fieldset")[0].setAttribute("disabled", "");
	} else {
		table.parentElement.parentElement.parentElement.classList.remove("d-none");
		document.getElementsByTagName("fieldset")[0].removeAttribute("disabled");
		while (k < localStorage.length) {
			let productRow = document.createElement("tr");

			let productK = localStorage.key(k);
			let quantityK = localStorage.getItem(productK);
			const response = await fetchId(productK);

			let productImageCell = document.createElement("td");
			let productImage = document.createElement("img");
			productImage.setAttribute("src", response.imageUrl);
			productImage.setAttribute("alt", "photo de l'ours " + response.name);
			productImageCell.appendChild(productImage);
			productRow.appendChild(productImageCell);

			let productName = document.createElement("td");
			productName.textContent = response.name;
			productRow.appendChild(productName);

			let productPrice = document.createElement("td");
			productPrice.textContent = (response.price / 100).toFixed(2) + "€";
			productRow.appendChild(productPrice);

			let productQuantity = document.createElement("td");
			productQuantity.textContent = quantityK;
			productRow.appendChild(productQuantity);

			let price = document.createElement("td");
			let priceforItems = Number(quantityK) * response.price;
			totalPrice += priceforItems;
			price.textContent = (priceforItems / 100).toFixed(2) + "€";
			productRow.appendChild(price);

			let deleteItem = document.createElement("td");
			let deleteButton = document.createElement("button");
			deleteButton.classList.add("btn", "btn-outline-warning");
			deleteButton.setAttribute("data-index", k);
			deleteButton.innerHTML = "<i class='fas fa-trash-alt'></i>";
			deleteItem.appendChild(deleteButton);
			deleteButton.addEventListener("click", function () {
				let rowIndex = this.dataset.index;
				updateTotalPrice(this);
				removeItem(rowIndex);
				updateRowIndex(rowIndex);
			});
			productRow.appendChild(deleteItem);

			table.appendChild(productRow);

			k++;
		}
	}
	return totalPrice;
}
summary().then((total) => {
	let totalCell = document.getElementById("totalCell");
	totalCell.innerHTML = "<strong>" + (total / 100).toFixed(2) + "€</strong>";
});

const getContact = () => {
	let infos = document.getElementsByTagName("input");
	var contact = {
		firstName: infos[0].value,
		lastName: infos[1].value,
		address: infos[2].value,
		city: infos[3].value,
		email: infos[4].value,
	};
	return contact;
};
const getOrder = () => {
	var orderContent = [];
	for (let k = 0; k < localStorage.length; k++) {
		let idK = localStorage.key(k);
		let quantityK = Number(localStorage.getItem(idK));
		for (let i = 0; i < quantityK; i++) {
			orderContent.push(idK);
		}
	}
	return orderContent;
};
const postOrderSetUp = () => {
	var postBody = { contact: getContact(), products: getOrder() };
	var postParameters = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(postBody),
	};
	// console.log(postParameters);
	return postParameters;
};
const postOrder = () => {
	let postParameters = postOrderSetUp();
	let aEnvoyer = JSON.stringify({
		contact: getContact(),
		products: ["5beaa8bf1c9d440000a57d94"],
	});
	fetch("http://localhost:3000/api/teddies/order", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: aEnvoyer,
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Server response is not successful");
			}
			return response.json();
		})
		.then((response) => {
			console.log(response);
		})
		.catch((error) => alert("Erreur : " + error));
};

// let aEnvoyer = {
// 	contact: getContact(),
// 	// {
// 	// 	firstName: "test",
// 	// 	lastName: "test",
// 	// 	address: "test",
// 	// 	city: "test",
// 	// 	email: "test",
// 	// },
// 	products: getOrder(),
// };
const postMyOrder = () => {
	fetch(
		"http://localhost:3000/api/teddies/order",
		postOrderSetUp()
		// {
		// 	method: "POST",
		// 	headers: { "Content-Type": "application/json" },
		// 	body: JSON.stringify(aEnvoyer),
		// }
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Server response is not successful");
			}
			return response.json();
		})
		.catch((error) => alert("Erreur : " + error))
		.then((response) => {
			//console.log(response.orderId);
			return response.orderId;
		})
		.then((orderId) => {
			let totalPrice = document.getElementById("totalCell").firstChild
				.textContent;
			let confirmParameters = "?price=" + totalPrice + "&order_id=" + orderId;
			let confirmUrl = "confirmedorder.html" + confirmParameters;
			//console.log(confirmUrl);
			window.location.href = confirmUrl;
		});
};
//postMyOrder();
function fieldValidation(input) {
	var letters = /^[A-Za-z]+$/;
	var email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

	if (
		(input.type == "email" || input.id == "email") &&
		email.test(input.value)
	) {
		return true;
	} else if (
		input.type == "text" &&
		input.id != "email" &&
		input.value.length >= 2 &&
		letters.test(input.value)
	) {
		return true;
	} else {
		return false;
	}
}

let order = document.getElementById("order");
order.addEventListener("click", (e) => {
	let fields = document.getElementsByTagName("input");
	let isValid = true;
	for (let field of fields) {
		if (!fieldValidation(field)) {
			isValid = false;
		}
	}
	console.log("Formulaire valide :" + isValid);
	if (!isValid) {
		alert(
			"Les champs du formulaire ne sont pas correctement compléter pour passer la commande."
		);
	} else {
		e.preventDefault();
		postMyOrder();
	}
	//e.preventDefault();
	//debugger;
	//postMyOrder();
	//localStorage.clear(); //à faire dans le script de la page de confirmation
});

// form.addEventListener("submit", (e) => {
// 	e.preventDefault();
// 	console.log("Hello");
// });
