let allProducts = []
function getData()
{
    fetch("http://localhost:8000/products",{

    method:"GET"

    })
    .then((response)=>response.json())
    .then((products)=>{
        allProducts=products;
        displayData(allProducts);

    }).catch((err)=>{

        console.log(err);
        
    })
}
getData();

function displayData(products)
{
    document.getElementById("products").innerHTML="";
    products.forEach((product,index) => {
    let tr = document.createElement("tr");

    let noTD= document.createElement("td");
    noTD.append(index+1);
    tr.appendChild(noTD);

    let nameTD = document.createElement("td");
    nameTD.append(product.name);
    tr.appendChild(nameTD);

    let prizeTD = document.createElement("td");
    prizeTD.append(product.price);
    tr.appendChild(prizeTD);

    let qualityTD = document.createElement("td");
    qualityTD.append(product.quatity);
    tr.appendChild(qualityTD);

    let actionsTD = document.createElement("td");  

    let upIcon = document.createElement("i");
    upIcon.className="icon fa-solid fa-file-pen text-success";
    upIcon.setAttribute("data-bs-toggle","modal");
    upIcon.setAttribute("data-bs-target","#exampleModal");
    
    upIcon.addEventListener("click",()=>{
        setUpdateModel(product.id)
    })

    let delIcon = document.createElement("i");
    delIcon.className="icon fa-solid fa-trash text-danger";

    delIcon.addEventListener("click",()=>{
        deleteProduct(product.id);
    })

    actionsTD.appendChild(upIcon);
    actionsTD.appendChild(delIcon);

    tr.appendChild(actionsTD);

    document.getElementById("products").appendChild(tr);
});
}


function deleteProduct(id)
{
    fetch("http://localhost:8000/products?id="+id,{
        method:"DELETE"
    })
    .then((response)=>response.json())
    .then((msg)=>{
        if(msg.success===true)
        {
            let indexToDelete = allProducts.findIndex((product,index)=>{
                return Number(product.id)===Number(id);
            })
    
            allProducts.splice(indexToDelete,1);
            displayData(allProducts);
            toastModel(msg.message,true);    
        }
        else
        {
            toastModel(msg.message,false);    
        }

    }).catch((err)=>{

        console.log(err);
        
    })
}

function addData()
{
    let product={};
    product.id = Number(document.getElementById("id").value);
    product.name = document.getElementById("name").value;
    product.price = Number(document.getElementById("price").value);
    product.quatity = Number(document.getElementById("quatity").value);

    console.log(product);

    fetch("http://localhost:8000/products",{
        method:"POST",
        body:JSON.stringify(product),
        headers:{
            "Content-Type":"application/json"
        }
    }).then((response)=>response.json())
    .then((message)=>{
        allProducts.push(product);
        displayData(allProducts)
        toastModel(message.message,true);

    })
    .catch((err)=>{
        console.log(err);
    })
}

let idToUpdate = null;

function setUpdateModel(id){

    let product=allProducts.find((product,index)=>{
        return Number(product.id)===Number(id);
    })

    idToUpdate = product.id;

    document.getElementById("up_id").value = product.id;
    document.getElementById("up_name").value = product.name;
    document.getElementById("up_price").value = product.price;
    document.getElementById("up_quatity").value = product.quatity;

}

function updateData()
{

    let product={};
    product.id = Number(document.getElementById("up_id").value);
    product.name = document.getElementById("up_name").value;
    product.price = Number(document.getElementById("up_price").value);
    product.quatity = Number(document.getElementById("up_quatity").value);

    fetch("http://localhost:8000/products?id="+idToUpdate,{
        method:"PUT",
        body:JSON.stringify(product),
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then((response)=>response.json())
    .then((msg)=>{
        let productIndex = allProducts.findIndex((product,index)=>{
            return Number(product.id)===Number(idToUpdate);
        })

        allProducts[productIndex] = product;
        displayData(allProducts);
        toastModel(msg.message,true)
    })

}

function toastModel(message,success){
    document.getElementById("toast").innerText=message;
    document.getElementById("toast").style.right="0px";

    if(success===true)
    {
        document.getElementById("toast").classList.add("success-err");
        document.getElementById("toast").classList.remove("error-err");
    }
    else
    {
        document.getElementById("toast").classList.add("error-err");
        document.getElementById("toast").classList.remove("success-err");
    }
    setTimeout(()=>{
        document.getElementById("toast").style.right="-300px"
    },3000)
}