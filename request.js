// const { mainModule } = require("process");


const fetchArticles = () => {
fetch("http://localhost:3000/api/teddies")
 .then(response => {
     if (!response.ok) { 
         throw new Error('Server response is not successful');
        } 
    return response.json()
 })
 .then(response => {for (let article of response) {addArticle(article)}})
 //.then( data => {let listFigure = document.getElementsByTagName('figure'); return listFigure })
 .catch(error => alert("Erreur : " + error));
}




const addArticle = (article) => {

    var figure=document.createElement('figure');
    figure.classList.add("card", "col-12", "col-md-6");
    figure.id=article._id;
    figure.innerHTML=("<img class='card-img-top' src="+ article.imageUrl + " alt=.../>" +"<figcaption class='card-body'> <h3 class='card-title'>"+ article.name +"</h3> <p class='card-text'><strong>"+ article.price+"</strong></p> </figcaption><a href='article.html?article_id="+article._id+"'class='stretched-link'> Voir détails du produits </a>");
    var articleContainer = document.getElementById("articles");
    articleContainer.appendChild(figure);
}


fetchArticles()

const price = document.getElementById("filter");
price.addEventListener('click', () => {
    var listFigure = document.getElementsByTagName('figure');
   
    //let produit0=listFigure[0];
    //let prix0=produit0.querySelector("strong").textContent;
    let listprix =[];
    let orderlistprix =[];
    //listFigure.shift();
    //console.log(listFigure);
    
    for (let figure of listFigure)
    {
    
    let prix = figure.getElementsByTagName("strong")[0].textContent;
    listprix.push(prix);
    orderlistprix.push(prix);
    
    }
   
    
    orderlistprix.sort();
    console.log(orderlistprix);
    let order=0;
    for (let prix of orderlistprix) {
        let index = listprix.indexOf(prix);
        order++;
        
        console.log(index);
        listFigure[index].classList.add("order-"+order);
    }

    
}
)
// async function getFigure() {
//     await fetchArticles();
//     let listFigure = document.getElementsByTagName('figure');
//    return listFigure 
// }
// getFigure();
// console.log('les produits' + listFigure.length);


// for (let article of listFigure) {
//     article.addEventListener('click', (e)=> {
//         var articleId =article.id;
//         localStorage.setItem('articleId', articleId );
//         e.preventDefault();
//     })
// };

  
  