import playList from "./playlist.js"
import vocabulary from "./translation.js"

const wrapper = document.querySelector('.wrapper')
const settingsButton = document.querySelector('.settings__button')
const time = document.querySelector('.time')
const date = document.querySelector('.date')
const greeting = document.querySelector('.greeting')
const greetingContainer = document.querySelector('.greeting-container')
const name = document.querySelector('.greeting__name')
const sliderNext = document.querySelector('.slider-next')
const sliderPrev = document.querySelector('.slider-prev')
const sliderButton = document.querySelectorAll('.slider-button')
const api = document.querySelector('.api-list')
const tagInput = document.querySelector('.selecet-bg-src')
const settingContainer = document.querySelector('.settings__container')
const qoutes = document.querySelector('.quote')
const toDo = document.querySelector('.to-do')

const weather = document.querySelector('.weather')
const weatherIcon = document.querySelector('.weather-icon')
const temperature = document.querySelector('.temperature')
const weatherDescription = document.querySelector('.weather-description')
const windSpeed = document.querySelector('.wind-speed')
const humidity = document.querySelector('.humidity')
const city = document.querySelector('.city')

const player = document.querySelector('.player')
const play = document.querySelector('.play')
const prev = document.querySelector('.play-prev')
const next = document.querySelector('.play-next')
const progressBar = document.querySelector('.player-bar')
const progress = document.querySelector('.player-bar__progress')
const playlist = document.querySelector('.playlist')
const playItem = playlist.children
const songTitle = document.querySelector('.song-title')
const volume = document.querySelector('.volume')
const volumeBar = document.querySelector('.volume-bar')
const volumeBarProgress = document.querySelector('.volume-bar__progress')
const songCurrentTime = document.querySelector('.song-current-time')
const songDuration = document.querySelector('.song-duration')
const extender = document.querySelector('.change-content')

let settingsCheckbox = document.querySelectorAll('.settings-checkbox')

console.log('Доброго времени суток, лень расписывать, сделал всё по ТЗ. Это максималка, ну правда. Если что - discord Dman#6894');

////// Time and Date /////////////

function showTime() {
    const currentTime = new Date().toLocaleTimeString()
    time.innerHTML = currentTime
    setTimeout(showTime, 1000)
    showDate()
    greeting.innerHTML = `${greetingUpdate()}`
}

function showDate() {
    const currentDate = new Date().toLocaleDateString(`${localStorage.getItem('lang') === 'ru' ? 'ru-RU' : 'en-GB'}`, {weekday: 'long', month: 'long', day: 'numeric',})
    date.innerHTML = currentDate
}

showTime()

////// Greeting /////////////////

function timeOfDay() {
    const partOfDay = new Date().getHours()
    if(partOfDay >= 6 && partOfDay < 12) return 'morning'
    if(partOfDay >= 12 && partOfDay < 18) return 'afternoon'
    if(partOfDay >= 18 && partOfDay <= 24) return 'evening'
    if(partOfDay >= 0 && partOfDay <= 5) return 'night' 
    selectTag()   
}

function greetingUpdate() {
    let lang =  localStorage.getItem('lang') === 'ru'
    const partOfDay = new Date().getHours()
    if(partOfDay >= 6 && partOfDay < 12) return lang ? 'Доброе утро,' : 'Good morning,'
    if(partOfDay >= 12 && partOfDay < 18) return lang ? 'Добрый день,' : 'Good afternoon,'
    if(partOfDay >= 18 && partOfDay <= 24) return lang ? 'Добрый вечер,' : 'Good evening,'
    if(partOfDay >= 0 && partOfDay <= 5) return lang ? 'Доброй ночи,' : 'Good night,'
}

let backgroundTag = ''

function selectTag() {
    if(localStorage.getItem('tag')) {
        backgroundTag = localStorage.getItem('tag')
    } else {
        backgroundTag = timeOfDay()
    }
}

function setLocalStorage() {
    localStorage.setItem('name', name.value)
    settingsCheckbox.forEach(item => localStorage.setItem(item.id, item.checked))
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
    if(localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    }
}
window.addEventListener('load', () => {
    getLocalStorage()
    selectTag()
    init()
    getQuotes()
    tagInput.value = localStorage.getItem('tag')
    if(localStorage.getItem('lang') === 'ru') {
        setRussianLanguage()
    }
    initToDo()
    toDoResize()
} )

