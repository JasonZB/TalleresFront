async function getWeather() {
  const city = document.getElementById('cityInput').value;
  const apiKey = '58a8f9b10cabed39180a577ada08ab16'; 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Ciudad no encontrada');
    const data = await response.json();

    const temp = data.main.temp;
    const description = data.weather[0].description;
    const country = data.sys.country;

    document.getElementById('weatherResult').innerHTML = `
      <h2>${city}, ${country}</h2>
      <p>🌡️ Temperatura: ${temp}°C</p>
      <p>📝 Clima: ${description}</p>
    `;
  } catch (error) {
    document.getElementById('weatherResult').innerHTML = `<p>${error.message}</p>`;
  }
}
