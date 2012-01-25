# FrameworkJS
Another MVC framework for Javascript. FrameworkJS also has built in support for Observers and Commands.

## Examples

**Create a controller "class" by extending the base controller**

In the following examples the first parameter is the class that you want to extend, the second parameter is the base class that you want to use for extending and the last one is the namespace.classname of the new class/function

```javascript
// Extend using the Controller class
FrameworkJS.extend(function() {
	this.someFunction = function() {
		// Some code here...
	};
},
FrameworkJS.Controller, 
'Controller.Grid');

// Extend using the View class
FrameworkJS.extend(function() {
	this.someFunction = function() {
		// Some code here...
	};
},
FrameworkJS.View, 
'View.Grid');

// Extend using the Model class
FrameworkJS.extend(function() {
	this.someFunction = function() {
		// Some code here...
	};
},
FrameworkJS.Model, 
'Model.Grid');

// Extend using the Service class
FrameworkJS.extend(function() {
	this.someFunction = function() {
		// Some code here...
	};
},
FrameworkJS.Service, 
'Service.Grid');
```

**Instantiate a controller, model, view, service**

```javascript
// Create a controller
var gridController = FrameworkJS.retrieve('SomeId', 'Controller.Grid');
// Create a view
var gridView = FrameworkJS.retrieve('gridView', 'View.Grid');
// Create a model
var gridModel = FrameworkJS.retrieve('gridModel', 'Model.Grid');
// Create a service
var gridService = FrameworkJS.retrieve('gridService', 'Service.Grid');
```

**Basic controller setup**

```javascript
// Setup the controller
gridController1.name = 'GridController1';
gridController1.setView(gridView1);
gridController1.setModel(gridModel1);
```
If the controller of "class" Controller.Grid with id 'SomeId' doesn't exist then it will create one else it will return the already existing one.

**Events**

```javascript
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
```

**Subscribe on specific messages**

```javascript
// Subscribe example. Subscribe on the 'onApplicationReady' message
gridController1.subscribe('onApplicationReady');
// Send a notification
FrameworkJS.Publisher.notify('onApplicationReady', {test: 'applicationReady'});
// Unsubscribe from all the 'onApplicationReady' notifications
gridController1.unsubscribe('onApplicationReady');
```