const blocks = {
    time: time,
    date: date,
    player: player,
    greeting: greetingContainer,
    weather: weather,
    quotes: qoutes,
    'to-do': toDo,
}

function init() { //check local storage, which blocks need to hide, and set checkbox according to they condition
    for(let key in blocks) {
        if(localStorage.getItem(key) === 'false') {
            blocks[key].classList.add('hide-block')
            document.querySelector(`#${key}`).checked = false
        }
    }
    api.value = localStorage.getItem('source')
}

settingsCheckbox.forEach(item => item.addEventListener('click', (e) => { // hiding blocks by using settings checkboxes
    localStorage.setItem(e.target.id, e.target.checked)
    e.target.checked ? blocks[e.target.id].classList.remove('hide-block') : blocks[e.target.id].classList.add('hide-block')
}))

////// Image Slider /////////////

let randomNum;
let randomFlickrNum;

function getRandom() {
    randomNum = Math.ceil(Math.random() * (20 - 1) + 1)
}

function getRandomForFlickr() {
    randomFlickrNum = Math.ceil(Math.random() * (100 - 1) + 1)
}

getRandom()
getRandomForFlickr()

function setGithubBackground() {
    let part = timeOfDay()
    console.log('Loading background from GitHub', `tag - ${part}`);
    if(randomNum === 21) {randomNum = 1}
    if(randomNum === 0) {randomNum = 20}
    let bgNum = randomNum < 10 ? randomNum.toString().padStart(2, '0'): randomNum
    const img = new Image()
    img.src = `https://raw.githubusercontent.com/The-Dmitry/ForMomentum/main/${part}/${bgNum}.jpg`
    img.onload = () => {
        wrapper.style.backgroundImage = `url(https://raw.githubusercontent.com/The-Dmitry/ForMomentum/main/${part}/${bgNum}.jpg)`
    }
    localStorage.setItem('source', 'gitHub')
}

api.addEventListener('change', (e)=> {
    localStorage.setItem('source', e.target.value)
    selectBackground()
})

async function setUnsplashBackground() {
    selectTag()
    console.log('Loading Unsplash API ...');
    try {
        const url = `https://api.unsplash.com/photos/random?query=${backgroundTag}&client_id=qMcp0gVu5vldpMh0lROfHBxAhXZdMMsQHHY2xHZ7F00`
        const res = await fetch(url)
        const data = await res.json()
        const img = new Image()
        img.src = data.urls.regular
        img.onload = () => {
            wrapper.style.backgroundImage = `url(${data.urls.regular})`
        }
        console.log(url);
    } catch (e) {
        localStorage.setItem('source', 'gitHub')
        api.value = localStorage.getItem('source')
        setGithubBackground()
    }
}

