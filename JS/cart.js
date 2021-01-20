////////////////////////////////////////////////////////////////////////
//Script inclus dans la page panier, affichant le résumé de la commande
//et permettant de passer la commande avec un formulaire
////////////////////////////////////////////////////////////////////////

//----------Affichage du tableau résumant le contenu du panier--------------

// fonction asynchrone permettant de récupérer l'article auprès de l'API
async function fetchId(productId) {
	//création d'une requête auprès du serveur pour récupérer les données de l'article et attente de la réponse
	const response = await fetch(
		"http://localhost:3000/api/teddies/" + productId
	);
	//attente de la réponse et conversion de l'objet json en JS
	const json = await response.json();
	return json;
}

// fonction permettant de supprimer un article de la commande (ligne du tableau)
const removeItem = (rowIndex) => {
	//supprime la ligne
	let table = document.getElementById("summary");
	let row = table.childNodes[rowIndex];

	table.removeChild(row);
	//Mettre à jour le panier en mémoire dans le local storage
	let product = localStorage.key(rowIndex);
	localStorage.removeItem(product);
	//Mettre à jour le badge panier
	cartContent();
};

// fonction permettant de mettre à jour le numéro de ligne contenu dans l'attribut "data-index" lorsqu'un rang a été supprimé
const updateRowIndex = (rowDeleted) => {
	//récupération des éléments lignes
	let rows = document.querySelectorAll("[data-index]");
	// pour chaque ligne, récupération du numéro de ligne
	//et réduction de ce numéro de ligne de 1, si cette ligne était située après le rang supprimé
	for (let row of rows) {
		let index = Number(row.getAttribute("data-index"));
		if (index > rowDeleted) {
			row.setAttribute("data-index", index - 1);
		}
	}
};

// fonction permettant de mettre à jour le prix total lorsqu'un un rang a été supprimé
const updateTotalPrice = (productDeleteButton) => {
	// récupération du prix de la ligne qui va être supprimée
	let priceElement = productDeleteButton.parentElement.previousElementSibling;
	// conversion du prix en nombre en retirant le symbole €
	let price = priceElement.textContent.slice(0, -1);
	// récupération du prix total de la commande et conversion en nombre
	let totalPriceElement = document.querySelector("#totalCell strong");
	let totalPrice = totalPriceElement.textContent.slice(0, -1);
	// calcul et affichage du nouveau prix total par soustraction
	let newPrice = Number(totalPrice) - Number(price);
	totalPriceElement.textContent = newPrice.toFixed(2) + "€";
};

// fonction asynchrone permettant de générer le tableau de résumé de la commande et de l'afficher sur la page,
// elle permet aussi de calculer le prix total et le renvoie
async function summary() {
	// récupération du tableau et initialisation des indices et du calcul du prix total
	var k = 0;
	let table = document.getElementById("summary");
	let totalPrice = 0;

	// dans le cas où aucun article n'a encore été ajouté au panier:
	if (localStorage.length == 0) {
		// masquage du tableau
		table.parentElement.parentElement.parentElement.classList.add("d-none");
		// création et affichage d'une alerte indiquant à l'utilisateur que le panier est encore vide
		let alert = document.createElement("div");
		let h1 = document.getElementsByTagName("h1")[0];
		h1.after(alert);
		alert.classList.add("alert", "alert-warning");
		alert.innerHTML =
			"<strong>Votre panier est vide!</strong> <br/>Veuillez ajouter des articles pour passer commande.";
		// désactive le formulaire de commande
		document.getElementsByTagName("fieldset")[0].setAttribute("disabled", "");
		//le reste du temps:
	} else {
		//affichage du tableau et activation du formulaire
		table.parentElement.parentElement.parentElement.classList.remove("d-none");
		document.getElementsByTagName("fieldset")[0].removeAttribute("disabled");
		// pour chaque article contenu dans le panier
		while (k < localStorage.length) {
			// création d'une ligne dans le tableau
			let productRow = document.createElement("tr");

			//récupération de l'id du produit et de sa quantité dans la mémoire, demande des informations du produit auprès de l'API
			let productK = localStorage.key(k);
			let quantityK = localStorage.getItem(productK);
			const response = await fetchId(productK);

			// affichage de l'image de l'article dans la première cellule
			let productImageCell = document.createElement("td");
			let productImage = document.createElement("img");
			productImage.setAttribute("src", response.imageUrl);
			productImage.setAttribute("alt", "photo de l'ours " + response.name);
			productImageCell.appendChild(productImage);
			productRow.appendChild(productImageCell);

			//affichage du nom de l'article dans la deuxième cellule
			let productName = document.createElement("td");
			productName.textContent = response.name;
			productRow.appendChild(productName);

			// affichage du prix unitaire de l'article dans la troisième cellule
			let productPrice = document.createElement("td");
			productPrice.textContent = (response.price / 100).toFixed(2) + "€";
			productRow.appendChild(productPrice);

			//affichage de la quantité dans la quatrième cellule
			let productQuantity = document.createElement("td");
			productQuantity.textContent = quantityK;
			productRow.appendChild(productQuantity);

			// calcul et affichage du prix dans la cinquième cellule et ajout du montant de l'article au prix total
			let price = document.createElement("td");
			let priceforItems = Number(quantityK) * response.price;
			totalPrice += priceforItems;
			price.textContent = (priceforItems / 100).toFixed(2) + "€";
			productRow.appendChild(price);

			// création d'un bouton permettant de supprimer l'article de la commande (la ligne du tableau) dans la sixième cellule
			let deleteItem = document.createElement("td");
			let deleteButton = document.createElement("button");
			deleteButton.classList.add("btn", "btn-outline-warning");
			deleteButton.setAttribute("data-index", k);
			deleteButton.innerHTML = "<i class='fas fa-trash-alt'></i>";
			deleteItem.appendChild(deleteButton);
			//ajout du callback de suppression de la ligne au bouton "supprimer" de la ligne
			deleteButton.addEventListener("click", function () {
				//récupération de l'indice de la ligne
				let rowIndex = this.dataset.index;
				// mise à jour du prix total
				updateTotalPrice(this);
				//suppression de la ligne
				removeItem(rowIndex);
				// mise à jour des numéros de ligne
				updateRowIndex(rowIndex);
			});
			productRow.appendChild(deleteItem);
			// ajout de la ligne au tableau
			table.appendChild(productRow);
			// incrémentation de l'indice des éléments en mémoire
			k++;
		}
	}
	// renvoi du prix total
	return totalPrice;
}

