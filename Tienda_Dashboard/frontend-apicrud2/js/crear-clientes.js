//variables globales

const d = document;
let nameInput = d.querySelector("#nombre-cliente");
let lastnameInput = d.querySelector("#apellido-cliente");
let emailInput= d.querySelector("#email-cliente");
let phoneInput= d.querySelector("#celular-cliente");
let address1Input= d.querySelector("#direccion-cliente");
let address2Input= d.querySelector("#direccion2-cliente");
let descriptionInput= d.querySelector ("#descripcion-cliente");
let btnCreate= d.querySelector (".btn-create");
let clientUpdate= d.querySelector (".btn-update");




//Evento al boton del formulario

btnCreate.addEventListener ("click", ()=>{
//   alert( "Cliente: " + nameInput.value );
let dataClient= getDataClient();
sendDataClient(dataClient);

});

//evento al navegador para ver si recargó

d.addEventListener("DOMContentLoaded", () => {
    let clientEdit = JSON.parse(localStorage.getItem("clientEdit"));
    if (clientEdit != null) {
        localStorage.removeItem("clientEdit"); // ✅ borrar inmediatamente
        updateDataClient(clientEdit);          // ✅ pasar como parámetro
    } else {
        prepararFormularioParaCrear();         // ✅ mostrar solo botón "Crear"
    }
});


//funcion para validar el formulario y obtener los datos

let getDataClient = () => {
    if (
        nameInput.value &&
        lastnameInput.value &&
        emailInput.value &&
        phoneInput.value &&
        address1Input.value &&
        address2Input.value &&
        descriptionInput.value
    ) {
        let client = {
            nombre: nameInput.value,
            apellido: lastnameInput.value,
            email: emailInput.value,
            celular: phoneInput.value,
            direccion: address1Input.value,
            direccion2: address2Input.value,
            descripcion: descriptionInput.value
        };

        // Limpiar los campos del formulario
        nameInput.value = "";
        lastnameInput.value = "";
        emailInput.value = "";
        phoneInput.value = "";
        address1Input.value = "";
        address2Input.value = "";
        descriptionInput.value = "";

        return client;
    } else {
        alert("Todos los campos son obligatorios");
        return null;
    }
};


// Funcion para recibir los datos y realizar la peticion al servidor
let sendDataClient = async (data)=>{
    let url = "http://localhost/backend-apicrud/index.php?url=clientes";
    try {
        let respuesta = await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        });
        if (respuesta.status === 406) {
            alert("Los datos enviados no son válidos");
        }else{
            let Mensaje = await respuesta.json();
            alert(Mensaje.message);
            location.href = "../listado-clientes.html"
            
        }
    } catch (error) {
        console.log(error);
    }
};

//funcion para editar el cliente

let updateDataClient = (clientEdit) => {
    // Rellenar campos
    nameInput.value = clientEdit.nombre;
    lastnameInput.value = clientEdit.apellido;
    emailInput.value = clientEdit.email;
    phoneInput.value = clientEdit.celular;
    address1Input.value = clientEdit.direccion;
    address2Input.value = clientEdit.direccion2;
    descriptionInput.value = clientEdit.descripcion;

    // Alternar botones
    btnCreate.classList.add("d-none");
    clientUpdate.classList.remove("d-none");

    // Evento para actualizar
    clientUpdate.addEventListener("click", () => {
        let client = {
            id_cliente: clientEdit.id_cliente,
            nombre: nameInput.value,
            apellido: lastnameInput.value,
            email: emailInput.value,
            celular: phoneInput.value,
            direccion: address1Input.value,
            direccion2: address2Input.value,
            descripcion: descriptionInput.value
        };

        sendUpdateClient(client);
    });
};


//funcion para realizar la peticion del servidor
let sendUpdateClient = async (pro)=>{

       let url = "http://localhost/backend-apicrud/index.php?url=clientes";
    try {
        let respuesta = await fetch(url,{
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(pro)
        });
        if (respuesta.status === 406) {
            alert("Los datos enviados no son válidos");
        }else{
            let Mensaje = await respuesta.json();
            alert(Mensaje.message);
            location.href = "../listado-clientes.html"
            
        }
    } catch (error) {
        console.log(error);
    }

}