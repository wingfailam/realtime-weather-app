// 現在就讓我們來建立一個名為 useWeatherApi 的 Hook，在這個 Hook 中會幫助我們去向中央氣象局發送 API 請求，並且回傳取得的資料。

import { useState, useEffect, useCallback } from "react";

const fetchCurrentWeather = (locationName) => {
  console.log("fetchCurrentWeather", "locationName", locationName);
  const link =
    "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-55485538-D7C9-43D0-8C8E-8A673EA0D1B9&locationName=" +
    locationName;
  console.log("fetchCurrentWeather", "link", link);

  // STEP 3-1：加上 return 直接把 fetch API 回傳的 Promise 回傳出去
  return fetch(link)
    .then((response) => response.json())
    .then((data) => {
      // console.log("data", data);
      // STEP 1：定義 `locationData` 把回傳的資料中會用到的部分取出來
      const locationData = data.records.location[0];

      // STEP 2：將風速（WDSD）、氣溫（TEMP）和濕度（HUMD）的資料取出
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        },
        {}
      );

      // STEP 3：要使用到 React 組件中的資料
      // const currentWeatherData = {
      //   observationTime: locationData.time.obsTime,
      //   locationName: locationData.locationName,
      //   description: "多雲時晴",
      //   temperature: weatherElements.TEMP,
      //   windSpeed: weatherElements.WDSD,
      //   humid: weatherElements.HUMD
      // };

      // setWeatherElement((prevState) => ({
      //   ...prevState,
      //   observationTime: locationData.time.obsTime,
      //   locationName: locationData.locationName,
      //   temperature: weatherElements.TEMP,
      //   windSpeed: weatherElements.WDSD,
      //   humid: weatherElements.HUMD
      // }));

      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD
      };
    });
};

