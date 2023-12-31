import { useState } from "react";
import "./style.scss";
import backgroundImage from "./assets/background.jpg";
import {
  capitalize,
  clock,
  convertKm,
  convertfromMphtoKm,
  humidityCheck
} from "./functions";
export default function App() {
  const apiKey = "d54919d21826957b16fa1de8e3099d25";

  const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
  const weekdaysApiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
  const iconUrl = "http://openweathermap.org/img/wn/";
  const [weatherObj, setWeatherObj] = useState({
    name: "",
    country: "",
    weatherMain: "",
    temp: "",
    feelsLike: "",
    humidity: "",
    main: "",
    icon: "",
    windSpeed: "",
    sunrise: "",
    sunset: ""
  });

  const date = new Date();
  let nameDay = capitalize(date.toLocaleString("en-US", { weekday: "long" }));

  const [location, setLocation] = useState("London");
  const [weatherArr, setWeatherArr] = useState();
  async function checkWeather() {
    const response = await fetch(`${apiUrl}${location}&appid=${apiKey}`);
    var data = await response.json();

    const response7days = await fetch(
      `${weekdaysApiUrl}${location}&appid=${apiKey}`
    );
    var dataWeek = await response7days.json();
    console.log(dataWeek);
    console.log(data);
    setWeatherArr(dataWeek);
    setWeatherObj({
      name: `${data.name}, ${data.sys.country}`,
      weatherMain: data.weather[0].main,
      temp: `${Math.round(Number(data.main.temp))}`,
      feelsLike: `${Math.round(Number(data.main.feels_like))}° C`,
      humidity: data.main.humidity,
      icon: `${iconUrl}${data.weather[0].icon}@2x.png`,
      description: data.weather[0].description,
      visibility: `${convertKm(data.visibility)}km`,
      maxTemp: `${Math.round(Number(data.main.temp_max))}° C`,
      minTemp: `${Math.round(Number(data.main.temp_min))}° C`,
      windSpeed: `${convertfromMphtoKm(data.wind.speed)} km/h`,
      sunrise: new Date(data.sys.sunrise * 1000).toString().slice(16, 21),
      sunset: new Date(data.sys.sunset * 1000).toString().slice(16, 21)
    });
  }

  return (
    <div className="App" style={{ background: `url(${backgroundImage})` }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <input
          type="text"
          onChange={(e) => {
            setLocation(e.target.value);
          }}
          style={{ marginTop: "20px" }}
        />
        <button style={{ marginTop: "20px" }} onClick={checkWeather}>
          Check the weather!
        </button>
      </div>
      <div className={"main-container"}>
        <div className={"weather-container"}>
          <img
            style={{ width: "180px", display: "block", margin: "0 auto" }}
            src={weatherObj.name !== "" ? weatherObj.icon : ""}
            alt={""}
          />

          <h1 style={{ fontSize: "4.2rem" }}>
            {weatherObj.temp}{" "}
            <span
              style={{
                fontSize: "1.3rem",
                position: "absolute",
                marginTop: "10px"
              }}
            >
              {weatherObj.temp !== "" ? "°C" : ""}
            </span>
          </h1>
          <h1 style={{ marginTop: "40px" }}>
            {weatherObj.name !== "" ? `${nameDay}, ${clock()}` : ""}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <img
              style={{
                width: "50px",
                marginLeft: "-5px"
              }}
              src={weatherObj.icon !== "" ? weatherObj.icon : null}
              alt={""}
            />
            <h1>{weatherObj.description}</h1>
          </div>
          <h1 style={{ textAlign: "center", marginTop: "40px" }}>
            {weatherObj.name}
          </h1>
          <img
            src={
              weatherObj.name !== ""
                ? `https://flagsapi.com/${weatherObj.name.slice(
                    -2
                  )}/flat/64.png`
                : null
            }
            alt={""}
            style={{ display: "block", margin: "0 auto" }}
          />
        </div>
        <div className={"humidity-container"}>
          <h2>{weatherObj.name !== "" ? "Humidity" : ""}</h2>
          <h1 style={{ fontSize: "3.5rem" }}>
            {weatherObj.name !== "" ? `${weatherObj.humidity}%` : ""}
          </h1>
          <h3>
            {weatherObj.humidity !== ""
              ? humidityCheck(weatherObj.humidity)
              : ""}
          </h3>
        </div>
        <div className={"wind-speed-container"}>
          <h2 style={{}}>{weatherObj.name !== "" ? "Wind Speed" : ""}</h2>
          <h1 style={{ fontSize: "3.5rem" }}>{weatherObj.windSpeed}</h1>
        </div>
        <div className={"visibility-container"}>
          <h2 style={{}}>{weatherObj.name !== "" ? "Visiblity" : ""}</h2>
          <h1 style={{ fontSize: "3.5rem" }}>{weatherObj.visibility}</h1>
        </div>
        <div className={"sun-container"}>
          <h2>{weatherObj.name !== "" ? "Sunrise" : ""}</h2>
          <h2 style={{}}>{weatherObj.name !== "" ? weatherObj.sunrise : ""}</h2>
          <h2>{weatherObj.name !== "" ? "Sunset" : ""}</h2>
          <h2 style={{}}>{weatherObj.name !== "" ? weatherObj.sunset : ""}</h2>
        </div>
        <div className="div6">
          {weatherArr !== undefined
            ? weatherArr.list.map((element, index) =>
                element.dt_txt.includes("12:00:00") ? (
                  <div key={index} style={{ justifyContent: "center" }}>
                    <h2 style={{ textAlign: "center" }}>
                      {new Date(element.dt * 1000).toString().slice(0, 3)}
                    </h2>
                    <img
                      src={`${iconUrl}${element.weather[0].icon}.png`}
                      alt={"icon"}
                      style={{ width: "70px" }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around"
                      }}
                    >
                      <h4>{`${Math.round(element.main.temp_min)}°`}</h4>
                      <h4>{`${Math.round(element.main.temp_max)}°`}</h4>
                    </div>
                  </div>
                ) : null
              )
            : null}
        </div>
      </div>
    </div>
  );
}
