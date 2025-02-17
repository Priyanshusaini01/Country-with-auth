const countriesContainer = document.querySelector('.countries-container')

const filterByregion= document.querySelector('.filter-by-region');

const searchcontainer=document.querySelector('.search-container input');

const themeChanger= document.querySelector('.theme');

let allcountrydata;
fetch('https://restcountries.com/v3.1/all')
  .then((res) => res.json())  // then process the response 
    /* The res.json() method is called to parse the response body as JSON. 
    This is necessary because the API returns data in JSON format, and res.json() converts it into a JavaScript object for further use.*/
  .then((data) =>{
    
    renderCards(data)
    allcountrydata=data;
  } )
  

  filterByregion.addEventListener('change',(e)=>{
    fetch(`https://restcountries.com/v3.1/region/${filterByregion.value}`)
  .then((res) => res.json())
  .then((renderCards) )
   // (data)=> { renderCards(data)} // diff way of callback 
  })

  function renderCards(data){
     // we have to empty the container to filter
    countriesContainer.innerHTML='';

    data.forEach((country) => {
    // console.log(country.toplevel)
        
        const countryCard = document.createElement('a')
        countryCard.classList.add('country-card')
        countryCard.href =`./country.html?name=${country.name.common}`
        countryCard.innerHTML = `
            <img src="${country.flags.svg}" alt="${country.name.common}" />
            <div class="card-text">
                <h3 class="card-title">${country.name.common}</h3>
                <p><b>Population: </b>${country.population.toLocaleString('en-IN')}</p>
                <p><b>Region: </b>${country.region}</p>
                <p><b>Capital: </b>${country.capital?.[0]}</p>
            </div>
         `
        countriesContainer.append(countryCard)
    })
  }

  searchcontainer.addEventListener('input',(e)=>{
// console.log(e.target.value);
// console.log(allcountrydata);
const Filtercountry=allcountrydata.filter((country)=> country.name.common.toLowerCase().includes(e.target.value.toLowerCase()))
 renderCards(Filtercountry); 
})

themeChanger.addEventListener('click',()=>{
  document.body.classList.toggle('dark');
})
