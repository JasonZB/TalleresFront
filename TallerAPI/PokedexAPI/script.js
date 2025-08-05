async function buscarPokemon() {
  const nombre = document.getElementById('pokemonInput').value.toLowerCase();
  const url = `https://pokeapi.co/api/v2/pokemon/${nombre}`;
  const card = document.getElementById('pokemonCard');
  card.innerHTML = ''; // Limpiar contenido anterior

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error('Pokémon no encontrado');
    const data = await respuesta.json();

    const habilidades = data.abilities.map(h => h.ability.name).join(', ');
    const tipos = data.types.map(t => t.type.name).join(', ');
    const imagen = data.sprites.front_default;

    card.innerHTML = `
      <img src="${imagen}" alt="${data.name}">
      <h2>${data.name.toUpperCase()}</h2>
      <ul>
        <li><strong>Tipo:</strong> ${tipos}</li>
        <li><strong>Habilidades:</strong> ${habilidades}</li>
        <li><strong>Altura:</strong> ${data.height}</li>
        <li><strong>Peso:</strong> ${data.weight}</li>
      </ul>
    `;
  } catch (error) {
    card.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}
