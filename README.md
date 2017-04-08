# Interviewer.dc
Consolidate the tools you need to implement agile scrum on existing GitHub repositories..

<!-- ## Table of Contents
1. [Usage](#Usage)
    1. [Adding Repositories](#Adding-Repositories)
    1. [Adding and Removing Deliverables or Resources](#Adding-and-Removing-Deliverables-or-Resources)
1. [Installation](#Installation)
1. [Team](#Team)

## Usage
### Scheduling meetings
CLick the add button above the calendar to schedule a meeting.
### Adding and Removing Deliverables or Resources
Fill out the form entirely and then submit, the lists will automatically update when you or anyone else adds/deletes deliverables/resources. To delete an item press the X that is located next to it. -->

## Installation
Fork and clone the respository to your local machine.
Use `npm install` to install the required dependencies.

To start the app you can use:
```
npm run build
npm start
```
or `npm run quick` which builds then runs.

## Testing

To test the app, run the following (requires PhantomJS and CasperJS, which I recommend installing via Homebrew - they must be installed globally):
```
npm test
OR
npm run test-unit (does not require PhantomJS/CasperJS; only runs mocha tests)
```
Note: the tests use the Mochawesome reporter, which saves a report in json and html format and provides the link in the terminal after the tests run. The html report is beautiful, just copy and paste that path into a browser to view. Or navigate to the report in the mocha_reports folder of the root directory of the app.



## Team
- __Product Owner__: [Jordan Stubblefield](https://github.com/JStubb7939)
- __Scrum Master__: [Simon de Moor](https://github.com/sdemoor)
- __Development Team Members__: [Kyle Anson](https://github.com/Riski24), [Jason Kim](https://github.com/kasonjim)
