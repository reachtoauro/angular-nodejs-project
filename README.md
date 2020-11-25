# MyFirstProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0 and 
Node.js version 14.15.0


# Functions
1. User can register with unique email addresses only
2. Password will not be stored in DB instead encrypted using bcryot
3. Once register user can upload images(multer library used for image storage locally)
4. User can edit or delete their own posts only but can view all posts
5. Authentication and Authorization configured using JWT
6. User sessions and errors handled globally
7. backend APIs intercepted for authorization
8. All secrets are managed using dotenv library

# Usage
Angular(formerly named Angular 2) Frontend to a NodeJS & Express & MongoDB Backend.
Angular 2 and NodeJS, together with ExpressJS (a NodeJS Framework) and MongoDB formed the very popular MEAN stack.
Single Page Application
Reusable components using Angular 
Reactive User Experience with NgForm, ReactiveForm
Attractive UI using Angular Material and optimistic update
Angular HttpClient service to connect with Node.js backend API(GET, POST, PUT, DELETE), CORS
Features: Pagination, uploading images
Secure application using JWT authentication and authorization
Graceful error handling
MongoDB connectivity using Mongoose Framework
Usage of Interceptors, Constructors, Injections, EntryComponents, Emitter-Subscriber, 

## Database configuration
place a `.env` file on your project root folder with `DB_HOST`, `DB_USER` and `DB_PASS` in `key=value` format. It will look like this:

DB_HOST=<db url>
DB_USER=<db username>
DB_PASS=<db password>

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Backend server

Run `npm run start:server` for a backend dev server. Navigate to `http://localhost:3000/`. The backend server app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

