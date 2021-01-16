localStorage.clear();

const urlParamString = window.location.search;
let allParams = new URLSearchParams(urlParamString);
let orderId = allParams.get("order_id");
let price = allParams.get("price");

document.getElementById("orderid").textContent = orderId;
document.getElementById("price").textContent = price;
