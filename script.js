'use strict'

const btn = document.querySelector('.btn-country')
const countriesContainer = document.querySelector('.countries')

class Country {
  constructor(imgSrc, name, region, population, language, currency) {
    this.imgSrc = imgSrc
    this.name = name
    this.region = region
    this.population = population
    this.language = language
    this.currency = currency
  }

  render(className = '') {
    const article = `
	<article class="country ${className}">
		<img class="country__img" src=${this.imgSrc} />
		<div class="country__data">
		  <h3 class="country__name">${this.name}</h3>
		  <h4 class="country__region">${this.region}</h4>
		  <p class="country__row"><span>👫</span>${this.population}/p>
		  <p class="country__row"><span>🗣️</span>${this.language}</p>
		  <p class="country__row"><span>💰</span>${this.currency}</p>
		</div>
		</article>
			`

    countriesContainer.insertAdjacentHTML('beforeend', article)
  }
}

///////////////////////////////////////
let map

//? Using XML

//function getCountryData(country) {
//  const xml = new XMLHttpRequest()

//  xml.open('GET', `https://restcountries.com/v3.1/name/${country}`)
//  xml.setRequestHeader('Content-Type', 'application/json')

//  xml.addEventListener('load', function () {
//    const data = JSON.parse(this.response),
//      [country] = data
//    const {
//      borders,
//      flags: { svg },
//      name: { common },
//      region,
//      population,
//    } = country
//    ;({
//      maps: { googleMaps: map },
//    } = country)

//    const neighbour = borders[0],
//      entriesFromLanguage = Object.entries(country.languages).flat(),
//      entriesFromCurrency = Object.entries(country.currencies)
//        .flat()
//        .splice(1, 1),
//      currency = Object.values(entriesFromCurrency[0])

//    new Country(
//      svg,
//      common,
//      region,
//      population,
//      entriesFromLanguage[1],
//      currency[0]
//    ).render()

//    const xml2 = new XMLHttpRequest()
//    xml2.open('Get', `https://restcountries.com/v3.1/alpha/${neighbour}`)
//    xml2.send()

//    xml2.addEventListener('load', () => {
//      const data2 = JSON.parse(xml2.response)
//      const [country] = data2

//      const {
//        borders,
//        flags: { svg },
//        name: { common },
//        region,
//        population,
//      } = country
//      ;({
//        maps: { googleMaps: map },
//      } = country)

//      new Country(
//        svg,
//        common,
//        region,
//        population,
//        entriesFromLanguage[1],
//        currency[0]
//      ).render('neighbour')
//    })
//  })

//  xml.send()
//}

//getCountryData('usa')

//? Using Fetch

function getGeoLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {
          coords: { latitude, longitude },
        } = position

        resolve({ latitude, longitude })
      },
      (err) => {
       reject(err)
      },
      {
        enableHighAccuracy: true,
      }
    )
  })
}

function renderError(message) {
  countriesContainer.insertAdjacentText('beforeend', message)
}

function getCountryData(country) {

  function getJSON(url, errorMsg = '') {
    return fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error(`${errorMsg}, код ошибки: ${res.status}`)
      }

      return res.json()
    })
  }

  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Страна не найдена')
    .then((data) => {
      const [country] = data,
        neighbour = country.borders?.[0]

      map = country.maps.googleMaps

      new Country(
        country.flags.svg,
        country.name.common,
        country.region,
        country.population,
        Object.entries(country.languages).flat()[1],
        Object.values(Object.entries(country.currencies)[0])[0]
      ).render()

      if (!neighbour) {
        throw new Error('Не найдено соседей')
      }

      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Страна не найдена'
      )
    })
    .then((data) => {
      const [country] = data
      new Country(
        country.flags.svg,
        country.name.common,
        country.region,
        country.population,
        Object.entries(country.languages).flat()[1],
        Object.values(Object.entries(country.currencies)[0])[0]
      ).render('neighbour')
    })
    .catch((error) => renderError(error.message))
    .finally(() => (countriesContainer.style.opacity = 1))
}

btn.addEventListener('click', () => {
  getGeoLocation().then((data) => {
    fetch(
      `https://geocode.xyz/${data.latitude},${data.longitude}?geoit=json&auth=636650904152649321897x112952`
    )
      .then((res) => res.json())
      .then((data) => getCountryData(data.country))
  })
})
