import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from '../node_modules/notiflix';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const input = document.querySelector(`#search-box`);
const div = document.querySelector(`.country-info`);

input.addEventListener(`input`, debounce(inputShow, DEBOUNCE_DELAY));

function inputShow(event) {
  if (!event.target.value) {
    return (div.innerHTML = '');
  }
  const countryToFind = event.target.value.trim();
  fetchCountries(countryToFind)
    .then(country => markup(country))
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      div.innerHTML = '';
    });
}

function markup(contries) {
  if (contries.length === 1) {  
      const contry = contries.map(
      ({
        name: { official },
        capital,
        population,
        flags: { svg },
        languages,
      }) => {
        return `
            <h2 class="contry-name"><img
            src="${svg}"
            alt="Флаг"
            height= 20
            width = 25> ${official}</h2>
            <p><b>Capital</b>: ${capital}</p>
            <p><b>Population</b>: ${population}</p>
            <p><b>Languages</b>: ${Object.values(languages)}</p>`;
      }
    ); 
    div.innerHTML = contry;
    return;
  } else if (contries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  const contryMass = contries
    .map(({ name: { official }, flags: { svg } }) => {
      return `
            <h2 class="contry-name"><img
            src="${svg}"
            alt="Флаг"
            height= 20
            width = 25> ${official}</h2>`;
    })
    .join('');
  div.innerHTML = contryMass;
}
