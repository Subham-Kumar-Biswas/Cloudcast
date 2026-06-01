// || API
const API_KEY = "5373d36803904df9bb9f5f3daa5eb86d";

// || DOM ELEMENTS
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");

const cityEl = document.querySelector(".city");
const tempEl = document.querySelector(".temperature");
const conditionEl = document.querySelector(".condition");
const feelsLikeEl = document.querySelector(".feels-like");
const highestEl = document.querySelector(".highest");
const lowestEl = document.querySelector(".lowest");

const humidityEl = document.querySelector(".humidity");
const windEl = document.querySelector(".wind");
const visibilityEl = document.querySelector(".visibility");
const pressureEl = document.querySelector(".pressure");

const forecastEl = document.querySelector(".forecast");
const loadingEl = document.querySelector(".loading-state");
const errorEl = document.querySelector(".error-state");


async function getWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();

    if(data.cod == 404) {
        showError("City not found. Please try again.");
        return;
    }

    displayWeather(data);
    getForecast(city);
};

function displayWeather(data) {
    hideError();

    cityEl.textContent = `${data.name}, ${data.sys.country}`;
    tempEl.textContent = `${Math.round(data.main.temp)}°C`;
    conditionEl.textContent = data.weather[0].description.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    feelsLikeEl.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
    highestEl.textContent = `H: ${Math.round(data.main.temp_max)}°C`;
    lowestEl.textContent = `L: ${Math.round(data.main.temp_min)}°C`;

    humidityEl.textContent = `${data.main.humidity}%`;
    windEl.textContent = `${Math.round(data.wind.speed)} km/h`;
    visibilityEl.textContent = `${(data.visibility) / 1000} km`;
    pressureEl.textContent = `${data.main.pressure} hPa`;
};

function getCity() {
    return searchInput.value.trim().replace(/\s+/g, " ");
};

searchBtn.addEventListener("click", function() {
    if (getCity() === "") return;
    getWeather(getCity());
});

searchInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        if(getCity() === "") return;
        getWeather(getCity());
    };
});

searchInput.addEventListener("input", function() {
    hideError();
})

locationBtn.addEventListener("click", function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
    });
});

async function getWeatherByCoords(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    displayWeather(data);
    getForecast(data.name);
};

function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
};

function hideError() {
    errorEl.textContent = "";
    errorEl.classList.add("hidden")
};

async function getForecast(city) {
    forecastEl.innerHTML = "";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();

    const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    daily.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("forecast-card");

        card.innerHTML = `
            <div class="day-name">${new Date(item.dt_txt).toLocaleDateString("en", {weekday: "short"})}</div>
            <div class="high-temp">${Math.round(item.main.temp_max)}°C</div>
            <div class="low-temp">${Math.round(item.main.temp_min)}°C</div>
        `;
        forecastEl.appendChild(card);
    })
};


getWeather("Delhi");