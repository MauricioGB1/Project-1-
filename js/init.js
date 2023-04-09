(function($){
  $(function(){

    $('.sidenav').sidenav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space

async function findNearestBars() {
	const zipcodeInput = document.getElementById("zipcode-input");
	const by_postal = zipcodeInput.value;
	
  	const breweryTypeInput = document.getElementById("brewery-types");
	const breweryType = breweryTypeInput.value;

	let url = `https://api.openbrewerydb.org/v1/breweries?by_postal=${by_postal}&per_page=10`;
  
  	if (breweryType !== "") {
   		 url = `https://api.openbrewerydb.org/v1/breweries?by_postal=${by_postal}&by_type=${breweryType}&per_page=10`;
 	 }
	
    const response = await fetch(url);
	const data = await response.json();
	    
    if (data.length === 0) {
		console.log("No ", breweryTypeInput, "found in this area.");
		return;
			}
		
    const nearestBars = data.slice(0, 5);
	nearestBars.forEach(bar => {
		console.log(bar);
		const x = bar.street;
		const y = bar.city;
		const z = bar.state
		const address= x + y + z;
		console.log(address); 
	
		const geocoder = new google.maps.Geocoder();
		geocoder.geocode({ address: address }, async (results, status) => {
		  console.log(geocoder)
		  console.log(results, status)
			if (status === "OK") {
			const location = results[0].geometry.location;
			console.log(results[0].geometry.location)
			const placesService = new google.maps.places.PlacesService(
			  document.createElement("div")
			);
			const request = {
			  query: bar.name,
			  location: location,
			  radius: 5000,
			};
			const response = await new Promise((resolve) =>
			  placesService.textSearch(request, resolve)
			);
			if (response.length > 0) {
			  const rating = response[0].rating;
			  console.log(response[0].rating);
			  const breweryDiv = document.createElement("div");
			  breweryDiv.innerHTML = `<h2>${bar.name}</h2><p>Rating: ${rating}</p>`;
			  document.body.appendChild(breweryDiv);
			} else {
			  console.log(`Unable to find rating for ${bar.name}`);
			}
		  } else {
			console.log(`Geocode was not successful for ${address}`);
		  }
		});
	  });
	}
	
		document.querySelector('form').addEventListener('submit', function(event) {
			event.preventDefault(); 
			findNearestBars();
		  });
		  