// génération du tableau puis ajout d'une ligne au tableau indiquant le prix total de la commande
summary().then((total) => {
	let totalCell = document.getElementById("totalCell");
	totalCell.innerHTML = "<strong>" + (total / 100).toFixed(2) + "€</strong>";
});

//----------Validation du formulaire et passage de la commande--------------

// fonction permettant de récupérer les données saisies par l'utilisateur dans le formulaire
// et de les retourner sous forme d'un objet JS "contact"
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

//fonction permettant d'obtenir une liste des id des produits à commander (présent dans le panier),
// chaque id est répété en fonction de la quantité souhaitée
const getOrder = () => {
	//initialisation de la liste
	var orderContent = [];
	// récupération de tous les articles dans le panier
	for (let k = 0; k < localStorage.length; k++) {
		let idK = localStorage.key(k);
		let quantityK = Number(localStorage.getItem(idK));
		// ajout de l'id à la liste selon sa quantité voulue
		for (let i = 0; i < quantityK; i++) {
			orderContent.push(idK);
		}
	}
	return orderContent;
};

// fonction permettant de créer l'objet qui contient tous les paramètres de la requête à envoyer à l'API pour passer commande
const postOrderSetUp = () => {
	// création du corps de la requête selon le format attendu par l'API avec l'objet contact et le contenu de la commande
	var postBody = { contact: getContact(), products: getOrder() };
	// création de l'objet contenant la méthode, les en-têtes et le corps au format JSON de la requête
	var postParameters = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(postBody),
	};
	return postParameters;
};

//fonction permettant d'envoyer la commande à l'API et de récupérer auprès d'elle le numéro de commande
// et de rediriger l'utilisateur sur la page de confirmation de commande
const postMyOrder = () => {
	// création et envoi de la requête contenant la commande
	fetch("http://localhost:3000/api/teddies/order", postOrderSetUp())
		.then((response) => {
			if (!response.ok) {
				throw new Error("Server response is not successful");
			}
			// récupération de la réponse (confirmation que la commande est bien passée)
			return response.json();
		})
		.catch((error) => alert("Erreur : " + error))
		//récupération du numéro de commande généré par l'API
		.then((response) => {
			return response.orderId;
		})
		.then((orderId) => {
			//récupération du prix total de la commande
			let totalPrice = document.getElementById("totalCell").firstChild
				.textContent;
			// ajout aux paramètres de l'url de la page de confirmation, le prix total et le numéro de commande
			let confirmParameters = "?price=" + totalPrice + "&order_id=" + orderId;
			let confirmUrl = "confirmedOrder.html" + confirmParameters;
			// redirection vers la page de confirmation de commande
			window.location.href = confirmUrl;
		});
};

//fonction permettant de valider les données saisies dans un champ du formulaire en renvoyant un booléen
function fieldValidation(input) {
	// regex de test pour les champs de texte et d'email
	var letters = /^[A-Za-z]+$/;
	var email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	//test si le champ est un email
	if (
		(input.type == "email" || input.id == "email") &&
		email.test(input.value)
	) {
		return true;
		// test s'il s'agit d'un champ de texte, il doit contenir que des lettres et au minimum 2 caractères
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

// ajout au bouton "passer commande" d'un callback permettant de passer commande
let order = document.getElementById("order");
order.addEventListener("click", (e) => {
	// récupération des champs du formulaires
	let fields = document.getElementsByTagName("input");
	let isValid = true;
	// utilisation de la fonction de validation des données saisies sur tous les champs du formulaire
	for (let field of fields) {
		if (!fieldValidation(field)) {
			isValid = false;
		}
	}
	// envoi d'une alerte si au moins l'un des champs n'est pas valide
	if (!isValid) {
		alert(
			"Les champs du formulaire ne sont pas correctement compléter pour passer la commande."
		);
		// si tous les champs sont valides le passage de commande est effectuée
	} else {
		e.preventDefault();
		postMyOrder();
	}
});
