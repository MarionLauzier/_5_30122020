const fetchProduct = () => {
    const urlParamString = window.location.search;
    let allParams = new URLSearchParams(urlParamString);
    let productId = allParams.get('article_id');

    fetch("http://localhost:3000/api/teddies/"+productId)
     .then(response => {
         if (!response.ok) { 
             throw new Error('Server response is not successful');
            } 
        return response.json()
     })
     .then(response => showProduct(response))
     .catch(error => alert("Erreur : " + error));
    }

    const showProduct = (article) => {
        let articleContainer = document.getElementsByTagName("article")[0];
        articleContainer.id = article._id;
        let imageContainer = document.getElementById("image");
        let image=document.createElement("img");
        image.setAttribute("src", article.imageUrl);
        image.setAttribute("alt", ("photo de l'ours "+article.name));
        imageContainer.appendChild(image);
        document.getElementById("name").innerHTML=article.name;
        document.getElementById("price").innerHTML=article.price;
        document.getElementById("description").innerHTML=article.description;
        let customization= document.getElementById("color");
        for (let color of article.colors) {
            let option=document.createElement("option");
            option.setAttribute("value", color);
            option.textContent = color;
            customization.appendChild(option);
        }
    }
    fetchProduct();

    const addToCart = ()=> {
        let articleId = document.getElementsByTagName("article")[0].id;
        let quantity=document.getElementById("quantity").value;
        if (localStorage.getItem(articleId)) {
            let newQuantity= (localStorage.getItem(articleId)) + quantity;
            localStorage.setItem(articleId, newQuantity);
            
        }
        else{
           
            localStorage.setItem(articleId, quantity);}
    } 

   let cart= document.getElementsByTagName("button")[0];
   cart.addEventListener("click", ()=>{addToCart()});