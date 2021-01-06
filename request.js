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
 .catch(error => alert("Erreur : " + error));
}


const addArticle = (article) => {

    var figure=document.createElement('figure');
    figure.classList.add("card", "col-12", "col-md-6");
    figure.id=article._id;
    figure.innerHTML=("<img class='card-img-top' src="+ article.imageUrl + " alt=.../>" +"<figcaption class='card-body'> <h3 class='card-title'>"+ article.name +"</h3> <p class='card-text'><strong>"+ article.price+"</strong></p> </figcaption><a href='article.html'class='stretched-link'> Voir détails du produits </a>");
    var articleContainer = document.getElementById("articles");
    articleContainer.appendChild(figure);
}

// fetch("http://localhost:3000/api/teddies")
//  .then( response => { if(!response.ok) { 
//     throw new Error('Server response is not successful');
//    }  
//    return response.json()})
//  .then ( response => {
//      //let article=response[0]; 
//      addArticle(response[0])
//     //alert(JSON.stringify(response[1])
//  })
//  .catch(error => alert("Erreur : " + error));


    let testarticle ={"name": "ours1", "price":"100", "imageUrl": "img/logo.png"};
   fetchArticles();

   window.addEventListener("load", ()=>{
    let listFigure = document.getElementsByTagName('figure');
    //alert(listFigure[0]);
console.log('les produits' + listFigure[0]);
// for (let article of listFigure) {
//     article.addEventListener('click', (e)=> {
//         var articleId =article.id;
//         localStorage.setItem('articleId', articleId );
//         e.preventDefault();
//     })
// };
});
  
  