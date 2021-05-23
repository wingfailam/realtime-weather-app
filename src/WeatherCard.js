import React from "react";
import styled from "@emotion/styled";
import WeatherIcon from "./WeatherIcon.js";

// STEP 1：使用 import { ReactComponent as xxx } from xxx 載入 SVG
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
import { ReactComponent as LoadingIcon } from "./images/loading.svg";
import { ReactComponent as CogIcon } from "./images/cog.svg";

const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;

// 第二種方式：直接 import SVG 並搭配 img
// 這種方法因為是把 SVG 以圖檔的形式載入，因此後續比較難去修改 SVG 圖示的顏色、粗細或製作動畫等效果，但若單純只是要以圖檔呈現，使用這種方式較簡便

// STEP 2：定義帶有 styled 的 component
// 在 styled.div 後面加上兩個反引號（和 Template Literals 用的符號相同），在兩個反引號之間就可以 直接撰寫 CSS 。實際上這裡的 styled.div 是一個函式，而在函式後面直接加上反引號一樣屬於 Template Literals 的一種用法，只是比較少情況會這樣使用。
// 打開瀏覽器的開發者工具可以看到，這些帶有樣式的組件，最後都會帶上特殊的 class 名稱，並且套用上所撰寫的 CSS 樣式，而這也就是為什麼不同組件之間的 CSS 樣式不會相互干擾的原因。即使這不同頁面中都定義了一個同樣名為 <Container /> 的 styled-component，但因為它們最終會帶上不同的 class 名稱，因此組件間的樣式並不會相互干擾

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

// 定義帶有樣式的 `<Location />` 組件
// 在兩個反引號中放入該 Component 的 CSS 樣式
const Location = styled.div`
  font-size: 28px;
  color: #212121;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: #828282;
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  /* color: #757575; */
  color: ${({ theme }) => theme.textColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const TheLastRefreshTime = styled.div`
  /* position: absolute;
  right: 15px;
  bottom: 15px; */

  font-size: 14px;
  color: #828282;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
`;

const Refresh = styled(RefreshIcon)`
  /* 在這裡寫入 CSS 樣式 */
  margin-left: 10px;
  width: 15px;
  height: 15px;

  cursor: pointer;
`;
const Loading = styled(LoadingIcon)`
  /* 在這裡寫入 CSS 樣式 */
  margin-left: 10px;
  width: 15px;
  height: 15px;

  cursor: pointer;
  animation: rotate infinite 1.5s linear;
  
  /* STEP 2：取得傳入的 props 並根據它來決定動畫要不要執行 */
  /* animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")}; */

  /* STEP 1：定義旋轉的動畫效果，並取名為 rotate */
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

const WeatherCard = (props) => {
  // STEP 2：透過物件的解構賦值從 props 中取出傳入的資料
  const {
    weatherElement,
    moment,
    fetchData,
    cityName,
    setCurrentCity,
    setCurrentPage
  } = props;
  const {
    observationTime,
    // locationName,     // STEP 3：將多餘的變數移除
    description,
    temperature,
    windSpeed,

    weatherCode,
    rainPossibility,
    comfortability,
    isLoading
  } = weatherElement;

  return (
    <WeatherCardWrapper>
      <Cog onClick={() => setCurrentPage("WeatherSetting")} />
      {/* <h1>Weather</h1> */}
      <Location>{cityName}</Location>
      <Description>
        {/* {weatherElement.observationTime} */}
        {description}
        {"／"}
        {comfortability}
      </Description>
      <CurrentWeather>
        <Temperature>
          {Math.round(temperature)}
          <Celsius>°c</Celsius>
        </Temperature>
        <WeatherIcon currentWeatherCode={weatherCode} moment={moment} />
      </CurrentWeather>
      <AirFlow>
        <AirFlowIcon />
        {windSpeed} m/h
      </AirFlow>
      <Rain>
        <RainIcon />
        {Math.round(rainPossibility)} %
      </Rain>
      <TheLastRefreshTime>
        最後觀測時間{" "}
        {new Intl.DateTimeFormat("zh-TW", {
          hour: "numeric",
          minute: "numeric"
        }).format(new Date(observationTime))}
        {isLoading ? (
          <Loading />
        ) : (
          <Refresh
            onClick={() => {
              fetchData();
            }}
          />
        )}
      </TheLastRefreshTime>
    </WeatherCardWrapper>
  );
};

export default WeatherCard;