async function setFlickrBackground() {
    if(randomFlickrNum === 100) {randomFlickrNum = 0}
    if(randomFlickrNum === -1) {randomFlickrNum = 99}
    console.log('Loading Flickr API ...');
    try {
        const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=2dcf532d206a604fe42259fedbca0044&tags=${backgroundTag}&extras=url_k&format=json&nojsoncallback=1`
        const res = await fetch(url)
        const data = await res.json()
        const img = new Image()
        img.src = data.photos.photo[randomFlickrNum].url_k
        img.onload = () => {
            wrapper.style.backgroundImage = `url(${data.photos.photo[randomFlickrNum].url_k})`
        }
        console.log(url);
    } catch {
        setFlickrBackground()
    }
}

function selectBackground() {
    if(localStorage.getItem('source') === 'unsplash') {
        setUnsplashBackground()
    } else if(localStorage.getItem('source') === 'flickr') {
        setFlickrBackground()
    } else {
        setGithubBackground()
    }
}

selectBackground()

function setTag(event) {
    if(event.code === 'Enter') {
        localStorage.setItem('tag', tagInput.value)
        backgroundTag = tagInput.value || timeOfDay()
        selectBackground()
    }
}

tagInput.addEventListener('keypress', setTag)

function nextSlide() {
    if(localStorage.getItem('source') === 'unsplash') {
        setUnsplashBackground()
    } else if (localStorage.getItem('source') === 'flickr') {
        randomFlickrNum++
        setFlickrBackground()
    } else {
        randomNum++
        setGithubBackground()
    }
    sliderNext.onclick = null
    sliderPrev.onclick = null
    setTimeout(()=> {
        sliderNext.onclick = nextSlide
        sliderPrev.onclick = prevSlide
    }, 1200)
}

function prevSlide() {
    if(localStorage.getItem('source') === 'unsplash') {
        setUnsplashBackground()
    } else if (localStorage.getItem('source') === 'flickr') {
        randomFlickrNum--
        setFlickrBackground()
    } else {
        randomNum--
        setGithubBackground()
    }
    sliderNext.onclick = null
    sliderPrev.onclick = null
    setTimeout(()=> {
        sliderNext.onclick = nextSlide
        sliderPrev.onclick = prevSlide
    }, 1200)
}

sliderNext.onclick = nextSlide 
sliderPrev.onclick = prevSlide

// Weather ////////////////

async function getWeather() {
    try {
        localStorage.getItem('city') ? city.value = localStorage.getItem('city') : localStorage.getItem('lang') === 'ru'? city.value = 'минск' : city.value = 'minsk'
        let lang =  localStorage.getItem('lang') === 'ru'
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${localStorage.getItem('lang') || 'en'}&appid=26e356d650c92ed8ad35e52cab77cc42&units=metric`;
        const res = await fetch(url);
        const data = await res.json(); 
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.ceil(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        windSpeed.innerHTML = lang ? `Скорость ветра: ${Math.floor(data.wind.speed)} м/с` : `Wind speed: ${Math.floor(data.wind.speed)} m/s`
        humidity.innerHTML = lang ? `Влажность: ${data.main.humidity}%`: `Humidity: ${data.main.humidity}%`
    } catch (e) {
        weatherDescription.textContent = `Incorrect city or server is unavailable ...`;
        temperature.textContent = ``;
        windSpeed.innerHTML = ``
        humidity.innerHTML = ``
    }
}

setInterval(()=> { //weather updating, every 15 minutes
    getWeather()
}, 900000);

function setCity(event) {
    if(event.code === 'Enter') {
        localStorage.setItem('city', city.value)
        getWeather()
    }
}

document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);

// Player ///////////////

songCurrentTime.innerHTML = '00:00'
songDuration.innerHTML = '00:00'
progress.style.width = '0%'

const audio = new Audio()
let playNum = 0
let pauseTime = 0
let isPlay = false
volumeBarProgress.style.height = 80 + 'px'
let audioVolume = audio.volume

function createPlaylist(item) {
    const li = document.createElement('li')
    li.classList.add('play-item')
    li.textContent = item.title
    playlist.append(li)
}

playList.forEach(e => createPlaylist(e))

function playAudio() {
    emphasize()
    if(!isPlay){
        audio.src = playList[playNum].src
        audio.currentTime = pauseTime
        songTitle.innerHTML = playList[playNum].title
        audio.play()
        isPlay = true
        play.classList.add('pause')
    } else {
        pauseTime = audio.currentTime
        audio.pause()
        isPlay = false
        play.classList.remove('pause')
    }
}

function playNext() {
    pauseTime = 0
    isPlay = false
    playNum++
    if(playNum > playList.length - 1) {playNum = 0}
    playAudio()
}

function playPrev() {
    pauseTime = 0
    isPlay = false
    playNum--
    if(playNum === -1) {playNum = playList.length - 1}
    playAudio()
}

[...playItem].forEach((item, index) => item.addEventListener('click', (e) => {
    playList.forEach((el) => {
        if(index === playNum) {
            playAudio()
        } else {
            (el.title === e.target.textContent) 
            playNum = index
            pauseTime = 0
            isPlay = false
            playAudio()
        }
    })
}))

function emphasize() { //track highlighting in the list
    let list = document.querySelectorAll('.play-item')
    list.forEach((e, index) => {
        if(index == playNum) {
            e.classList.add('emphasize')
        } else {
            e.classList.remove('emphasize')
        }
        })
}

play.addEventListener('click', playAudio)

next.addEventListener('click', playNext)

prev.addEventListener('click', playPrev)

audio.addEventListener('ended', playNext);

// Progress Bar

