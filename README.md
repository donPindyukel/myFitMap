# ngFit App
![Building a ngFit App with AngularJS]()
# Install
```sh
$ git clone <<<this url>>>
$ bower install
$ npm install
$ gulp
```
# Mixin
The application I'm using your own mixin to work with color, font and media queries.
## Use Color Mixin
Use function in scss "color( **name_color** , **type_color** , **opacity_color** );"

Number 2 and 3 it's optional value, if you don't set them, set will be the normal value and 1 for opacity
### Example
```sh
background: color(teal, normal,.6);
```
## Use Fonts Mixin
Include mixin in scss "@include font( **name_font** , **type_font** );"
### Example
```sh
@include font(roboto, regular-italic);
```
## Use Media Queries Mixin
Include mixin in scss "@include media( **name_media** ,  **type_media** ) { @content }"
### Example
```sh
@include media(phone, general){
  @content
};
```
## Your Own Mixin Value
You can use your own mixin value, making all similar.

All values are stored in a file ***builds/development/sass/includes/_stack.scss***
# Structure
