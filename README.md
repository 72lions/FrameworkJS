# FrameworkJS
Another MVC framework for Javascript. FrameworkJS has built in support for Models, Views, Controllers and Services. It supports a strip-down Publisher/Subscriber pattern and it also has a utility for doing AJAX calls.

## Examples

**Extending the base classes**

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
If the controller of "class" Controller.Grid with id 'SomeId' doesn't exist then it will create one else it will return the already existing one.

**Basic controller setup**

```javascript
// Setup the controller
gridController.name = 'GridController1';
gridController.setView(gridView);
gridController.setModel(gridModel);
```

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
gridController.subscribe('onApplicationReady');
// Send a notification
FrameworkJS.Publisher.notify('onApplicationReady', {test: 'applicationReady'});
// Unsubscribe from all the 'onApplicationReady' notifications
gridController.unsubscribe('onApplicationReady');
```