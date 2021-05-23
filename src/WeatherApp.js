import "./styles.css";
// STEP 1：載入 useState
import React, { useState, useEffect, useCallback } from "react";
// STEP 2：匯入剛剛定義好的 findLocation 方法
import { findLocation } from "./utils";
// import React from "react";

// STEP 1：載入 emotion 的 styled 套件
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
import WeatherCard from "./WeatherCard.js";
import useWeatherApi from "./useWeatherApi.js";
import WeatherSetting from "./WeatherSetting.js";

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282"
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc"
  }
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherApp = () => {
  console.log("------invoke function component------");

  // STEP 1：使用 useState 定義當前要拉取天氣資訊的地區，預設值先定為「臺北市」
  const [currentCity, setCurrentCity] = useState("臺北市");
  const currentLocation = findLocation(currentCity) || {};

  const [weatherElement, fetchData] = useWeatherApi(currentLocation);

  const { theTheme, moment } = weatherElement;
  console.log(weatherElement);

  // STEP 1：定義 currentPage 這個 state，預設值是 WeatherCard
  const [currentPage, setCurrentPage] = useState("WeatherCard");

  return (
    <ThemeProvider theme={theme[theTheme]}>
      <Container>
        {console.log("render")}
        {/* STEP 2：利用條件渲染的方式決定要呈現哪個組件 */}
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={currentLocation.cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === "WeatherSetting" && (
          <WeatherSetting // STEP 6：把縣市名稱傳入 WeatherSetting 中當作表單「地區」欄位的預設值
            cityName={currentLocation.cityName}
            // STEP 7：把 setCurrentCity 傳入，讓 WeatherSetting 可以修改 currentCity
            setCurrentCity={setCurrentCity}
            setCurrentPage={setCurrentPage}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
