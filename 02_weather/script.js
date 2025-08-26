document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("city-input");
  const getWeatherbtn = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById("weather-info");
  const cityNameDisplay = document.getElementById("city-name");
  const temperatureDisplay = document.getElementById("temperature");
  const descriptionDisplay = document.getElementById("description");
  const errormsg = document.getElementById("error-message");
  const api_key = "use your own key"; //env variables

  getWeatherbtn.addEventListener("click", async () => {
    const cityname = cityInput.value.trim();
    if (!cityname) return;

    // it may throw an error
    // server/database is always in another continent
    try {
      const weatherdata = await fetchWeatherData(cityname);
      displayWeatherData(weatherdata);
    } catch (error) {
      showError();
    }
  });

  async function fetchWeatherData(city) {
    //gets the data
    // Note the 'open' in the domain name!
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`;
    const response = await fetch(url);
    console.log(typeof response);
    console.log("RESPONSE", response);
    if (!response.ok) {
      throw new Error("city not found");
    }
    const data = await response.json();
    return data;
  }
  function displayWeatherData(data) {
    console.log(data);
    const { name, main, weather } = data;
    cityNameDisplay.textContent = name;

    //unlock the display
    weatherInfo.classList.remove("hidden");
    errormsg.classList.add("hidden");
    temperatureDisplay.textContent = `Temperature: ${main.temp}`;
    descriptionDisplay.textContent = `Weather: ${weather[0].description}`;
  }
  function showError() {
    weatherInfo.classList.add("hidden");
    errormsg.classList.remove("hidden");
  }
});
