// Listen for mouse clicks on the webpage
document.addEventListener("click", handleMouseClick);

// Initialize an array to store the click data
var clickData = [];

// Function to handle mouse click events
function handleMouseClick(event) {
  // Get the target element that was clicked
  var target = event.target;

  // Get the ID of the target element
  var id = target.id;

  // Get the mouse coordinates
  var x = event.clientX;
  var y = event.clientY;

  // Get the additional information from the navigator object
  var userAgent = navigator.userAgent;
  var browser = navigator.appName;
  var browserVersion = navigator.appVersion;
  var os = navigator.platform;
  var device = navigator.product;
  var language = navigator.language;

  // Get the screen resolution
  var screenRes = screen.width + "x" + screen.height;

  // Get the entry page and referrer
  var entry = window.location.href;
  var referrer = document.referrer;

  // Get the geolocation
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    // Add the click data to the array
    clickData.push({
      id: id,
      x: x,
      y: y,
      userAgent: userAgent,
      browser: browser,
      browserVersion: browserVersion,
      os: os,
      device: device,
      language: language,
      screenRes: screenRes,
      entry: entry,
      referrer: referrer,
      lat: lat,
      lng: lng,
    });
  });

  // Send the data to the server every 30 seconds
//   setInterval(sendDataToServer, 30000);
}

// Function to send data to the server via an API call
function sendDataToServer() {
  // Check if there is data to send
  if (clickData.length === 0) {
    return;
  }

  // Stringify the data
  var data = JSON.stringify(clickData);

  // Compress the data with gzip
  var compressed = pako.gzip(data);

  // Use the Fetch API to send a POST request to the server
  fetch("https://example.com/api/track", {
    method: "POST",
    body: compressed,
    headers: {
      "Content-Encoding": "gzip",
      "Content-Type": "application/json",
    },
  }).then(function (response) {
    // Handle the server's response
    // Clear the click data array
    clickData = [];
  });
}
