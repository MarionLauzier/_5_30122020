const fetchProduct = () => {
	const urlParamString = window.location.search;
	let allParams = new URLSearchParams(urlParamString);
	let productId = allParams.get("article_id");

	fetch("http://localhost:3000/api/teddies/" + productId)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Server response is not successful");
			}
			return response.json();
		})
		.then((response) => showProduct(response))
		.catch((error) => alert("Erreur : " + error));
};

const showProduct = (article) => {
	let articleContainer = document.getElementsByTagName("article")[0];
	articleContainer.id = article._id;
	let imageContainer = document.getElementById("image");
	let image = document.createElement("img");
	image.setAttribute("src", article.imageUrl);
	image.setAttribute("alt", "photo de l'ours " + article.name);
	image.classList.add("w-100", "shadow", "rounded");
	imageContainer.appendChild(image);
	document.getElementById("name").innerHTML = article.name;
	document.getElementById("price").innerHTML =
		"<strong>" + (article.price / 100).toFixed(2) + "€</strong>";
	document.getElementById("description").innerHTML = article.description;
	let customization = document.getElementById("color");
	for (let color of article.colors) {
		let option = document.createElement("option");
		option.setAttribute("value", color);
		option.textContent = color;
		customization.appendChild(option);
	}
};
fetchProduct();

let badges = document.getElementsByClassName("badge-primary");
// for (let b of badges) {
// 	b.style.animationPlayState = "paused";
// 	// b.addEventListener("animationend", () => {
// 	// 	b.style.animationPlayState = "paused";

// 	//});
// }
const addToCart = () => {
	let articleId = document.getElementsByTagName("article")[0].id;
	let quantity = document.getElementById("quantity").value;
	if (localStorage.getItem(articleId)) {
		let newQuantity =
			Number(localStorage.getItem(articleId)) + Number(quantity);

		localStorage.setItem(articleId, newQuantity);
	} else {
		localStorage.setItem(articleId, quantity);
	}
	cartContent();
	for (let b of badges) {
		b.style.animationPlayState = "running";
	}
};

let cart = document.getElementById("addcart");
cart.addEventListener("click", () => {
	addToCart();
	// for (let b of badges) {
	// 	b.style.animationPlayState = "running";
	// 	b.addEventListener("animationend", () => {
	// 		b.style.animationPlayState = "paused";
	// 		console.log("done");
	// 	});
	// }
	setTimeout(function () {
		for (let b of badges) {
			b.style.animationPlayState = "paused";
		}
	}, 800);
});

let quantity = document.getElementById("quantity");

let minus = document.getElementById("minus");
minus.addEventListener("click", () => {
	quantity.stepDown();
});
let plus = document.getElementById("plus");
plus.addEventListener("click", () => {
	quantity.stepUp();
});
