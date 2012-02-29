/*
 *----------------------------------------------------
 * TESTINGTHE EVENTS
 *----------------------------------------------------
 */

var controller, view;

// Extend the controller class
FrameworkJS.extend(function() {


}, FrameworkJS.Controller, 'events.EventsControllerExample');

// Extend the view class
FrameworkJS.extend(function() {


}, FrameworkJS.Controller, 'events.EventsViewExample');

controller = FrameworkJS.retrieve('events1Controller', 'events;.EventsControllerExample');
virew = FrameworkJS.retrieve('events1View', 'events.EventsViewExample');

controller.setView(view);

