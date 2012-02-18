/*
 *----------------------------------------------------
 * EXTENDING A CONTROLLER AND OVERWRITTING THE
 * onNotify FUNCTION
 *----------------------------------------------------
 */

var publisherExample;
var btnPageLoaded = document.getElementById('broadcastPageLoaded');
var btnPageUnloaded = document.getElementById('broadcastPageUnloaded');
var btnMenuClicked = document.getElementById('broadcastMenuClicked');
var txtResult = document.getElementById('resultHTML');

// Extend the controller
FrameworkJS.extend(function() {

    // Extending the onNotify class
    this.onNotify = function(args) {

        txtResult.innerHTML = 'Got a broadcast of type: ' + args.message + ' and with message:  '  + args.params.msg;
        console.log(args.message, args.params, args);

    };

}, FrameworkJS.Controller, 'publisher.PublisherExample');

publisherExample = new FrameworkJS.retrieve('publisher123', 'publisher.PublisherExample');

// Subscribe to specific broadcasts
publisherExample.subscribe('pageLoaded');
publisherExample.subscribe('pageUnloaded');
publisherExample.subscribe('menuClicked');

// Listen for the onClick event of the buttons
btnPageLoaded.onclick = function() {
    // Broadcast a specific message
    FrameworkJS.Publisher.notify('pageLoaded', {msg: 'Page is loaded broadcast'});
};

// Listen for the onClick event of the buttons
btnPageUnloaded.onclick = function() {
    // Broadcast a specific message
    FrameworkJS.Publisher.notify('pageUnloaded', {msg: 'Page is unloaded broadcast'});
};

// Listen for the onClick event of the buttons
btnMenuClicked.onclick = function() {
    // Broadcast a specific message
    FrameworkJS.Publisher.notify('menuClicked', {msg: 'Menu is clicked broadcast'});
};