function calcDuration(num) { 
    let seconds = parseInt(num % 60);
    let minutes = Math.floor(num / 60);
    return `${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, 0)}` || '00:00'
}

function updateProgress(e) { //updating progress while music playing
    const {duration, currentTime} = e.srcElement
    const progressPercent = (currentTime / duration) * 100
    progress.style.width = `${progressPercent}%`
    songCurrentTime.innerHTML = calcDuration(currentTime)
}

function setProgress(e) { // setting progress by pressing on progress bar
    if(isPlay) {
        const width = progressBar.clientWidth
        const click = e.offsetX
        const duration = audio.duration
        audio.currentTime = (click / width) * duration
    }
}

audio.addEventListener('loadeddata', ()=> {  //calculating audio duration only after loading, ofr escaping NaN-error
    songDuration.textContent = calcDuration(audio.duration)
})

audio.addEventListener('timeupdate', updateProgress)

progressBar.addEventListener('click', setProgress)

function setVolumeProgress(e) {
    let barHeight = volumeBar.clientHeight
    let barClick = e.offsetY
    volumeBarProgress.style.height = barClick + 'px' || 80+'px'
    audioVolume = barClick / barHeight
    audio.volume = audioVolume
    if(audio.volume > 0) {
        volume.classList.remove('volume_mute')
    }
}

function mute() {
    if(audio.volume > 0) {
        audio.volume = 0
        volumeBarProgress.style.height = 0 + 'px'
    } else {
        audio.volume = audioVolume
        volumeBarProgress.style.height = (audioVolume * 80) + 'px'
    }
}

volumeBar.addEventListener('click', setVolumeProgress)
volume.addEventListener('click', ()=> {
    mute()
    volume.classList.toggle('volume_mute')
})

volume.addEventListener('mouseover', ()=>{
    volumeBar.classList.add('volume-bar_show')
})
volume.addEventListener('mouseout', ()=>{
    volumeBar.classList.remove('volume-bar_show')
})
volumeBar.addEventListener('mousemove', ()=>{
    volumeBar.classList.add('volume-bar_show')
})
volumeBar.addEventListener('mouseleave', ()=>{
    volumeBar.classList.remove('volume-bar_show')
})
settingsButton.addEventListener('click', () => {
    settingContainer.classList.toggle('hide-block')
})

extender.addEventListener('click', ()=> { //change player size
    document.querySelector('.progress-and-title').classList.toggle('none-display-block')
    document.querySelector('.player-timing').classList.toggle('none-display-block')
    document.querySelector('.player').classList.toggle('change-width')
    playlist.classList.toggle('none-display-block')
    extender.classList.toggle('change-content-expand')
})

// Switch language ///////////////

const languageButton = document.querySelector('.language')
const translate = document.querySelectorAll('.translate')

languageButton.textContent = 'English'

function switchLanguage(e) {
    if(localStorage.getItem('lang') === 'ru') {
        setEnglishLanguage()
    } else {
        setRussianLanguage()
    }
    getWeather()
    getQuotes()
}

function setRussianLanguage() {
    localStorage.setItem('lang', 'ru')
    translate.forEach(elem => elem.textContent = vocabulary.en[`${elem.textContent.toLowerCase()}`])
    languageButton.innerHTML = 'Русский'
    name.placeholder = 'Введите имя'
    toDoInput.placeholder = 'Введите текст ...'
    confirm.textContent = 'Добавить'
}

function setEnglishLanguage() {
    localStorage.setItem('lang', 'en')
    translate.forEach(elem => elem.textContent = vocabulary.ru[`${elem.textContent.toLowerCase()}`])
    languageButton.innerHTML = 'English'
    name.placeholder = 'Enter name'
    toDoInput.placeholder = 'Type text ...'
    confirm.textContent = 'Add'
}

languageButton.addEventListener('click',  switchLanguage)

///////////////Quotes

const qouteAuthor = document.querySelector('.quote__author')
const qouteText = document.querySelector('.quote__text')
const qouteButton = document.querySelector('.quote__button')

function getRandomQuote() {
    randomQuote = Math.ceil(Math.random() * (20 - 1) + 1)
}

let randomQuote

getRandomQuote()

