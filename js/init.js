(function($){
  $(function(){

    $('.sidenav').sidenav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space

async function findNearestBars() {
  const zipcodeInput = document.getElementById("zipcode-input");
  const by_postal = zipcodeInput.value;
  console.log(by_postal)
  const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_postal=${by_postal}&per_page=3`);
  const data = await response.json();

  if (data.length === 0) {
    console.log("No bars found in this area.");
    return;
  }

  const nearestBars = data.slice(0, 5);
  nearestBars.forEach(bar => {
    console.log(data);
  });
}

document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault(); 
  findNearestBars();
});
