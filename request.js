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
    figure.classList.add("card", "border-0", "shadow-sm");
    //figure.id=article._id;
    var img = document.createElement("img");
        img.classList.add('card-img-top');
        img.setAttribute("src", article.imageUrl);
        img.setAttribute("alt", ("photo de l'ours "+article.name));
    figure.appendChild(img);
    
    var caption = document.createElement("figcaption");
        caption.classList.add('card-body', 'text-center');
    figure.appendChild(caption);

    var title = document.createElement("h4");
        title.classList.add('card-title', 'text-left');
        title.innerHTML= article.name;
    caption.appendChild(title);

    var price=document.createElement("p");
        price.classList.add('card-text');
        price.innerHTML= ("<strong>"+ (article.price/100).toFixed(2)+"€</strong>");
    caption.appendChild(price);

    var details=document.createElement("a");
        details.classList.add("stretched-link", "btn", "btn-primary", "border-0");
        details.setAttribute("href", ("article.html?article_id="+article._id));
        details.innerHTML=("Voir les détails du produit");
    caption.appendChild(details);

    // figure.innerHTML=("<img class='card-img-top' src="+ article.imageUrl + " alt=.../>" +"<figcaption class='card-body text-center'> <h4 class='card-title text-left'>"+ article.name +"</h4> <p class='card-text'><strong>"+ (article.price/100).toFixed(2)+"€</strong></p> <a href='article.html?article_id="+article._id+"'class='stretched-link btn btn-primary border-0'> Voir les détails du produit </a></figcaption>");
    var articleContainer = document.getElementById("articles");

    var col=document.createElement('div');
        col.classList.add("col-12", "col-md-6");
    articleContainer.appendChild(col);

    col.appendChild(figure);
}


fetchArticles()

const pricedown = document.getElementById("filterdown");
const priceup = document.getElementById("filterup");

   


function order(direction){
var listFigure = document.getElementsByTagName('figure');
let listprix =[];
let orderlistprix =[];

for (let figure of listFigure)
{

let prix = figure.getElementsByTagName("strong")[0].textContent;
listprix.push(prix);
orderlistprix.push(prix);

}
orderlistprix.sort();
if (direction=="up") {orderlistprix.reverse();}
let order=0;
for (let prix of orderlistprix) {
    let index = listprix.indexOf(prix);
    order++;
    
var parent= listFigure[index].parentElement;
var parentOrder= parent.classList.item(2);
if (parentOrder==null) {
    parent.classList.add("order-"+order);
}
else {parent.classList.replace(parentOrder, ("order-"+order))}
}


}
pricedown.addEventListener('click', ()=>{order("down");});
priceup.addEventListener('click', ()=>{order("up");});
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

  
  