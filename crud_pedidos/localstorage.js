const d = document;

// Variables del formulario
let clienteInput = d.querySelector(".cliente");
let productoInput = d.querySelector(".producto");
let precioInput = d.querySelector(".precio");
let imagenInput = d.querySelector(".imagen");
let observacionInput = d.querySelector(".observacion");
let btnGuardar = d.querySelector(".btn-guardar");
let btnActualizar = d.querySelector(".btn-actualizar");

// Tabla donde se mostrarán los pedidos
let tabla = d.querySelector(".table tbody");

// Clave para localStorage
const listadoPedidos = "Pedidos";

// Evento al dar clic en "Guardar pedido"
btnGuardar.addEventListener("click", () => {
    let datos = validarFormulario();
    if (datos) {
        guardarDatos(datos);
        mostrarDatos();
    }
});

// Validación del formulario
function validarFormulario() {
    if (
        clienteInput.value === "" ||
        productoInput.value === "" ||
        precioInput.value === "" ||
        imagenInput.value === ""
    ) {
        alert("Todos los campos del formulario son obligatorios");
        return null;
    }

    const datosForm = {
        cliente: clienteInput.value,
        producto: productoInput.value,
        precio: precioInput.value,
        imagen: imagenInput.value,
        observacion: observacionInput.value
    };

    // Limpiar el formulario
    clienteInput.value = "";
    productoInput.value = "";
    precioInput.value = "";
    imagenInput.value = "";
    observacionInput.value = "";

    return datosForm;
}

// Guardar en localStorage
function guardarDatos(datos) {
    let pedidos = [];
    const pedidosPrevios = localStorage.getItem(listadoPedidos);
    if (pedidosPrevios !== null) {
        pedidos = JSON.parse(pedidosPrevios);
    }
    pedidos.push(datos);
    localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
    alert("Datos guardados con éxito");
}

// Mostrar los datos en la tabla
function mostrarDatos() {
    borrarTabla();
    const pedidosPrevios = localStorage.getItem(listadoPedidos);
    if (!pedidosPrevios) return;
    const pedidos = JSON.parse(pedidosPrevios);

    pedidos.forEach((p, i) => {
        if (!p || typeof p.cliente === "undefined") return;

        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${p.cliente}</td>
            <td>${p.producto}</td>
            <td>${p.precio}</td>
            <td><img src="${p.imagen}" style="width:50%;"></td>
            <td>${p.observacion}</td>
            <td>
                <span onclick="actualizarPedido(${i})" class="btn-editar btn btn-warning">📄</span>
                <span onclick="eliminarPedido(${i})" class="btn-eliminar btn btn-danger">✖️</span>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

// Limpiar las filas de la tabla
function borrarTabla() {
    tabla.innerHTML = "";
}

// Eliminar pedido
function eliminarPedido(pos) {
    const pedidosPrevios = localStorage.getItem(listadoPedidos);
    let pedidos = pedidosPrevios ? JSON.parse(pedidosPrevios) : [];

    let confirmar = confirm("¿Deseas eliminar el pedido del cliente: " + pedidos[pos].cliente + "?");
    if (confirmar) {
        let p = pedidos.splice(pos, 1)[0];
        alert("Pedido del cliente: " + p.cliente + " eliminado con éxito");
        localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
        borrarTabla();
        mostrarDatos();
    }
}

// ✅ NUEVO: Editar pedido
function actualizarPedido(pos) {
    const pedidos = JSON.parse(localStorage.getItem(listadoPedidos)) || [];

    clienteInput.value = pedidos[pos].cliente;
    productoInput.value = pedidos[pos].producto;
    precioInput.value = pedidos[pos].precio;
    imagenInput.value = pedidos[pos].imagen;
    observacionInput.value = pedidos[pos].observacion;

    localStorage.setItem("posEditar", pos);
    btnActualizar.classList.remove("d-none");
    btnGuardar.classList.add("d-none");
}

// Actualizar datos
btnActualizar.addEventListener("click", () => {
    const pos = localStorage.getItem("posEditar");
    const pedidos = JSON.parse(localStorage.getItem(listadoPedidos)) || [];

    if (!pos || !pedidos[pos]) return;

    if (
        clienteInput.value === "" ||
        productoInput.value === "" ||
        precioInput.value === "" ||
        imagenInput.value === ""
    ) {
        alert("Todos los campos son obligatorios");
        return;
    }

    pedidos[pos] = {
        cliente: clienteInput.value,
        producto: productoInput.value,
        precio: precioInput.value,
        imagen: imagenInput.value,
        observacion: observacionInput.value
    };

    localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
    alert("Pedido actualizado con éxito");

    clienteInput.value = "";
    productoInput.value = "";
    precioInput.value = "";
    imagenInput.value = "";
    observacionInput.value = "";

    btnActualizar.classList.add("d-none");
    btnGuardar.classList.remove("d-none");

    borrarTabla();
    mostrarDatos();
});

// Mostrar tabla al cargar la página
d.addEventListener("DOMContentLoaded", () => {
    borrarTabla();
    mostrarDatos();
});
