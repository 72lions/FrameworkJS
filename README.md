# FrameworkJS
Another MVC framework for Javascript. FrameworkJS has built in support for Models, Views, Controllers and Services. It supports a strip-down Publisher/Subscriber pattern and it also has a utility for doing AJAX calls.

## Examples

**Extending the base classes**

In the following examples the first parameter is the class that you want to extend, the second parameter is the base class that you want to use for extending and the last one is the namespace.classname of the new class/function

```javascript
/*
------------------------------------
EXTENDING THE BASE CONTROLLER CLASS
------------------------------------
*/

FrameworkJS.extend(function() {
    // Overwritting the properties
    this.name = 'GridController';

    this.addListeners = function() {
        // Listen to the a change of a specific model property
        this.getModel().bind('change:prop1', onProperty1Changed, this);
    }

	// Overwrite the onNotify function
    this.onNotify = function (notification) {
        if(notification.message === 'onApplicationReady') {
            console.log('The onApplicationReady message was captured by the controller', notification);
        }

        if(notification.message === 'router:path:example/about') {
            console.log('Router send a path change event of the Grid Controller', notification);
        }
    };

    var onProperty1Changed = function (event) {
        console.log('prop1 has changed. We got an event type of', event.type, 'and a value of', event.value);
    };

}, FrameworkJS.Controller, 'Controller.Grid');

/*
------------------------------------
EXTENDING THE CONTROLLER
------------------------------------
*/
FrameworkJS.extend(function(){

	// Overwrite the onNotify function
    this.onNotify = function (notification) {
        if(notification.message === 'router:pop') {
            console.log('Router send a pop event', notification);
        }

        if(notification.message === 'router:push') {
            console.log('Router send a push event', notification);
        }

        if(notification.message === 'router:path:example/about') {
            console.log('Router send a path change event of the Grid History', notification);
        }
    }

}, FrameworkJS.Controller, 'Controller.History');

/*
------------------------------------
EXTENDING A CUSTOM CLASS
------------------------------------
*/

// Extending a custom class
FrameworkJS.extend(function() {
    // Overwritting the properties
    this.name = 'SubGridController';

}, FrameworkJS.getClass('Controller.Grid'), 'SubController.Grid');

/*
------------------------------------
EXTENDING THE BASE MODEL CLASS
------------------------------------
*/

FrameworkJS.extend(function() {
    // Overwritting the properties
    this.name = 'GridModel';
    this.data = {title: "MyTitle", prop1: 'Property 1'};

}, FrameworkJS.Model, 'Model.Grid');

/*
------------------------------------
EXTENDING THE BASE VIEW CLASS
------------------------------------
*/

FrameworkJS.extend(function () {
    // Overwritting the properties
    this.name = 'GridView';
    this.domElement = '.test';

    /**
     * Overwrite the draw function
     */
    this.draw = function () {
        //console.log('Overwritting the draw function...');
    };
}, FrameworkJS.View, 'View.Grid');

/*
------------------------------------
EXTENDING THE BASE SERVICE CLASS
------------------------------------
*/

FrameworkJS.extend(function() {
    // Overwriting the onSuccess function
    this.onSuccess = function(result, request) {
        console.log('The service made an ajax call', result, request, this);
    }
}, FrameworkJS.Service, 'Service.Grid');
```

**Instantiate a controller, model, view, service**

```javascript
var  gridController1, subGridController1, gridView1, gridModel1, gridService1, gridHistory1;

// Instantiate a View.Grid
gridView1 = FrameworkJS.retrieve('GRIDVIEW1', 'View.Grid');

// Instantiate a Model.Grid
gridModel1 = FrameworkJS.retrieve('GRIDMODEL1', 'Model.Grid');

// Instantiate a Controller.Grid
gridController1 = FrameworkJS.retrieve('GRIDCONTROLLER1', 'Controller.Grid');

// Instantiate a SubController.Grid
subGridController1 = FrameworkJS.retrieve('GRIDSUBCONTROLLER1', 'SubController.Grid');

// Instantiate a Controller.History
gridHistory1 = FrameworkJS.retrieve('GRIDHISTORY1', 'Controller.History');
```
If the controller of "class" Controller.Grid with id 'GRIDCONTROLLER1' doesn't exist then it will create one else it will return the already existing one.

**Basic controller setup**

```javascript
// Setup the controller
gridController1.name = 'GridController1';
gridController1.setView(gridView1);
gridController1.setModel(gridModel1);

// We execute the addListeners after we set up the model
gridController1.addListeners();
```

**Events**

```javascript
/**
 * Triggered when the onTest event is dispatched
 * @param  {Object} event The event
 */
var onTest = function(event){
    console.log('The onTest function is triggered', event);
};

/**
 * Triggered when the onTest event is dispatched
 * @param  {Object} event The event
 */
var onTest2 = function(event){
    console.log('The onTest2 function is triggered', event);
};

// Binding on the views onTest event. The onTest function should be executed when it is triggered
gridController1.getView().bind('onTest', onTest, gridController1);

// Binding on the views onTest event. The onTest2 function should be executed when it is triggered
gridController1.getView().bind('onTest', onTest2, gridController1);

// Dispatching the views onTest event. Should get the onTest and onTest2 function executed
gridView1.trigger({type:'onTest'});

// Unbinding the view from the onTest event
gridController1.getView().unbind('onTest', onTest, this);
gridController1.getView().unbind('onTest', onTest2, this);

// Dispatching the views onTest event. The onTest and onTest2 functions should NOT be executed
gridView1.trigger({type:'onTest'});
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

**Listen to change event of the model's properties**

```javascript
//Changing the prop1 and prop2 properties. Only prop1 has a new value
gridModel1.set({prop1: 'Property 11', prop2: 'Property 2'});
```

**Working with templates**

```html
<script id="template1" type="text/html"><li><a href="${url}">${title}</a></li></script>
<script id="template2" type="text/html" src="template.html"></script>
```

```javascript
// Getting an inline template from inside a script
FrameworkJS.Utils.tmpl('#template1', 
	{url: 'http://in.gr', title: 'Title 1'});
	
// Getting the template by loading the src of a script
FrameworkJS.Utils.tmpl('#template2', 
	{url: 'http://in.gr', title: 'Title 1'});
	
// Getting the template from the tmpl function
FrameworkJS.Utils.tmpl('<li><a href="${url}">${title}</a></li>', 
	[{url: 'http://in.gr', title: 'Title 1'}, {url:'http://sl.se', title:'Title 2'}]);
```

**History API**

```javascript
// Subscribing to the router:path:example/about and router:push messages
gridController1.subscribe('router:path:example/about', 2);
gridHistory1.subscribe('router:push');
gridHistory1.subscribe('router:path:example/about', 3);

// Set the basepath
FrameworkJS.Router.setBasePath('/example');
// Push the new url
FrameworkJS.Router.push(null, 'Some title', '/about');
```

**Services**

Services are your gateway for loading data from other resources using GET and POST. A service can get data as JSON or Strings.

```javascript

// Instantiate a Service.Grid
gridService1 = FrameworkJS.retrieve('GRIDSERVICE1', 'Service.Grid');

gridService1.url = 'data.json';
gridService1.dataType = 'json';
gridService1.fetch();
```
