import React, { useState } from 'react';
import './weather.css';  // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSun,
    faCloud,
    faCloudRain,
    faSnowflake,
    faSmog,
    faBolt,
    faCloudSun,
    faCloudShowersHeavy,
    faWater
} from '@fortawesome/free-solid-svg-icons';

function Weather() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");

    const weatherIcons = {
        Clear: faSun,
        Clouds: faCloud,
        Rain: faCloudShowersHeavy,
        Snow: faSnowflake,
        Haze: faSmog,
        Mist: faWater,
        Thunderstorm: faBolt,
        Drizzle: faCloudRain
    };

    const iconColors = {
        Clear: "icon-clear",
        Clouds: "icon-clouds",
        Rain: "icon-rain",
        Snow: "icon-snow",
        Haze: "icon-haze",
        Mist: "icon-haze",
        Thunderstorm: "icon-thunderstorm",
        Drizzle: "icon-drizzle"
    };

    const handleClick = async (e) => {
        e.preventDefault();
        setError("");  
        setWeather(null);  
        try {
            const response = await fetch(`http://localhost:5000/api/weather?city=${city}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            setWeather(data);
        } catch (error) {
            setError("City not found");
            console.error("Error fetching weather data", error);
        }
    };

    const getWeatherByLocation = async (lat, lon) => {
        try {
            const response = await fetch(`http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`);
            if (!response.ok) {
                throw new Error("Failed to fetch weather data for your location");
            }
            const data = await response.json();
            setWeather(data);  
        } catch (error) {
            setError("Unable to fetch weather by location");
            console.error("Error fetching weather by location:", error);
        }
    };

    const handleLocationSearch = () => {
        setError("");  // Clear previous errors
        setWeather(null);  // Clear previous weather data
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByLocation(latitude, longitude);
            },
            (error) => {
                setError("Failed to retrieve your location.");
                console.error("Error getting location:", error);
            }
        );
    };

    const getWeatherIcon = (main) => {
        return weatherIcons[main] || faCloudSun;
    };

    const getIconColorClass = (main) => {
        return iconColors[main] || "icon-clouds"; // Default to cloudy icon color
    };

    return (
        <div className="weather-container">
            <form>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter the city"
                />
                <button onClick={handleClick}>Give Report</button>
                <button type="button" onClick={handleLocationSearch}>
                    Use Current Location
                </button>
            </form>
            {error && <p className="error">{error}</p>}
            {weather && (
                <div className="weather-report">
                    <h2>Weather in {weather.name}</h2>
                    <div className="weather-card">
                        <div className="weather-info">
                            <p>Temperature: <span>{(weather.main.temp - 273.15).toFixed(2)}°C</span></p><hr />
                            <p>Minimum Temperature: <span>{(weather.main.temp_min - 273.15).toFixed(2)}°C</span></p><hr />
                            <p>Maximum Temperature: <span>{(weather.main.temp_max - 273.15).toFixed(2)}°C</span></p><hr />
                            <p>Weather: <span>{weather.weather[0].description}</span></p><hr />
                            <p>Wind Speed: <span>{weather.wind.speed} m/s</span></p><hr />
                            <p>Humidity: <span>{weather.main.humidity}%</span></p><hr />
                        </div>
                        <FontAwesomeIcon
                            icon={getWeatherIcon(weather.weather[0].main)}
                            size="10x"
                            className={`weather-icon ${getIconColorClass(weather.weather[0].main)}`}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Weather;
