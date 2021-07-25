# SKELETOM.NET
This repository serves as the home for Skeletom's new personal website! 

He will be continuing to build the rest of it on stream, and its codebase will remain open-source.

## About

### Tools Used
* Command Line (Terminal)
* Git
* VSCode
* Node.js
* npm

### How to Run
1) Install Node.js and npm.
2) Clone/download this git repo.
3) In terminal, navigate to the project and type `npm install` to download all dependencies.
4) In terminal, type `node index.js` to run the server.
5) Navigate to `http://localhost:8080/` in the browser of your choice.

## History
### **July 17th, 2021**
* Ran `npm init` to make a brand new `package.json` file.
* Ran `npm install express` to download the `express` server library.
* Filled out `index.js` with very basic web server setup.
* Informed the server  where to serve static files (html, images, css, etc) from.
* Added an example redirect endpoint to the server.

#### **End Result**
An unstyled home page that include static text and a static image, being served out of the `public/` file directory by express.

### **July 22nd, 2021**
* Added the `sass` dependency to our `package.json`.
* Added `build-css` command to convert `sass` into `.css` which gets served as a static file.
* Implemented a scrolling background pattern. 
* Imported `normalize.css` and `skeleton.css` frameworks to provide some useful css classes.
* Noodled about different design concepts for the actual page.

#### **End Result**
A slightly more styled home page that now includes css styling served from the same static directory that we set up last time. The current go-forward idea is to have the portfolio set up like the Megaman Boss Select grid, with my face in the center, and each "boss" being a project. Clicking on any grid square would bring the user to a page about that project in more detail.

### **July 25th, 2021**
* Decided to make the page resemble my stream layout instead of the last idea.
* Learned about css `position` property and how nesting works for inheriting properties.
* Explained the [cascade principle of css](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance).
* Learned about the css `display` property and the differences between `block` and `flex` values.
* Explained when and when not to use `!important` in CSS.

#### **End Result**
A layout that much more closely resembles my stream layout, and will format much more naturally on mobile. It features a navbar that stays fixed to the bottom of the screen, as well as a content panel that can be scrolled and will house the project information.
