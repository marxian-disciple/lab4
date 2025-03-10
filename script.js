document.getElementById('country-form').addEventListener('submit', getCountryInfo);

function getCountryInfo(event) {
    event.preventDefault(); // Prevent the form from submitting and reloading the page

    const countryName = document.getElementById('country-name').value.trim();
    const countryInfoSection = document.getElementById('country-info');
    const borderCountriesSection = document.getElementById('bordering-countries');
    const errorMessage = document.getElementById('error-message');
    const borderCountriesList = document.getElementById('border-countries-list');

    // Clear previous data
    countryInfoSection.style.display = 'none';
    borderCountriesSection.style.display = 'none';
    borderCountriesList.innerHTML = ''; // Clear any previous bordering countries
    errorMessage.textContent = '';

    if (!countryName) {
        errorMessage.textContent = 'Please enter a country name.';
        return;
    }

    // Fetch country data
    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 404) {
                throw new Error('Country not found.');
            }

            const country = data[0];
            displayCountryInfo(country);
            displayBorderingCountries(country.borders);
        })
        .catch(error => {
            errorMessage.textContent = error.message;
        });
}

function displayCountryInfo(country) {
    const capital = document.getElementById('capital');
    const population = document.getElementById('population');
    const region = document.getElementById('region');
    const flag = document.getElementById('country-flag');

    capital.textContent = country.capital ? country.capital[0] : 'N/A';
    population.textContent = country.population.toLocaleString();
    region.textContent = country.region;
    flag.src = country.flags.svg;

    document.getElementById('country-info').style.display = 'block';
}

function displayBorderingCountries(borders) {
    const borderCountriesList = document.getElementById('border-countries-list');
    const borderCountriesSection = document.getElementById('bordering-countries');

    if (!borders || borders.length === 0) {
        borderCountriesList.innerHTML = '<li>No bordering countries found.</li>';
        borderCountriesSection.style.display = 'block';
        return;
    }

    borders.forEach(border => {
        fetch(`https://restcountries.com/v3.1/alpha/${border}`)
            .then(response => response.json())
            .then(data => {
                const borderCountry = data[0];
                const borderListItem = document.createElement('li');
                borderListItem.classList.add('border-country');
                borderListItem.innerHTML = `
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" width="50" />
                    <span>${borderCountry.name.common}</span>
                `;
                borderCountriesList.appendChild(borderListItem);
            });
    });

    borderCountriesSection.style.display = 'block';
}
