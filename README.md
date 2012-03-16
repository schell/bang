bang
====
What do you get after the Flash? The bang!
`bang` is a display list and event system that supplants Adobe's 
Flash Actionscript API in your web authoring toolchain. 
Using the canvas tag (and later SVG or WebGL) `bang` enables you 
to create rich media, like games, apps and widgets that run in all 
modern browsers, with API features you've come to expect from Flash.

Features
--------
+Modules
    `bang` is organized using the (mod)[https://github.com/schell/mod] 
    module system and is broken up much like the Flash API you're used to.
+Views
    The display list is much like Flash's hierarchical views with some tweaks
    and updates for ease of use (yeah, what's easier than Flash?).
+Notifications
    The event listening and dispatching system is a mixture of Flash events 
    and Cocoa Notifications, combined into an easy to use MVC like structure. 
    You can listen to all events of a certain name, all events from one object, 
    or specific events from specific objects.
+Animation
    Animate using sprite sheets with built-in objects like `Sprite` or roll 
    your own and use `bang`'s event system.
+Polygonal Hit Testing
    Mouse events are fired whenever the mouse enters a view's hit area, as 
    long as that view has an interested party.

More to Come
------------
`bang` is in a very early alpha stage and changes all the time. I don't recommed
using it in any production environment, but be my guest! If you use it, pleace give 
me feedback about what can be done better, where your painpoints are and what rocks.