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