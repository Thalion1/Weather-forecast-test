export async function getWhere(props) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${props.input}&format=jsonv2`);
    const data = await response.json();
    
    return data;
}

export async function getWeather({lat, lon}) {
    const weatherCodeInfo = await fetch(`https://thalion1.github.io/static-apis/weather-id-to-icon.JSON`)
    const openMeteoResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m,wind_direction_80m,wind_speed_80m,is_day&forecast_days=3&wind_speed_unit=ms`);
    const pentResponse = await fetch(`https://pent.no/api/v2/long-term-forecast/${lat}/${lon}?days=3&resolution=1`);
    const weatherCodeInfoData = await weatherCodeInfo.json();
    const openMeteoData = await openMeteoResponse.json();
    const pentData = await pentResponse.json();
    
    console.log(weatherCodeInfoData);
    console.log(openMeteoData);
    console.log(pentData);
    
}