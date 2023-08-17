
const weatherSearchButton = document.getElementById('weather-searchButton')
const countryPosition = document.getElementById('country-position')
       
function convertTime(t){
    var ot = new Date(t*1000)
    var dt = ot.getDate();
    var h = ot.getHours()
    var m = ot.getMinutes()
    var s = ot.getSeconds();
    return dt + "일 " + h + "시"
}

countryPosition.addEventListener('keyup',(event)=>{
    if(event.keyCode === 13){
        event.preventDefault();
        $('#weatherTable-container').css('display','block')
        $('#searchWeather').css('margin-top','0%')
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${countryPosition.value}&appid=6e2116fd499cad3a1f4&units=metric`)
        .then(async (data) => await data.json())
        .then((data) => {
            //weatherTemperature.value = data.main.temp
            //weatherImage.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
            fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=6e2116fd499cad3a1f4&units=metric`)
                .then(async (res) => await res.json())
                .then((res)=>{
                    //weatherTemperature.value = res.current.temp
                    //weatherImage.src = `https://openweathermap.org/img/wn/${res.current.weather[0].icon}.png`

                    for(var i = 0;i < 12;i++){
                        var ctime = res.hourly[i].dt
                        //console.log(ctime)
                        var ctemp = res.hourly[i].temp
                        //console.log(ctemp)
                        var cimg = res.hourly[i].weather[0].icon
                        var cstate = res.hourly[i].weather[0].main

                        var currenttime = convertTime(ctime)
                        $(`.weatherTime${i}`).html(currenttime)
                        console.log($(`.weatherTime${i}`).html())
                        $(`.weatherTemp${i}`).html(ctemp)
                        $(`.weatherState${i}`).html(cstate)
                        //$(`.weatherImage${i}`).attr('src',`https://openweathermap.org/img/wn/${cimg}.png`)
                    }
                    
                })
        })
    }
    
})
/*weatherSearchButton.addEventListener('click',() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${countryPosition.value}&appid=6e2116fd499cad3a1f4&units=metric`)
    .then(async (data) => await data.json())
    .then((data) => {
        //weatherTemperature.value = data.main.temp
        //weatherImage.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=6e2116fd499cad3a1f4&units=metric`)
            .then(async (res) => await res.json())
            .then((res)=>{
                //weatherTemperature.value = res.current.temp
                //weatherImage.src = `https://openweathermap.org/img/wn/${res.current.weather[0].icon}.png`

                for(var i = 0;i < 12;i++){
                    var ctime = res.hourly[i].dt
                    //console.log(ctime)
                    var ctemp = res.hourly[i].temp
                    //console.log(ctemp)
                    var cimg = res.hourly[i].weather[0].icon
                    var cstate = res.hourly[i].weather[0].main

                    var currenttime = convertTime(ctime)
                    $(`.weatherTime${i}`).html(currenttime)
                    console.log($(`.weatherTime${i}`).html())
                    $(`.weatherTemp${i}`).html(ctemp)
                    $(`.weatherState${i}`).html(cstate)
                    //$(`.weatherImage${i}`).attr('src',`https://openweathermap.org/img/wn/${cimg}.png`)
                }
                
            })
    })
})*/
   