# Slides v2
[![Build Status](https://travis-ci.org/jfmengels/slidesv2.png)](https://travis-ci.org/jfmengels/slidesv2)
[![Dependencies Status](http://img.shields.io/david/jfmengels/slidesv2.svg?style=flat)](https://david-dm.org/jfmengels/slidesv2#info=dependencies)
[![devDependencies Status](http://img.shields.io/david/dev/jfmengels/slidesv2.svg?style=flat)](https://david-dm.org/jfmengels/slidesv2#info=devDependencies)
[![Coveralls branch](https://img.shields.io/coveralls/jfmengels/slidesv2/master.svg)](https://coveralls.io/github/jfmengels/slidesv2)

A proof of concept for slides with conditional paths.

## Tools
* [React](https://facebook.github.io/react) for rendering
* [Redux](https://github.com/rackt/redux) for a predictable app state
* [react-router](https://github.com/rackt/react-router) for routing
* [Babel](http://babeljs.io) for ES201X code
* [Webpack](http://webpack.github.io) for building the project and for hotloading (serverside rendering coming soon)
* [CSS Modules](https://github.com/css-modules/css-modules) for styling
* [Mocha](https://github.com/mochajs/mocha) for testing
* [ESLint](http://eslint.org) for JavaScript code linting and some coding style checks

## Installation

Clone the repository and install dependencies
```
git clone git+https://github.com/jfmengels/slidesv2.git
cd slidesv2
npm install
```

Run the project
```
npm start
```

You now have a server running on `http://localhost:3001`.
It should now watch the project front-end files, and hot-reload when possible.

## Tools and features

### Redux

[Redux](https://github.com/rackt/redux) is based on the [Flux](https://facebook.github.io/flux) architecture proposed by Facebook. It is a leaner and simpler version of it, by removing some of the abstractions and making use of ideas from functional programming and [Elm](http://elm-lang.org), such as using pure functions for all data updates. The result is an immutable tree-like data structure, that can only be modified by specific pure functions, making it very easy to test and easy to trust. The data's immutability is not enforced by Redux though.

### Hot-reload during development (using Webpack)

1. Run the project, open the website at `http://localhost:3001`
2. Changes the content of a css file, for example `public/client/routes/app/components/header.css` if you are on the root page
3. The page was magically updated without the page being reloaded.

Try the same thing with a js file. With a clean Redux data architecture, you can do actions that change the state of your store, then modify the reducers, and after hot-reloading, end up with the same store state as if the actions you had done were made with the updated reducers.

## Two trees to rule them all

The whole application is divided into two tree-like structures
* The state tree
* The route tree

### The state tree (public/client/state/), aka store
The state tree is a single source of truth that contains the whole application state. It has a tree-like structure in the form of a simple JSON-like object. It can only be modified by the combination of action creators and reducers. Each top-level state handler (e.g. state/modules) handles one part of the application's state, and defines its collection of reducers and action creators.

The advantages are multiple:
* Few areas of modifications: It can only be modified by reducers, so it will not be able to be changed in a very nested function with horrible side-effects.
* Testability: It can only be changed by reducers, which are pure functions. Pure functions are easily testable and predictable.
* Serialization: You can save the whole or part of the app state, and restore it at any point or render the app state from the server so that the client has less calls to make at the start.

#### Actions creators
Action creators can be found in top-level state handler folders under actions/ (e.g. state/slides/actions). An action creator is a simple pure function that creates an action object, specifying a type and all the necessary information to then treat it and integrate it into the state tree.
```js
// action creator for loading a module list
const moduleListActionCreator = (moduleList) => {
  return {
    moduleList: moduleList,
    type: 'LOAD_MODULE_LIST'
  }
}
```

#### Reducers
Reducers can be found in top-level folders under reducers/ (e.g. state/slides/reducers). A reducer is also a pure function, that takes two arguments: the current state, the action that is currently being dispatched (applied on the state tree), and returns the new state of the application, be it modified or left untouched.

A simple example for this is a top-level state handler that loads the list of all module items, and stores them in the state. (Note: the actual implementation in this app may be different syntax-wise, but not in meaning)
```js
// reducer that handles the module list
const initialState = [];

const reducers = (state, action) => {
  if (!state) {
    state = initialState
  }
  switch (action.type) {
    case 'LOAD_MODULE_LIST':
      return action.moduleList
    default:
      return state
  }
}
```
**A reducer should never alter the current state** or have any other types of side-effects such as dispatching a new action. A reducer should compute and return the new state and it should only do that. Many types of actions can be dispatched in the app, but a reducer should only handle those that it wants to treat and ignore the rest. Ignoring an action here means returning the current state. Having reducers be pure functions, mean that they can be swapped on the fly with hot reloading, and you can use some pretty useful tools when developing (Check out Redux creator [Dan Abramov's talk](https://www.youtube.com/watch?v=xsSnOQynTHs) on this topic).

#### Constants
To be able to link actions to reducers, we create constants, such as `LOAD_MODULE_LIST = 'LOAD_MODULE_LIST'`. It is optional in the methodology, but having them has some advantages, such as being able to easily see what actions a top-level state handler handles, or avoiding typos more easily.

### The route tree (public/client/routes/)

The route tree is in charge of rendering what the user sees. At the root of this tree, you have a [react-router](https://github.com/rackt/react-router) tree that holds all the routes for the app. Depending on what the current url is, different things will be rendered. All routes are defined in public/client/routes. Just take a look at the routes, and you'll know what should be rendered.

Every folder in the tree should export one route (they can be nested if needed). The container folders expose React components that have knowledge of the state tree. They are in charge of rendering all the components necessary for the view, that are available in the components folder, next to containers. Since the components from components/ do not have knowledge of the state tree, the container that renders them also has the task of preparing dispatcher functions and the necessary state data, and then passing them on to these components.
You should read Dan Abramov's article on [smart and dumb components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.hvpm90ot6) (named containers and components).

### An index-based structure

In this project, files named `index.js` are used a lot. When you import/require a path with Node.js or Webpack and the path happens to be the name of a folder, the `index.js` file of that folder will be loaded. One of the aims of the file architecture used here is to try to load resources through the nearest related `index.js` file and not any further. If you need to, you can probably better organize your architecture. This makes it easier to moves things around, and to swap things later.
```js
import SomeComponent from '.../components/SomeComponent' // No
import { SomeComponent } from '.../components'           // Yes

// Examples:
// All the reducers for slides are available through slides/reducers/index.js
import reducers from '.../slide/reducers'
// All the action creators for slides are available through slides/actions/index.js
import reducers from '.../slide/actions'
// The combined reducer function is available at
import store from '.../public/client/state'
// The final store is available at
import store from '.../public/client'
// Components in a route are available at
import { SomeComponent } from '../components'
// All action creators are available at
import { actions } from '.../public/client/state'
const { someAction } = actions
// (or for the sake of ease of use)
import { someAction } from '.../public/client/state/actions'
```
