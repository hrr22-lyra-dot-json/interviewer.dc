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

Before you can run the app you will have to setup the database. Login to your preferred database between PostgreSQL and MySQL and create a database called `interviewer_dc`.
If this is a fresh install use `npm run db:setup` to create and seed tables.

If you need more database assistance please view the Database section.

## Usage
To start the app you can use:
```
npm run build
npm start
```
or `npm run quick` which builds then runs.

## Database
Interviewer.DC supports a list of actions to be preformed on the database from the command prompt:

`npm run db:create` will create the tables in the database if they have not been created yet.<br />
`npm run db:seed` will seed the tables if they have not been seeded yet.<br />
`npm run db:unseed` will remove the seed data if the tables have been seeded.<br />
`npm run db:reseed` will run db:unseed and then db:seed.<br />
`npm run db:setup` run db:create -> db:unseed -> db:seed<br />
`npm run db:drop` will drop the tables from the database if they exist.<br />

## Testing

To test the app, run the following (requires [PhantomJS](http://phantomjs.org/) and [CasperJS](http://casperjs.org/), which I recommend installing via [Homebrew](https://brew.sh/) - they must be installed globally):
```
npm test
OR
npm run test-unit (does not require PhantomJS/CasperJS; only runs mocha tests)
```
__Note__: the tests use the Mochawesome reporter, which saves a report in json and html format and provides the link in the terminal after the tests run. The html report is beautiful, just copy and paste that path into a browser to view. Or navigate to the report in the mocha_reports folder of the root directory of the app.



## Team
- __Product Owner__: [Jordan Stubblefield](https://github.com/JStubb7939)
- __Scrum Master__: [Simon de Moor](https://github.com/sdemoor)
- __Development Team Members__: [Kyle Anson](https://github.com/Riski24), [Jason Kim](https://github.com/kasonjim)
