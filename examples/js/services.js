/*
 *----------------------------------------------------
 * LOADING JSON DATA
 *----------------------------------------------------
 */
// Getting the button
var btnLoadJSON = document.getElementById('btnLoadJSON');
var serviceJSON;

// Creating a class that extends the Service and overwrites the onSuccess function.
// The class new namespace.name will be service.JSONExample
FrameworkJS.extend(function() {
    // Overwriting the onSuccess function
    this.onSuccess = function(result, request) {
        document.getElementById('resultJSON').innerHTML = JSON.stringify(result);
        document.getElementById('message').innerHTML = 'Check your console...';
        console.log('JSON response:', result);
    };

    // Overwritting the onError function
    this.onError = function(error){

    };
}, FrameworkJS.Service, 'service.JSONExample');

// Instantiate a new service.JSONExample class with a unique id
serviceJSON = FrameworkJS.retrieve('service1233847', 'service.JSONExample');

// Setting up the service
serviceJSON.url = 'data/data.json';
serviceJSON.method = 'GET';
serviceJSON.data = 'name=some+name&age=21';
serviceJSON.async = true;
serviceJSON.dataType = 'json';

// Set what will happend when the user clicks on the button.
btnLoadJSON.onclick = function() {
    // Use the service to fetch the data
    serviceJSON.fetch();
};

/*
 *----------------------------------------------------
 * LOADING HTML DATA
 *----------------------------------------------------
 */

// Getting the button
var btnLoadHTML = document.getElementById('btnLoadHTML');
var serviceHTML;

// Creating a class that extends the Service and overwrites the onSuccess function.
// The class new namespace.name will be service.HTMLExample
FrameworkJS.extend(function() {
    // Overwriting the onSuccess function
    this.onSuccess = function(result, request) {
        document.getElementById('resultHTML').innerHTML = result;
    };

    // Overwritting the onError function
    this.onError = function(error){

    };
}, FrameworkJS.Service, 'service.HTMLExample');

// Instantiate a new service.HTMLExample class with a unique id
serviceHTML = FrameworkJS.retrieve('service841', 'service.HTMLExample');

// Setting up the service
serviceHTML.url = 'data/markup.html';
serviceHTML.method = 'GET';
serviceHTML.data = 'name=some+name&age=21';
serviceHTML.async = true;
serviceHTML.dataType = 'text';

// Set what will happend when the user clicks on the button.
btnLoadHTML.onclick = function() {
    // Use the service to fetch the data
    serviceHTML.fetch();
};