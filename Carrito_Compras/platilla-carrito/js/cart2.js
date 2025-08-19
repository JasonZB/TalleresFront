//varaibles globales
let iconCart = document.querySelector(".carrito");
let iconCount = document.querySelector(".contar-pro");
let btnProducts = document.querySelectorAll(".btn-product");
let contentProducts= document.querySelector(".content-pro");
let listCart = document.querySelector(".list-cart tbody")
let btnCart = document.querySelector(".btn-cart")
let con = 1;

//evento al navegador para cargar los productos
document.addEventListener("DOMContentLoaded",()=>{
    getProductData();
        // Inicializar contador del carrito desde localStorage
    updateCartCount();
    // Evento para redirigir al carrito
    btnCart.addEventListener("click", () => {
        location.href = "cart.html";
    });
})


//Agregar envento al icono del carrito
iconCart.addEventListener("click", () => {
    listCart.parentElement.classList.toggle("show");
});


//funcion para obtener informacion del producto
let getInfoProduct = (id) => {
    let products = [];
    let productPrevius = JSON.parse(localStorage.getItem('productos'));
    if (productPrevius != null) {
        products = Object.values(productPrevius);
    }

    // Agregar al DOM
    addProCart(products[id]);

    // Guardar en localStorage
    storageProduct(products[id]);

    // Actualizar contador
    updateCartCount();
};



//-------------------------------------------------
let updateCartCount = () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    iconCount.textContent = carrito.length;
};


//-------------------------------------------------


//funcion para guardar los productos del carrito en el localStorage
let storageProduct = (product) => {
    let products = [];
    let productPrevius = JSON.parse(localStorage.getItem('carrito'));
    if (productPrevius != null) {
        products = Object.values(productPrevius);
    }

    products.push(product);
    localStorage.setItem("carrito", JSON.stringify(products));
    console.log("Carrito actualizado:", localStorage.getItem("carrito"));
};


//Funcion para llevar la info del producto al carrito
let addProCart = (prod)=>{
    let row = document.createElement ("tr");
    row.innerHTML = `
        <td>${prod.id}</td>      
        <td><img src="${prod.imagen}" width="50px"</td>
        <td>${prod.nombre}</td>      
        <td>${prod.precio}</td>
        <td>
            <button onclick="deleteCart(${prod.id})" type="button" class="btn-delete btn btn-danger">X</button>    
        </td>
        `;
    listCart.appendChild(row);    

};

//funcion para eliminar un producto del carrito
let deleteCart = (idProducto)=>{
    console.log("Iniciando eliminación para ID:", idProducto);
    // 1. Eliminar el <tr> correspondiente
    let rows = document.querySelectorAll(".list-cart tbody tr");
    for (let row of rows) {
        if (row.firstElementChild.textContent == idProducto.toString()) {
            row.remove();
            break;
        }
    }

    // 2. Obtener carrito del localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    console.log("Carrito antes de eliminar:", carrito);

    // 3. Eliminar producto por su ID real
    let index = carrito.findIndex(item => item.id === idProducto);
    if (index !== -1) {
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }
    console.log("Carrito después de eliminar:", carrito);
    // 4. Actualizar contador
    let count = Number(iconCount.textContent);
    iconCount.textContent = count > 0 ? count - 1 : 0;
}


//funcion para traer los datos de la BD a la tienda
let getProductData = async ()=>{
    let url = "http://localhost/backend-apiCrud/productos";
    try {
        let respuesta = await fetch(url,{
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        });
        if (respuesta.status === 204) {
           console.log("No hay datos en la BD");
        }else{
            let tableData = await respuesta.json();
            console.log(tableData);
            //agregar los datos de la tabla a localStorage
            localStorage.setItem("productos", JSON.stringify(tableData));
            //agregar los datos a la tabla
            tableData.forEach((dato, i)=>{
                
                contentProducts.innerHTML += `
                    <div class="col-md-3 py-3 py-md-0">
                        <div class="card">
                        <img src="${dato.imagen}" alt="">
                            <div class="card-body">
                                <h3>${dato.nombre}</h3>
                                <p>${dato.descripcion}</p>
                                <h5>$${dato.precio} 
                                    <span class="btn-product" onclick="getInfoProduct(${i})"><i class="fa-solid fa-basket-shopping"></i></span></h5>
                            </div>
                        </div>
                    </div>`;
            });
           
        }
    } catch (error) {
        console.log(error);
    }

};