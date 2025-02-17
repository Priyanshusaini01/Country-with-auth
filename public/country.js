const countryName = new URLSearchParams(location.search).get('name')


const flagimg = document.querySelector('.country-details img')
const countrynameh1 = document.querySelector('.country-details h1')
const nativeName=document.querySelector('.Nativename')
const Population=document.querySelector('.population')
const Region=document.querySelector('.region')
const SubRegion=document.querySelector('.SubRegion')
const Capital=document.querySelector('.Capital')
const ToplevelDomain=document.querySelector('.ToplevelDomain')
const currency=document.querySelector('.currency')
const lang=document.querySelector('.lang')
const bordercountries=document.querySelector('.border-countries')
fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
  .then((res) => res.json())
  .then(([country]) => {
    // console.log(country);
    
    flagimg.src=country.flags.svg // fething the country flag name 
    countrynameh1.innerText=country.name.common

    if(country.name.common){ // if because some country dont have common name 
      nativeName.innerText=Object.values(country.name.nativeName)[0].common // manipulate innertext 
        /*Object.values() is used to get an array of values from this object.*/
    }
    else nativeName.innerText=country.name.common
    Population.innerText=country.population.toLocaleString('en-IN')
    Region.innerText=country.region
    SubRegion.innerText=country.subregion
    Capital.innerText=country.capital?.[0] 
    ToplevelDomain.innerText=country.tld.join(',')
    if(country.currencies){
      currency.innerText=Object.values(country.currencies).map((currency)=> currency.name).join(',')
      /*Purpose: Object.values(country.currencies) converts the currencies object into an array of its values.*/
    }
    if(country.languages){
    lang.innerText= Object.values(country.languages).join(',')
    }

    // in case of antartica of undefined name 
    if(country.SubRegion) SubRegion.innerText=country.SubRegion;

    if(country.borders){
      country.borders.forEach((border)=>{
        fetch(`https://restcountries.com/v3.1/alpha/${border}`)
  .then((res) => res.json())
  .then(([bordercountry])=>{
    // console.log(bordercountry)
       const bordertag=document.createElement('a')
       bordertag.innerText=bordercountry.name.common;
       bordertag.href=`country.html?name=${bordercountry.name.common}`
       bordercountries.append(bordertag);
      })
    })
  
    }
  })



 
  