////////////////////////////////////////////////////////////////////////
//Script inclus dans la page de confirmation de commande,
//permettant d'y afficher le numéro de commande et le prix total de la commande
////////////////////////////////////////////////////////////////////////

// vide le panier pour le réinitialiser
localStorage.clear();

//récupération dans l'url de la page et affichage sur la page du numéro de commande et du prix total
const urlParamString = window.location.search;
let allParams = new URLSearchParams(urlParamString);
let orderId = allParams.get("order_id");
let price = allParams.get("price");

document.getElementById("orderid").textContent = orderId;
document.getElementById("price").textContent = price;
