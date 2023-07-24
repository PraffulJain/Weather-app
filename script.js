const userTab=document.querySelector(".userWeather");
const searchCityTab=document.querySelector(".cityWeather");
const weatherDisplayBox=document.querySelector(".weather-box");
const grantBox=document.querySelector(".grant-location");
const searchBox=document.querySelector(".search-box");
const loadingBox=document.querySelector(".loading-box");
const userInfoBox=document.querySelector(".userInfo-box");

let oldTab=userTab;
const API_KEY="2e1d7804bc55b643767d70e303f88a7d";
oldTab.classList.add("current-tab");

getFromSessionStorage();

function switchTab(newTab){
    if(newTab !=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab")
        if(!searchBox.classList.contains("active")){
            grantBox.classList.remove("active")
            userInfoBox.classList.remove("active")
            searchBox.classList.add("active")
        }
        else{
            searchBox.classList.remove("active");
            userInfoBox.classList.remove("active");
            getFromSessionStorage();
        }

    }

}


userTab.addEventListener("click",()=>{
    switchTab(userTab);
})

searchCityTab.addEventListener("click",()=>{
    switchTab(searchCityTab);
})


function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-Coordinates");

    if(!localCoordinates){
        grantBox.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
    }
}

async function fetchWeatherInfo(coordinates){
const{lat,lon}=coordinates;
grantBox.classList.remove("active");
loadingBox.classList.add("active");


try{
const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
const data=await response.json();
loadingBox.classList.remove("active");
userInfoBox.classList.add("active");
renderWeatherInfo(data);
}
catch(err){
    loadingBox.classList.remove("active");
    console.log(err);
}
}

function renderWeatherInfo(weatherData){
const cityName=document.querySelector("[data-cityName]");
const countryFlag=document.querySelector("[countryFlag]");
const weatherDes=document.querySelector("[data-weatherDesc]");
const weatherIcon=document.querySelector("[data-weatherIcon]");
const temp=document.querySelector("[data-temp]");
const wind=document.querySelector("[data-windspeed]");
const humidity=document.querySelector("[data-humidity]");
const cloud=document.querySelector("[data-cloud]");


cityName.innerText=weatherData?.name;
countryFlag.src=`https://flagcdn.com/144x108/${weatherData?.sys?.country.toLowerCase()}.png`;
weatherDes.innerText=weatherData?.weather?.[0]?.description;
weatherIcon.src=`http://openweathermap.org/img/w/${weatherData?.weather?.[0]?.icon}.png`;
temp.innerText=`${weatherData?.main?.temp} °C`;
wind.innerText = `${weatherData?.wind?.speed} m/s`;
humidity.innerText = `${weatherData?.main?.humidity}%`;
cloud.innerText = `${weatherData?.clouds?.all}%`;

}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("no geolocation support available");
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-Coordinates", JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);

}


const grantBtn=document.querySelector(".grant-btn");
grantBtn.addEventListener("click",getLocation);
const searchInput=document.querySelector(".search");
searchBox.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    
    if(cityName==="")
        return;
    else
        fetchSearchWeatherInfo(cityName);
})


async function fetchSearchWeatherInfo(city){
    loadingBox.classList.add("active");
    userInfoBox.classList.remove("active");
    grantBox.classList.remove("active");

    try{
        const response=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
          const data=await response.json();
          loadingBox.classList.remove("active");
          userInfoBox.classList.add('active');
          renderWeatherInfo(data); 
          
        }

    catch(err){
        
        
    }
}

