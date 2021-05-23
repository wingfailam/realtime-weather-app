import React, { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled";

import SunriseAndSunset from "./SunriseAndSunset.js";

import { ReactComponent as CloudyIcon } from "./images/day-cloudy.svg";

import { ReactComponent as DayThunderstorm } from "./images/day-thunderstorm.svg";
import { ReactComponent as DayClear } from "./images/day-clear.svg";
import { ReactComponent as DayCloudyFog } from "./images/day-cloudy-fog.svg";
import { ReactComponent as DayCloudy } from "./images/day-cloudy.svg";
import { ReactComponent as DayFog } from "./images/day-fog.svg";
import { ReactComponent as DayPartiallyClearWithRain } from "./images/day-partially-clear-with-rain.svg";
import { ReactComponent as DaySnowing } from "./images/day-snowing.svg";
import { ReactComponent as NightThunderstorm } from "./images/night-thunderstorm.svg";
import { ReactComponent as NightClear } from "./images/night-clear.svg";
import { ReactComponent as NightCloudyFog } from "./images/night-cloudy-fog.svg";
import { ReactComponent as NightCloudy } from "./images/night-cloudy.svg";
import { ReactComponent as NightFog } from "./images/night-fog.svg";
import { ReactComponent as NightPartiallyClearWithRain } from "./images/night-partially-clear-with-rain.svg";
import { ReactComponent as NightSnowing } from "./images/night-snowing.svg";

const weatherTypes = {
  isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
  isClear: [1],
  isCloudyFog: [25, 26, 27, 28],
  isCloudy: [2, 3, 4, 5, 6, 7],
  isFog: [24],
  isPartiallyClearWithRain: [
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    19,
    20,
    29,
    30,
    31,
    32,
    38,
    39
  ],
  isSnowing: [23, 37, 42]
};

const weatherIcons = {
  day: {
    isThunderstorm: <DayThunderstorm />,
    isClear: <DayClear />,
    isCloudyFog: <DayCloudyFog />,
    isCloudy: <DayCloudy />,
    isFog: <DayFog />,
    isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
    isSnowing: <DaySnowing />
  },
  night: {
    isThunderstorm: <NightThunderstorm />,
    isClear: <NightClear />,
    isCloudyFog: <NightCloudyFog />,
    isCloudy: <NightCloudy />,
    isFog: <NightFog />,
    isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
    isSnowing: <NightSnowing />
  }
};

// 假設從 API 取得的天氣代碼是 1
// const currentWeatherCode = 1;

// 透過 styled(組件) 來把樣式帶入已存在的組件中
const IconContainer = styled.div`
  /* 在這裡寫入 CSS 樣式 */
  flex-basis: 30%;
  svg {
    max-height: 110px;
  }
`;

// 使用迴圈來找出該天氣代碼對應到的天氣型態
const weatherCode2Type = (weatherCode) => {
  const [weatherType] =
    Object.entries(weatherTypes).find(([weatherType, weatherCodes]) =>
      weatherCodes.includes(Number(weatherCode))
    ) || [];

  return weatherType;
};

const WeatherIcon = ({ currentWeatherCode, moment }) => {
  console.log("WeatherIcon", "currentWeatherCode", currentWeatherCode);
  console.log("WeatherIcon", "moment", moment);
  const [currentWeatherIcon, setCurrentWeatherIcon] = useState("isClear");

  // useCallback 是用來在 dependencies 沒有改變的情況下，把某個 function 保存下來；useMemo 則是會在 dependencies 沒有改變的情況下，把某個運算的結果保存下來
  // 在 useMemo 的 dependencies 中放入 currentWeatherCode，當 currentWeatherCode 的值有變化的時候，useMemo 就會重新計算取值
  // 在 useEffect 的 dependencies 中放入 theWeatherIcon，當 theWeatherIcon 的值有變化時，才會再次執行 setCurrentWeatherIcon 來觸發畫面更新
  // 關於 useMemo 的使用有一點需要留意的是， useMemo 會在組件渲染時（rendering）被呼叫，因此不應該在這個時間點進行任何會有副作用（side effect）的操作；若需要有副作用的操作，則應該使用的是 useEffect 而不是 useMemo。

  const theWeatherIcon = useMemo(() => {
    return weatherCode2Type(currentWeatherCode);
  }, [currentWeatherCode]);

  useEffect(() => {
    console.log("WeatherIcon", "useEffect");
    // STEP 2：因為 weatherCode2Type 方法沒有要覆用，直接放到 `useEffect` 內即可

    setCurrentWeatherIcon(theWeatherIcon);
  }, [theWeatherIcon]);
  return (
    <IconContainer>{weatherIcons[moment][currentWeatherIcon]}</IconContainer>
  );
};

export default WeatherIcon;
