////////////////////////////////////////////////////////////////////////
//Script inclus dans les pages accueil, produit et panier permettant d'afficher dans un badge
// le nombre d'article présent dans le panier au chargement de la page.
////////////////////////////////////////////////////////////////////////

// fonction permettant d'afficher dans le header le nombre d'articles dans le panier

const cartContent = () => {
	// Récupération des badges (desktop et mobile) et initialisation de la quantité
	let badges = document.getElementsByClassName("badge");
	let quantity = 0;

	// masquage du badge si le panier est vide, c'est à dire si aucun item est présent dans la mémoire
	if (localStorage.length == 0) {
		for (let b of badges) {
			b.classList.add("d-none");
		}
	} else {
		// sinon boucle sur l'ensemble des items présents en mémoire,
		//récupération de la quantité pour chaque item et ajout à la quantité globale
		var k = 0;

		while (k < localStorage.length) {
			let idK = localStorage.key(k);
			let quantityK = Number(localStorage.getItem(idK));
			quantity += quantityK;
			k++;
		}
		// affichage du badge et de la quantité
		for (let b of badges) {
			b.classList.remove("d-none");
			b.firstChild.textContent = quantity;
		}
	}
	return quantity;
};

cartContent();
