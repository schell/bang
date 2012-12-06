# bang #

`bang` is a display list and event framework for creating canvas based HTML5 apps. The API is similar to flash,
making the transition from AS3 very easy. It uses getters and setters for most of the view altering properties.
Each view has its own canvas API, so every view can be drawn into just as if it were a canvas (because they are). 
`bang` is in pre-alpha. Please read/participate in the (wiki)[https://github.com/schell/bang/wiki] and submit bugs
feature requests using github's (issues)[https://github.com/schell/bang/issues]

## Features ##
* Flash-like display list API
* Efficient, on-demand stage drawing
* Matrix transformations
* Actions (Events)
* Polygonal hit testing
* Broad phase hit testing using quadtrees