# FrameworkJS
Another MVC framework for Javascript. FrameworkJS also has built in support for Observers and Commands.

## Examples

### Create a controller "class" by extending the base controller
FrameworkJS.extend(function() {
	this.showSection = function() {
		// Some code here...
	};
},
FrameworkJS.CONTROLLER, 
'Controller.Grid');

### Instantiate a controller
var gridController = FrameworkJS.retrieve(
	'SomeId', 
	'Controller.Grid,
	FrameworkJS.CONTROLLER);

If the controller of "class" Controller.Grid with id 'SomeId' doesn't exist then it will create one else it will return the already existing one.

### Events
// Listen for an event
gridController.addEventListener(
	'onDataLoaded', 
	onDataLoaded, 
	this);

var onDataLoaded = function(event) {
	// Do something…
};

// Dispatching events
gridController.dispathEvent({
	type: 'onDataLoaded',
	params: {
		somePropery: someValue,
		anotherProperty: anotherValue
		
	}
});

// Removing event listeners
gridController.removeEventListener(
	'onDataLoaded', 
	onDataLoaded, 
	this);