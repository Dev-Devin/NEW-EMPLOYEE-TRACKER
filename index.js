// Adding the dependencies: inquirer, console.table, mysql
const inquirer = require("inquirer");
require("console.table");
const mysql = require("mysql2");

// connecting to the database, the user will enter their username and password to connect
const db = mysql.createConnection({
  host: "localhost",
  // MySQL username here
  user: "root",
  // MySQL password here
  password: "password",
  database: "employees_db",
});

db.connect(function (err) {
  if (err) throw err;
  // initializing the employeeMenu function after the connection is made
  employeeMenu();
});

//Menu for employee that stores all the options
const employeeMenu = () => {
  inquirer.createPromptModule([{
    type: 'list',
    name: 'choice',
    message: 'what do you want to do?',
    choices: [
      "View Departments",
      "View",
      "View Employees",
      "Add Department",
      "Add Role",
      "Add Employee",
      "Update Employee Role",
    ]
  }])
    .then(function (data)){
    
  }
}