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

  render() {
    const article = `
	<article class="country">
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
    countriesContainer.style.opacity = 1
  }
}

///////////////////////////////////////
let map

function getCountryData(country) {
  const xml = new XMLHttpRequest()

  xml.open('GET', `https://restcountries.com/v3.1/name/${country}`)
  xml.setRequestHeader('Content-Type', 'application/json')

  xml.addEventListener('load', function () {
    const data = JSON.parse(this.response),
      [country] = data
    console.log('country', country)

    const {
      flags: { svg },
      name: { common },
      region,
      population,
    } = country
    ;({
      maps: { googleMaps: map },
    } = country)

    const entriesFromLanguage = Object.entries(country.languages).flat(),
      entriesFromCurrency = Object.entries(country.currencies)
        .flat()
        .splice(1, 1),
      currency = Object.values(entriesFromCurrency[0])

    new Country(
      svg,
      common,
      region,
      population,
      entriesFromLanguage[1],
      currency[0]
    ).render()
  })

  xml.send()
}

getCountryData('argentina')

btn.addEventListener('click', () => {
  window.open(map, '_blank')
})
