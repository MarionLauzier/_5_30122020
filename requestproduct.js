const fetchProduct = () => {
    //let productId = localStorage.getItem('articleId');
    //let productId="5beaa8bf1c9d440000a57d94";
    let productId="5beaaa8f1c9d440000a57d95";
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

        var figure=document.createElement('figure');
        figure.classList.add("card", "col-12", "col-md-6");
        figure.id=article._id;
        figure.innerHTML=("<img class='card-img-top' src="+ article.imageUrl + " alt=.../>" +"<figcaption class='card-body'> <h3 class='card-title'>"+ article.name +"</h3> <p class='card-text'><strong>"+ article.price+"</strong><br/>"+article.description+"</p> </figcaption>");
        //ajouter personnalisation
        var articleContainer = document.getElementById("product");
        articleContainer.appendChild(figure);
    }

    fetchProduct();