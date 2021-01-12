const cartContent = () => {
	let badges = document.getElementsByClassName("badge");
	let quantity = 0;
	if (localStorage.length == 0) {
		for (let b of badges) {
			b.classList.add("d-none");
		}
	} else {
		var k = 0;

		while (k < localStorage.length) {
			let idK = localStorage.key(k);
			let quantityK = Number(localStorage.getItem(idK));
			quantity += quantityK;
			k++;
		}
		for (let b of badges) {
			b.classList.remove("d-none");
			b.firstChild.textContent = quantity;
		}
	}
};
cartContent();
