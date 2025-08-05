const API_URL = 'https://jsonplaceholder.typicode.com/photos?_limit=10';

async function cargarFotos() {
  try {
    const respuesta = await fetch(API_URL);
    const fotos = await respuesta.json();

    const contenedor = document.getElementById('gallery');

    fotos.forEach(foto => {
      const div = document.createElement('div');
      div.className = 'photo';
      div.innerHTML = `
        <img src="${foto.url}" alt="${foto.title}">
        <p>${foto.title}</p>
      `;
      contenedor.appendChild(div);
    });
  } catch (error) {
    console.error('Error al cargar las fotos:', error);
  }
}

cargarFotos();
