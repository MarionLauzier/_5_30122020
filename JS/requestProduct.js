////////////////////////////////////////////////////////////////////////
//Script inclus dans la page produit présentant l'article,
//permettant de le personnaliser et de l'ajouter au panier
////////////////////////////////////////////////////////////////////////

//----------Affichage de l'article sur la page--------------

// fonction permettant d'ajouter les informations de l'article à la page
const showProduct = (article) => {
	// récupération de la zone de la page qui contient l'article et attribution de l'id
	let articleContainer = document.getElementsByTagName("article")[0];
	articleContainer.id = article._id;

	// récupération de l'élément prévu pour contenir l'image de l'article et ajout de l'image à la page
	let imageContainer = document.getElementById("image");
	let image = document.createElement("img");
	image.setAttribute("src", article.imageUrl);
	image.setAttribute("alt", "photo de l'ours " + article.name);
	image.classList.add("w-100", "shadow", "rounded");
	imageContainer.appendChild(image);

	//affichage du nom
	document.getElementById("name").innerHTML = article.name;
	//affichage du prix
	document.getElementById("price").innerHTML =
		"<strong>" + (article.price / 100).toFixed(2) + "€</strong>";
	//affichage de la description
	document.getElementById("description").innerHTML = article.description;
	// création et ajout de chaque couleur de personnalisation possible au menu déroulant de choix
	let customization = document.getElementById("color");
	for (let color of article.colors) {
		let option = document.createElement("option");
		option.setAttribute("value", color);
		option.textContent = color;
		customization.appendChild(option);
	}
};
//fonction permettant de récupérer l'article auprès de l'API et d'afficher toutes ses informations sur la page
const fetchProduct = () => {
	// Récupération de l'ID de l'article dans les paramètres de l'url
	const urlParamString = window.location.search;
	let allParams = new URLSearchParams(urlParamString);
	let productId = allParams.get("article_id");

	//création d'une requête auprès du serveur pour récupérer les données de l'article
	fetch("http://localhost:3000/api/teddies/" + productId)
		.then((response) => {
			// vérification de connexion au serveur et renvoi d'une erreur si le serveur ne répond pas
			if (!response.ok) {
				throw new Error("Server response is not successful");
			}
			// conversion de la réponse du serveur en objet JS
			return response.json();
		})
		// une fois la réponse obtenue, ajout des informations de l'article sur la page
		.then((response) => showProduct(response))

		// en cas d'erreur récupération et affichage de l'erreur
		.catch((error) => alert("Erreur : " + error));
};

fetchProduct();

//----------Ajout des articles au panier et visualisation du panier--------------

// récupération des éléments qui indiquent le nombre d'article dans le panier
let badges = document.getElementsByClassName("badge-primary");

// fonction permettant d'ajouter un article et sa quantité souhaitée dans le panier
const addToCart = () => {
	// récupération de l'id de l'article et de la quantité souhaitée
	let articleId = document.getElementsByTagName("article")[0].id;
	let quantity = document.getElementById("quantity").value;
	// Stockage de l'article dans le local storage ou mise à jour de la quantité si l'article est déjà présent
	if (localStorage.getItem(articleId)) {
		let newQuantity =
			Number(localStorage.getItem(articleId)) + Number(quantity);

		localStorage.setItem(articleId, newQuantity);
	} else {
		localStorage.setItem(articleId, quantity);
	}
	//mise à jour du nombre d'article dans le panier
	cartContent();
	// lancement de l'animation sur le badge du panier
	for (let b of badges) {
		b.style.animationPlayState = "running";
	}
};

//ajout du callback d'ajout de l'article au panier sur le bouton d'ajout au panier
let cart = document.getElementById("addcart");
cart.addEventListener("click", () => {
	addToCart();

	//mise en pause de l'animation du badge du panier au bout d'une période
	setTimeout(function () {
		for (let b of badges) {
			b.style.animationPlayState = "paused";
		}
	}, 800);
});

// Augmentation ou diminution de la quantité affichée lorsque l'on clique sur les boutons plus et moins
let quantity = document.getElementById("quantity");

let minus = document.getElementById("minus");
minus.addEventListener("click", () => {
	quantity.stepDown();
});
let plus = document.getElementById("plus");
plus.addEventListener("click", () => {
	quantity.stepUp();
});
