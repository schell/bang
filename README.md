# bang #

What do you get after the Flash? The bang!
`bang` is a display list and event system that supplants Adobe's 
Flash Actionscript API in your web authoring toolchain. 
Using the canvas tag (and maybe later SVG) `bang` enables you 
to create rich media like games, apps and widgets that run in all 
modern browsers, with API features you've come to expect from Flash.

## Features ##

### Modules ###
`bang` is organized using the [mod](https://github.com/schell/mod) module system and is broken up much like the Flash API you're used to.

### Inheritance ###
Inheritance is 

### Views ###
The display list is much like Flash's hierarchical views with some tweaks and updates for ease of use (yeah, what's easier than Flash?).

### Tweening ###
Use the Ease addin for built in tweening!

### Notifications ###
The event listening and dispatching system is a mixture of Flash events and Cocoa Notifications, combined into an easy to use MVC like structure. You can listen to all events of a certain name, all events from one object, or specific events from specific objects.

### Animation  ###
Animate using sprite sheets with built-in objects like `Sprite` or roll your own and use `bang`'s event system.

### Polygonal Hit Testing  ###
Mouse notifications are fired whenever the mouse enters a view's hit area, as long as that view has an interested party.

### Text Boxes ###
Work with text that autosizes and wraps.

### Object Pooling ###
Notifications and hit-test points are pooled internally. Use the built in Pool addin to pool objects that get used often.

### Compilation ###
Compile your source tree into one JS file, compress it with Google's Closure Compiler and save it out as a PNG using the JS console or the compiler page.

## TODO ##
#### Faster Transformations ####
Polygon transformation can be sped up considerably, with a little effort.
#### Dirty Rectangles ####
Alias all canvas 2DContext functions and maintain a dirty rectangles implementation to keep from redrawing each frame.
#### License ####
I'm going to put a license on here soon. I just don't have a snippet of one yet. Suggestions welcome.
## More to Come ##
`bang` is in a very early alpha stage and changes all the time. I don't recommend
using it in any production environment, but be my guest! If you use it, please give 
me feedback about what can be done better, where your painpoints are and what rocks.