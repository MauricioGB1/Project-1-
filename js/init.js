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
  console.log(data)
   
	    
    if (data.length === 0) {
		alert("No ", breweryTypeInput, "found in this area.");
		return;
			}
		
    const nearestBars = data.slice(0, 5);
	nearestBars.forEach(bar => {
		console.log(bar);
    const webPage = bar.website_url

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
			  const breweryDiv = document.createElement("table");
        const breweryInfo = document.createElement("tbody");
        var header = document.createElement("th")
        var row = document.createElement("tr");
        var cell = document.createElement("td");

			  breweryDiv.innerHTML = `
        <table class = "table">
    <thead class ="table">
      <tr>
          <th>Bar Name</th>
          <th>Rating</th>
          <th>Type</th>
          <th>Website</th>
      </tr>
    </thead>

    <tbody class ="table">
      <tr>
        <td>${bar.name} </td>
        <td>${rating}/5 </td>
        <td>${breweryType}</td>
        <td>${webPage}</td>
      </tr>
     
     
    </tbody>
  </table>`;
        row.appendChild(cell);
			  document.body.appendChild(breweryDiv);
			} else {
			  alert(`Unable to find rating for ${bar.name}`);
			}
		  } else {
			  alert(`Geocode was not successful for ${address}`);
		  }
		});
	  });
	}
	
		document.querySelector('form').addEventListener('submit', function(event) {
			event.preventDefault(); 
			findNearestBars();
		  });
		  