const fetchWeatherForecast = (cityName) => {
  console.log("fetchWeatherForecast", "cityName", cityName);
  const link =
    "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-55485538-D7C9-43D0-8C8E-8A673EA0D1B9&locationName=" +
    cityName;
  console.log("fetchWeatherForecast", "link", link);

  // STEP 3-1：加上 return 直接把 fetch API 回傳的 Promise 回傳出去
  return fetch(
    "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-55485538-D7C9-43D0-8C8E-8A673EA0D1B9&locationName=%E9%AB%98%E9%9B%84%E5%B8%82"
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];

      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );

      // 當箭頭函式單純只是要回傳物件時，可以連 return 都不寫，但回傳的物件需要使用小括號 () 包起來
      // setWeatherElement((prevState) => ({
      //   ...prevState,
      //   description: weatherElements.Wx.parameterName,
      //   weatherCode: weatherElements.Wx.parameterValue,
      //   rainPossibility: weatherElements.PoP.parameterName,
      //   comfortability: weatherElements.CI.parameterName
      // }));

      console.log(weatherElements.Wx.parameterName);

      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName
      };
    });
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat("zh", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(date)
    .replace(/\//g, "-");
};
// 由於現在 fetchCurrentWeather 和 fetchWeatherForecast 都不需要去修改 React 的資料狀態，是可以獨立存在的函式，因此為了避免每次組件重新渲染時都會重新去定義這兩個函式，可以把這兩個函式搬到 WeatherApp 的外面

const fetchSunriseAndSunset = (cityName) => {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(new Date().getDate() + 1);
  const todayFormatted = formatDate(now);
  const tomorrowFormatted = formatDate(tomorrow);

  console.log("fetchSunriseAndSunset", "cityName", cityName);
  const link = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=CWB-55485538-D7C9-43D0-8C8E-8A673EA0D1B9&locationName=${cityName}&timeFrom=${todayFormatted}&timeTo=${tomorrowFormatted}`;
  console.log("fetchSunriseAndSunset", "link", link);

  return fetch(link)
    .then((response) => response.json())
    .then((data) => {
      const parameters = data.records.locations.location[0].time[0].parameter;
      const sunrise = parameters.find(
        (parameter) => parameter.parameterName === "日出時刻"
      ).parameterValue;
      const sunset = parameters.find(
        (parameter) => parameter.parameterName === "日沒時刻"
      ).parameterValue;

      const sunriseTimeStamp = new Date(
        `${todayFormatted} ${sunrise}`
      ).getTime();
      const sunsetTimeStamp = new Date(`${todayFormatted} ${sunset}`).getTime();
      const nowTimeStamp = now.getTime();
      const theMoment =
        sunriseTimeStamp < nowTimeStamp && nowTimeStamp < sunsetTimeStamp
          ? "day"
          : "night";
      return theMoment;
    });
};

const useWeatherApi = (currentLocation) => {
  console.log("api");
  // STEP 2：定義會使用到的資料狀態
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    description: "",
    temperature: 0,
    windSpeed: 0,
    humid: 0,

    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",

    moment: "day",
    theTheme: "light",
    isLoading: true
  });

  // const [theMoment, setTheMoment] = useState("day");
  // const [theTheme, setTheTheme] = useState("light");

  // STEP 2：使用 useEffect Hook
  // useEffect 內的函式就很像是組件渲染完後要執行的 callback function。
  // useEffect 內的 function 會在組件渲染完後被呼叫，這個時間點剛好非常適合來呼叫 API 並更新資料
  // 當組件渲染完成後，會去執行 useEffect 中的函式，而這個函式中會去呼叫 fetchCurrentWeather，在 fetchCurrentWether 向 API 請求完資料後會呼叫到 setCurrentWeather，於是會促發組件重新渲染...，然後就繼續不斷這樣的循環...。
  // 第二個參數稱作 dependencies，它是一個陣列，只要每次重新渲染後 dependencies 內的元素沒有改變，任何 useEffect 裡面的函式就不會被執行！
  // 組件渲染完後，如果 dependencies 有改變，才會呼叫 useEffect 內的 function

  // fetchData 是一個函式，而在 JavaScript 中函式本質上就是物件的一種，物件在 JavaScript 中直接用 === 判斷並不是直接看屬性名稱和屬性值相不相同來決定的。舉例來說，當我們定義了兩個物件，即使物件內的屬性名稱和屬性值都一樣，使用 === 來判斷也會得到 false

  const fetchData = useCallback(() => {
    console.log("fetch");
    const fetchingData = async () => {
      // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
      // STEP 6：使用陣列的解構賦值把資料取出
      const [currentWeather, weatherForecast, theMoment] = await Promise.all([
        fetchCurrentWeather(currentLocation.locationName),
        fetchWeatherForecast(currentLocation.cityName),
        fetchSunriseAndSunset(currentLocation.cityName)
      ]);

      // STEP 7：把取得的資料透過物件的解構賦值放入
      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        moment: theMoment,
        theTheme: theMoment === "day" ? "light" : "dark",
        isLoading: false
      });

      // setTheMoment(theMoment);
      // setTheTheme(theMoment === "day" ? "light" : "dark");
    };
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true
    }));
    fetchingData();
    // fetchSunriseAndSunset();
    // STEP 5：因為 fetchingData 沒有相依到 React 組件中的資料狀態，所以 dependencies 陣列中不帶入元素
  }, [currentLocation]);

  // 使用 useCallback 後，只要它的 dependencies 沒有改變，它回傳的 fetchData 就可以指稱到同一個函式

  useEffect(() => {
    console.log("execute function in useEffect");
    // STEP 1：在 useEffect 中定義 async function 取名為 fetchData

    // STEP 6：把透過 useCallback 回傳的函式放到 useEffect 的 dependencies 中
    fetchData();
  }, [fetchData]);
  // STEP 5：把要給其他 React 組件使用的資料或方法回傳出去
  return [weatherElement, fetchData];
};

export default useWeatherApi;
