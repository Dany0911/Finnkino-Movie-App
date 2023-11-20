window.onload = loadXML();//when window loads- loadXML function fires
var xmlHttp;// variable XMLHttpRequest
var xmlHttp2;// 2 variable XMLHttpRequest
var id = [];// id array
var theaters = []; // theatres array
var index;// index var for id
var requestId;// request url Id var 
var date;// date var

function loadXML() { // Function for the XML request
  xmlHttp = new XMLHttpRequest(); // Creates new XMLHttpRequest

  xmlHttp.open("GET", "https://www.finnkino.fi/xml/TheatreAreas/", true);// request to get Finnkino theater API
  xmlHttp.send(); // send request
  console.log(xmlHttp);// console log response
}

xmlHttp.onreadystatechange = function () {
  if (xmlHttp.readyState === 4 && xmlHttp.status === 200) { // if ready state is equal to 4 and the status is equal to 200 

    var finkkinoResp = xmlHttp.responseXML; // save the response in the finkkino var
    console.log(finkkinoResp); // console log the response

    var cinemas = finkkinoResp.getElementsByTagName("Name"); // create variable and save in the var the cinemas with tag name
    var IDs = finkkinoResp.getElementsByTagName("ID"); // same as before bur for ID with tag ID

    for (var i = 0; i < cinemas.length; i++) { // for loop to go through the array

      id[i] = IDs[i].childNodes[0].nodeValue; // get value from the IDs array and sets it with the index

      var cinema = cinemas[i].childNodes[0].nodeValue; // name of cinema for the pull-down
      theaters[i] = cinema; // set value to the array theaters with index of [i]  

      var textNode = document.createTextNode(cinema); // textNode created   
      var node = document.createElement("option"); // option element created
      node.appendChild(textNode); // Appends the text   
      document.getElementById("cinema").appendChild(node);// Appends option
    }
  }
}
$("#searchButton").click(function () { // When search button is clicked the function start
  $("#schedule").empty();  // Empty elements from #schedule
  $("h1").remove();  // Removes h1 element

  index = theaters.indexOf($("#cinema").val()); // Creates var for the cinema's index from the id array, pick the value and assing the index of it
  requestId = id[index]; // Get id of the chosen theater from id array

  if (($("#date").val()) === "") { // Ff date input is empty 
    alert("Please enter a date"); // alert error message
    return;
  }
  else { // else if invalid format
    var inputDate = $("#date").val();
    if (!isValidDateFormat(inputDate)) {
      alert("Please enter the date in the format dd.mm.yy"); //  gives alert message
      return; // Stop execution if the date format is invalid
    }
    date = inputDate; // date input
  }

  var url = "https://www.finnkino.fi/xml/Schedule/?area=" + requestId + "&dt=" + date // url of the request with id and date

  xmlHttp2 = new XMLHttpRequest(); // Create new XMLHttpRequest
  xmlHttp2.open("GET", url, true); // Request with the theater ID in the string
  xmlHttp2.send(); // Send request
  console.log(xmlHttp2); // Log response

  xmlHttp2.onreadystatechange = function () {
    if (xmlHttp2.readyState === 4 && xmlHttp2.status === 200) { // if ready state is equal to 4 and the status is equal to 200

      $("#select").after("<h1>Your selection: " + $("#cinema").val() + " " + date + "</h1>"); // Create new h1 with selected cimnema and date
      $("h1").hide();  // hide h1
      $("h1").fadeIn('slow'); // Fade in h1

      var schedule = xmlHttp2.responseXML; // Create var with responseXML value
      console.log(schedule); // Log response

      var pictures = schedule.getElementsByTagName("EventSmallImagePortrait"); // Create var and array of movies images in the theater
      var cinemasNames = schedule.getElementsByTagName("Theatre"); // Create var and array of theaters names

      var titles = schedule.getElementsByTagName("Title"); // Create var and array of all movies titles
      var times = schedule.getElementsByTagName("dttmShowStart"); // Create var and array of the starting times of the movies

      for (var i = 0; i < pictures.length; i++) { // For loop to go through the array
        var node = document.createElement("div"); // Create new div
        node.className = 'block'; // Assign to the div the class "block"
        document.getElementById("schedule").appendChild(node); // Appends div to schedule

        var title = titles[i].childNodes[0].nodeValue; // Get the movie title from the array
        var titleNode = document.createTextNode(title); // Create textNode
        var newH2 = document.createElement("h2"); // Create h2
        newH2.appendChild(titleNode); // Append node to H2
        node.appendChild(newH2);

        var picture = pictures[i].childNodes[0].nodeValue; // Get picture url
        var newPicture = document.createElement("img"); // Create new img
        newPicture.src = picture; // Set src for the pic
        node.appendChild(newPicture); // Append pic

        var cinemaName = cinemasNames[i].childNodes[0].nodeValue; // Get cinema name from array
        var textNode = document.createTextNode(cinemaName); // Create textNode
        var newH3 = document.createElement("h3"); // Create h3
        newH3.appendChild(textNode); // Append textNode
        node.appendChild(newH3); // Appends h3

        var showTime = times[i].childNodes[0].nodeValue; // Get movie start time from array
        var time = "The movie starts at " + showTime.substring(11, 16); // Take the showTime string and assign it to time var

        var timeNode = document.createTextNode(time); // Create a textNode
        var new2H3 = document.createElement("h3"); // Create h3
        new2H3.appendChild(timeNode); // Append timeNode
        node.appendChild(new2H3); // Appends h3
      }
      $(".block").hide();  // hide everything with .block class
      $(".block").fadeIn('slow');  // fadeIn for the .block class
    }
  }
});
$("#date").keydown(function (e) { // When user input something and press key
  var pressedKey = e.which; // pressedKey var
  if (pressedKey === 13) { // If pressedKey is entered
    $("#searchButton").click(); // search button clicked
  }
});

function isValidDateFormat(inputDate) { // Function to validate the date format
  var dateRegex = /^\d{2}\.\d{2}\.\d{2}$/; // Regular expression for dd.mm.yy format
  return dateRegex.test(inputDate);
}