async function getQuotes() {
    let lang = localStorage.getItem('lang') === 'ru'
    const quotes = 'js/data.json'
    const res = await fetch(quotes)
    const data = await res.json()
    qouteAuthor.textContent = lang ? data[randomQuote].ruAuthor : data[randomQuote].enAuthor
    qouteText.textContent = lang ? data[randomQuote].ru : data[randomQuote].en
}

// getQuotes()

function nextQuote() {
    randomQuote++
    if(randomQuote === 20) {randomQuote = 0}
    if(randomQuote === -1) {randomQuote = 19}
    getQuotes()
}

qouteButton.addEventListener('click', nextQuote)

qouteButton.onclick = function() {
    this.style.transform = 'rotate(180deg)'
    setTimeout(() => {
        this.style.transition = 'none'
        this.style.transform = 'rotate(0deg)'
    }, 1000);
    this.style.transition = 'all linear 1s'
}

// To Do ////////////////////

const toDoButton = document.querySelector('.todo__button')
const toDoContainer = document.querySelector('.to-do__container')
const toDoList = document.querySelector('.to-do__list')
const toDoInput = document.querySelector('.to-do__input')
const ToDoList = document.querySelector('.to-do__list')
const confirm = document.querySelector('.to-do__confirm')

toDoButton.addEventListener('click', ()=> {toDoContainer.classList.toggle('hide-block')})

ToDoList.addEventListener('click', (e)=> {
    e.stopPropagation()
    if(e.target.matches('.to-do__delete')) {
        e.target.closest('.to-do-item').remove()
        updateToDoList()
    }
    if(e.target.matches('.to-do__edit') && !e.target.closest('.to-do-item').hasAttribute('contenteditable')) {
        e.target.closest('.to-do-item').setAttribute('contenteditable', 'true')
        e.target.closest('.to-do-item').style.backgroundColor = 'rgba(255, 166, 0, 0.3)'
    } else if (e.target.matches('.to-do__edit') && e.target.closest('.to-do-item').hasAttribute('contenteditable')){
        e.target.closest('.to-do-item').removeAttribute('contenteditable')
        e.target.closest('.to-do-item').style.backgroundColor = 'rgb(0, 0, 0, 0.1)'
        toDoContainer.style.backgroundColor = 'rgb(0, 0, 0, 0.7)'
        updateToDoList()
    }
})

ToDoList.addEventListener('keypress', (e)=> {
    if(e.code === 'Enter') {
        e.target.closest('.to-do-item').removeAttribute('contenteditable')
        e.target.closest('.to-do-item').style.backgroundColor = 'rgb(0, 0, 0, 0.1)'
        toDoContainer.style.backgroundColor = 'rgb(0, 0, 0, 0.7)'
        updateToDoList()
    }
})

let todoArr = []

toDoInput.addEventListener('keypress', createNewToDo) 

function initToDo() { //update toDo list from local storage
    todoArr = JSON.parse(localStorage.getItem('toDo'))
    if(todoArr !== null) {
        todoArr.forEach(e => {
            let li = document.createElement('li')
            li.className = 'to-do-item'
            li.innerHTML = `<div class="to-do-item__text">${e}</div>
            <div class="to-do__controls">
                <button class="to-do__delete"></button>
                <button class="to-do__edit"></button>
            </div>`
            ToDoList.append(li)
        })
    }
}

confirm.addEventListener('click', ()=> {
    createNewToDo('Enter')
})

function createNewToDo(e) {
    if((e.code === 'Enter' || e === 'Enter') && toDoInput.value.length > 0) {
        let li = document.createElement('li')
        li.className = 'to-do-item'
        li.innerHTML = `<div class="to-do-item__text">${toDoInput.value}</div>
        <div class="to-do__controls">
            <button class="to-do__delete"></button>
            <button class="to-do__edit"></button>
        </div>`
        ToDoList.append(li)
        toDoInput.value = ''
        updateToDoList()
    }
}

function updateToDoList() {
    todoArr = []
    document.querySelectorAll('.to-do-item__text').forEach(el => todoArr.push(el.textContent))
    localStorage.setItem('toDo', JSON.stringify(todoArr))
}

window.addEventListener('resize', toDoResize)

function toDoResize() {
    if(wrapper.offsetWidth < 480) {
        toDoContainer.style.width = wrapper.offsetWidth + 'px'
        toDoContainer.style.maxWidth = wrapper.offsetWidth + 'px'
    }
}