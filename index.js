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
  password: "Password",
  database: "employees_db",
});

db.connect(function (err) {
  if (err) throw err;
  // initializing the employeeMenu function after the connection is made
  employeeMenu();
});

//Menu for employee that stores all the options
const employeeMenu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "what do you want to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])

    // adding if statements for what choices someone chooses, the data.choice prompts the choices to be picked
    .then(function (data) {
      if (data.choice === "View All Departments") {
        viewAllDepartments();
      } else if (data.choice === "View All Roles") {
        viewAllRoles();
      } else if (data.choice === "View All Employees") {
        viewAllEmployees();
      } else if (data.choice === "Add a Department") {
        addDepartment();
      } else if (data.choice === "Add a Role") {
        addRole();
      } else if (data.choice === "Add an Employee") {
        addEmployee();
      } else if (data.choice === "Update an Employee Role") {
        updateEmployeeRole();
      } else {
        // exit
        db.end();
      }
    });
};

//THESE ARE THE COLUMNS FOR THE DEPARTMENT TABLES
const viewAllDepartments = () => {
  db.query("SELECT * FROM department", function (err, result) {
    if (err) throw err;
    console.table(result);
    employeeMenu();
  });
};

const viewAllRoles = () => {
  db.query(
    "SELECT role.id, role.title, department.name AS 'department', role.salary FROM role JOIN department ON role.department_id = department.id",
    function (err, result) {
      if (err) throw err;
      console.table(result);
      employeeMenu();
    }
  );
};

const viewAllEmployees = () => {
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title AS 'title', department.name as 'department', role.salary as 'salary' FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;`,
    function (err, result) {
      if (err) throw err;
      console.table(result);
      employeeMenu();
    }
  );
};

// THIS IS ADDING THE DEPARTMENT
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department?",
        name: "name",
      },
    ])
    .then(function (name) {
      db.query("INSERT INTO department SET ?", name),
        function (err, result) {
          if (err) throw err;
          console.table(result);
        };
      employeeMenu();
    });
};

const addRole = () => {
  db.query("SELECT * FROM department", function (err, result) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the title of the role?",
          name: "title",
        },
        {
          type: "input",
          message: "What is the salary of the role?",
          name: "salary",
        },
        {
          type: "list",
          message: "What department is the role in?",
          name: "department_name",
          choices: result.map((department) => department.name),
        },
      ])
      .then(function (data) {
        const chosenDepartment = result.find(
          (department) => department.name === data.department_name
        );
        console.log(chosenDepartment);

        db.query(
          "INSERT INTO role SET ?",
          {
            title: data.title,
            department_id: chosenDepartment.id,
            salary: data.salary,
          },
          function (err, result) {
            if (err) throw err;
            console.table(result);
          }
        );
        employeeMenu();
      });
  });
};

// ADDING AN EMPLOYEE TO LIST
// WE ARE ADDING THE FIRST NAME, LAST NAME, ROLE_ID, MANAGER_ID

const addEmployee = () => {
  // using the role table to get the titles to use as choices in the table
  db.query("SELECT * FROM role", function (err, roles) {
    if (err) throw err;
    // using the employee table to obtain last names and use as choices for manager
    db.query("SELECT * FROM employee", function (err, employees) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the first name of the employee?",
            name: "first_name",
          },
          {
            type: "input",
            message: "What is the last name of the employee?",
            name: "last_name",
          },
          {
            type: "list",
            message: "What is the title for the employee?",
            name: "role_name",
            choices: roles.map((role) => role.title),
          },
          {
            type: "list",
            message: "Who will be the manager for the employee?",
            name: "manager_name",
            choices: employees.map((employee) => employee.last_name),
          },
        ])
        .then(function (data) {
          const chosenRole = roles.find(
            (role) => role.title === data.role_name
          );
          const chosenManager = employees.find(
            (employee) => employee.last_name === data.manager_name
          );

          db.query(
            "INSERT INTO employee SET ?",
            {
              first_name: data.first_name,
              last_name: data.last_name,
              role_id: chosenRole.id,
              manager_id: data.manager_id,
            },
            function (err, result) {
              if (err) throw err;
              console.table(result);
            }
          );
          employeeMenu();
        });
    });
  });
};

// THIS IS GOING TO UPDATE THE EMPLOYEE ROLE

const updateEmployeeRole = () => {
  db.query("SELECT * FROM role", function (err, roles) {
    if (err) throw err;
    db.query("SELECT * FROM employee", function (err, employees) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee would you like to update?",
            name: "chosen_employee",
            // display last names of existing employees
            choices: employees.map((employee) => employee.last_name),
          },
          {
            type: "list",
            message: "What is the employees new role?",
            name: "chosen_role",
            // display roles
            choices: roles.map((role) => role.title),
          },
        ])
        // then prompt to select new role and update in the database
        .then(function (data) {
          const chosenEmployee = employees.find(
            (employee) => employee.last_name === data.chosen_employee
          );
          const chosenRole = roles.find(
            (role) => role.title === data.chosen_role
          );
          db.query(
            `UPDATE employee SET role_id = ${chosenRole.id} WHERE id = ${chosenEmployee.id}`
          );
          employeeMenu();
        });
    });
  });
};
