let tableCart = document.querySelector (".cart-table tbody")
let resumenSubtotal = document.querySelector(".cart-summary .sub-total");
let resumenDescuento = document.querySelector(".promo");
let resumenTotal = document.querySelector(".cart-summary .total");
let tagDelivery = document.querySelector(".cart-summary .valor-domi");
let destino = document.querySelector(".destino")
let resumenDomicilio = document.querySelector(".valor-domi")
let btnResumen = document.querySelector(".btn-resumen")

//evento para recargar el navegador
document.addEventListener("DOMContentLoaded", ()=>{
    getProductCar();
})

//Detalle de la compra
let updateOrderDetail = ()=>{
    let subtotal = 0;

}


//funcion para las cantidades del carrito
let infoOrder = (pos) => {
    let countProduct = document.querySelectorAll(".quantity input.number");
    let btnDecrement = document.querySelectorAll(".decrement i");
    let btnIncrement = document.querySelectorAll(".increment i");
    let totalPro = document.querySelectorAll(".total-Pro");
    let preciosUnitarios = document.querySelectorAll("td:nth-child(2) p");

    let precioUnitario = Number(preciosUnitarios[pos].textContent.replace("$", "").replace(",", ""));

    // Función para actualizar localStorage
    const actualizarCantidadEnLocalStorage = (index, nuevaCantidad) => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        if (carrito[index]) {
            carrito[index].cantidad = nuevaCantidad;
            localStorage.setItem("carrito", JSON.stringify(carrito));
        }
    };

    // Botón "+"
    btnIncrement[pos].addEventListener("click", () => {
        let currentValue = Number(countProduct[pos].value);
        let newQuantity = currentValue + 1;
        countProduct[pos].value = newQuantity;

        let nuevoTotal = precioUnitario * newQuantity;
        totalPro[pos].textContent = `$${nuevoTotal}`;

        actualizarCantidadEnLocalStorage(pos, newQuantity);
        resumenCompra();
    });

    // Botón "-"
    btnDecrement[pos].addEventListener("click", () => {
        let currentValue = Number(countProduct[pos].value);
        if (currentValue > 1) {
            let newQuantity = currentValue - 1;
            countProduct[pos].value = newQuantity;

            let nuevoTotal = precioUnitario * newQuantity;
            totalPro[pos].textContent = `$${nuevoTotal}`;

            actualizarCantidadEnLocalStorage(pos, newQuantity);
            resumenCompra();
        }
    });
};


let getProductCar = ()=>{
    let products = [];
    let productsLocal = JSON.parse(localStorage.getItem("carrito"));
    if ( productsLocal != null){
        products = Object.values(productsLocal);
    }
    //mostrar los productos de local Storage en consola
    console.log(products);
    products.forEach((dato,i)=>{
        let row = document.createElement("tr");
        row.setAttribute("data-id", dato.id);
        row.innerHTML =`  
            <td class="product-block">
                <a href="#" class="remove-from-cart-btn"><i class="fa-solid fa-x"></i></a>
                <img src="${dato.imagen}" alt="">
                <a href="product-detail.html" class="h6">${dato.nombre}</a>
            </td>
            <td>
                <p class="lead color-black">$${dato.precio}</p>
            </td>
            <td>
                <div class="quantity quantity-wrap">
                    <div class="decrement"><i class="fa-solid fa-minus"></i></div>
                    <input type="text" name="quantity" value="1" maxlength="2" size="1" class="number">
                    <div class="increment"><i class="fa-solid fa-plus"></i></div>
                </div>
            </td>
            <td>
                <h6 class="total-Pro">$${dato.precio}</h6>
            </td>
        `;
//evento para eliminar producto
    row.querySelector(".remove-from-cart-btn").addEventListener("click", (e) => {
        e.preventDefault();
        let idEliminar = dato.id;

        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        let index = carrito.findIndex(p => p.id === idEliminar);
        if (index !== -1) {
            carrito.splice(index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
        } 
/*         window.eliminarProductoDelCarrito(dato.id); */

        row.remove();
        //ejecutar el resumen de compra
        resumenCompra();
    });

        tableCart.appendChild(row);
        infoOrder(i)
    });
//ejecutar el resumen de compra
    resumenCompra();

}

//funcion para el resumen de compra
function resumenCompra(){
    let todosProductos = JSON.parse(localStorage.getItem("carrito")) || [];
    let subtotal = 0; //acumular el subtotal de los productos
    //recorrer cada producto y se acumulan en el subtotal
    todosProductos.forEach((producto)=>{
        subtotal += producto.precio * (producto.cantidad || 1);
    })

    //calcular valor del domicilio
    let domicilio = 0;
    switch (destino.value){
        case "Medellin": domicilio = 0; break;
        case "Bello": domicilio = 10000; break;
        case "Envigado": case "Itagui": domicilio = 15000; break;
        case "Sabaneta": case "Estrella": domicilio = 17000; break;
        case "Caldas": domicilio = 20000; break;
        default: domicilio = 0;
        break;
    }

    //calcular descuento del 10% si la compra es mayor a 100000
    let descuento = (subtotal > 100000) ? subtotal * 0.1 : 0; 

    //calcular el total a pagar
    let totalPagar = subtotal - descuento + domicilio;

    //Mostrar subtotal en pantalla
    resumenSubtotal.textContent = subtotal
    resumenDescuento.textContent = descuento
    resumenDomicilio.textContent = domicilio
    resumenTotal.textContent = totalPagar
    

}
//agregar evento al destino para calcular el valor del domicilio
destino.addEventListener("change", ()=>{
    //actualice el resumen de la compra
    resumenCompra()
})

//evento al boton pagar para guardar el resumen de compra
btnResumen.addEventListener("click", ()=>{
    //extraer info del local storage
    let todosProductos = JSON.parse(localStorage.getItem("carrito")) || [];
    let resumen = {
        //generar copia de todos los productos
        "productos": todosProductos,

    }
    //llenar resumen de informacion
    resumen.promocion = resumenDescuento.textContent;
    resumen.domicilio = resumenDomicilio.textContent;
    resumen.totalPagar = resumenTotal.textContent;
    resumen.destino = destino.value;
    //guardar en localStorage
    localStorage.setItem('pro-resumen',JSON.stringify(resumen));
    //redirigir a la pagina de pago
    location.href = "checkout.html"
})