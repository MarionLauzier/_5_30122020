// //
//         //console.log(productData);
//         

//         // let productQuantity = document.createElement('td');
//         // productQuantity.textContent=quantityK;
//         // productRow.appendChild(productQuantity);

//         // let productPrice = document.createElement('td');
//         // productPrice.textContent=productData.price;
//         // productRow.appendChild(productPrice);
//         productRow.innerHTML=("<td>"+productK+"</td><td>"+quantityK+"</td>");
//         table.appendChild(productRow);
//       //}
//}


async function fetchProductSummary(productId) {
    fetch("http://localhost:3000/api/teddies/"+productId)
     .then(response => {
         if (!response.ok) { 
             throw new Error('Server response is not successful');
            } 
        return response.json()
     })
     .then (response => { console.log(response.name);})
     .catch(error => alert("Erreur : " + error));
    }

    fetchProductSummary("5beaa8bf1c9d440000a57d94").then(name=>{console.log(name);});   
//summary();
//     //summary();
//async function test(){
 //return await fetch("http://localhost:3000/api/teddies/5beaa8bf1c9d440000a57d94");}
//  var testr = fetchProductSummary("5beaa8bf1c9d440000a57d94") ;
// console.log(testr);
// var response = test.response;
// console.log(response);
// var body= response.json();
// console.log(body);

let order=document.getElementsByTagName("button")[0];
order.addEventListener("click", ()=>{localStorage.clear();});