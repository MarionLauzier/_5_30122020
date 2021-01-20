////////////////////////////////////////////////////////////////////////
//Script inclus dans la page d'accueil présentant l'ensemble des articles
////////////////////////////////////////////////////////////////////////

//----------Affichage des articles sur la page--------------

// fonction permettant d'ajouter un article à la page
const addArticle = (article) => {
	// création d'une carte de type figure avec la classe Bootstrap card pour recevoir les informations sur l'article
	var figure = document.createElement("figure");
	figure.classList.add("card", "border-0", "shadow-sm");

	// ajout de l'image de l'article dans la carte
	var img = document.createElement("img");
	img.classList.add("card-img-top");
	img.setAttribute("src", article.imageUrl);
	img.setAttribute("alt", "photo de l'ours " + article.name);
	figure.appendChild(img);

	// ajout d'un élément de type légende dans la carte
	var caption = document.createElement("figcaption");
	caption.classList.add("card-body", "text-center");
	figure.appendChild(caption);

	// ajout du nom de l'article dans la légende
	var title = document.createElement("h4");
	title.classList.add("card-title", "text-left");
	title.innerHTML = article.name;
	caption.appendChild(title);

	// ajout du prix de l'article dans la légende
	var price = document.createElement("p");
	price.classList.add("card-text");
	price.innerHTML =
		"<strong>" + (article.price / 100).toFixed(2) + "€</strong>";
	caption.appendChild(price);

	// ajout du bouton contenant le lien vers la page détaillant l'article (url qui contient l'id de l'article en paramètre)
	var details = document.createElement("a");
	details.classList.add("stretched-link", "btn", "btn-primary", "border-0");
	details.setAttribute("href", "article.html?article_id=" + article._id);
	details.innerHTML = "Voir les détails du produit";
	caption.appendChild(details);
	var articleContainer = document.getElementById("articles");

	//ajout d'un div encadrant la figure afin de mettre en page responsivement avec les classes Bootstrap col
	var col = document.createElement("div");
	col.classList.add("col-12", "col-md-6");
	articleContainer.appendChild(col);

	col.appendChild(figure);
};

//fonction permettant de récupérer les articles et de les afficher sur la page
const fetchArticles = () => {
	//création d'une requête auprès du serveur pour récupérer l'ensemble des articles
	fetch("http://localhost:3000/api/teddies")
		// vérification de connexion au serveur et renvoi d'une erreur si le serveur ne répond pas
		.then((response) => {
			if (!response.ok) {
				throw new Error("Server response is not successful");
			}
			// conversion de la réponse du serveur en objet JS
			return response.json();
		})
		// une fois la réponse obtenue, ajout de l'ensemble des articles contenus dans la réponse à la page
		.then((response) => {
			for (let article of response) {
				addArticle(article);
			}
		})
		// en cas d'erreur récupération et affichage de l'erreur
		.catch((error) => alert("Erreur : " + error));
};

fetchArticles();

//----------Manipulation de l'affichage pour la recherche et le tri des articles--------------

// récupération des boutons permettant d'activer les filtres de tri en fonction des prix
const pricedown = document.getElementById("filterdown");
const priceup = document.getElementById("filterup");

// fonction permettant de trier les cartes des articles en fonction de leur prix,
// soit dans l'ordre croissant, soit dans l'ordre décroissant en fonction de l'attribut fournit ("up" ou "down")
function order(direction) {
	// création d'une liste contenant tous les articles
	var listFigure = document.getElementsByTagName("figure");
	//initialisation des tableaux contenants les différents prix
	let listprix = [];
	let orderlistprix = [];

	//récupération des prix et ajout dans les tableaux
	for (let figure of listFigure) {
		let prix = figure.getElementsByTagName("strong")[0].textContent;
		listprix.push(prix);
		orderlistprix.push(prix);
	}

	// tri du tableau des prix dans l'ordre croissant
	orderlistprix.sort();
	// inversion du tableau dans le cas d'un ordre voulu décroissant
	if (direction == "up") {
		orderlistprix.reverse();
	}
	// réorganisation de l'ordre d'affichage des articles en ajoutant la classe Bootstrap "order-x"
	let order = 0;
	for (let prix of orderlistprix) {
		// récupération de la place d'origine de l'article
		let index = listprix.indexOf(prix);
		order++;
		// ajout ou modification de la classe order à l'élément parent.
		var parent = listFigure[index].parentElement;
		var parentOrder = parent.classList.item(2);
		if (parentOrder == null) {
			parent.classList.add("order-" + order);
		} else {
			parent.classList.replace(parentOrder, "order-" + order);
		}
	}
}
//ajout du callback de tri sur les boutons
pricedown.addEventListener("click", () => {
	order("down");
});
priceup.addEventListener("click", () => {
	order("up");
});

//récupération de la barre de recherche
let search = document.getElementById("peluche");

// fonction permettant d'afficher uniquement les articles dont le nom contient le mot recherché.
//Cette méthode n'est pas sensible à la casse.
const filterName = (searchedName) => {
	// Tableau permettant de récupérer les articles et les noms
	let articles = document.getElementsByTagName("figure");
	let names = document.getElementsByClassName("card-title");
	let index = 0;
	// réinitialisation de l'affichage des articles en les affichant tous
	for (let article of articles) {
		article.parentElement.classList.remove("d-none");
	}
	//boucle sur l'ensemble des articles permettant de savoir si le nom de l'article contient le mot recherché et si non de ne pas l'afficher.
	for (let name of names) {
		let nameLower = name.textContent.toLowerCase();
		if (!nameLower.includes(searchedName.toLowerCase())) {
			let article = articles[index];
			article.parentElement.classList.add("d-none");
		}
		index++;
	}
};
// ajout du callback de recherche sur la barre de recherche et récupération du contenu
search.addEventListener("input", (e) => {
	filterName(e.target.value);
});
