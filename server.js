// Import functions
const express = require('express')
const inquirer = require('inquirer')

const mysql = require('mysql2')
const consoleTable = require('console.table')

const PORT = process.env.PORT || 5001
const app = express()

// Express middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'abc123',
    database: 'employee_db',
    port: '3306',
  },
  console.log(`Connected to the employee_db database.`),
)

// Query database
// db.query("SELECT * FROM menu", function (err, results) {
//   console.log(results);
// });

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end()
})

//creating the menu
const menu = [
  {
    name: 'menu',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View All Employees',
      'Add Employee',
      'Update Employee Role',
      'View All Roles',
      'Add Role',
      'View All Departments',
      'Add Department',
      'Exit',
    ],
  },
]

//Calling the menu
function init() {
  inquirer.prompt(menu).then((response) => {
    if (response.menu === 'View All Employees') {
      viewEmployees()
    } else if (response.menu === 'Add Employee') {
      addEmployee()
    } else if (response.menu === 'Update Employee Role') {
      updateEmployee()
    } else if (response.menu === 'View All Roles') {
      viewRoles()
    } else if (response.menu === 'Add Role') {
      addRole()
    } else if (response.menu === 'View All Departments') {
      viewDepartments()
    } else if (response.menu === 'Add Department') {
      addDepartment()
    } else if (response.menu === 'Exit') {
      db.end()
    }
  })
}

// Function to view employees
function viewEmployees() {
  const sql = 'SELECT * FROM employees'
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err)
      return
    }
    console.table(result)
    init()
  })
}

// Function to add an employee
function addEmployee() {
  //Locating and running a query on db
  const sql = 'SELECT first_name, last_name, id FROM employee'
  const rSql = 'SELECT title, id FROM role'

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err)
      return
    }
    db.query(rSql, (err, result2) => {
      if (err) {
        console.error(err)
        return
      }
      // Storing the results as a const
      const employees = result.map((emp) => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
      }))
      const roles = result2.map((rol) => ({ name: rol.title, value: rol.id }))

      inquirer
        .prompt([
          {
            name: 'first_name',
            message: "What is the employee's first name?",
          },
          {
            name: 'last_name',
            message: "What is the employee's last name?",
          },
          {
            type: 'list',
            name: 'role_id',
            message: "What is the employee's role?",
            choices: roles,
          },
          {
            type: 'list',
            name: 'manager_id',
            message: "Who is the employee's manager?",
            choices: employees,
          },
        ])
        .then((data) => {
          const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
            VALUES (?,?,?,?)`
          const values = [
            data.first_name,
            data.last_name,
            data.role,
            data.manager,
          ]
          db.query(sql, values, (err, newEmp) => {
            if (err) console.log(err)
            console.log('Employee added')
          })
        })
    })
  })
}

/*
    function updateEmployee() {
      
    }
    */
function viewRoles() {
  const sql = 'SELECT * FROM roles'
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err)
      return
    }
    console.table(result)
    init()
  })
}

function addRole() {
  inquirer
    .prompt([
      {
        name: 'role',
        message: 'What is the name of the Role?',
      },
      {
        name: 'salary',
        message: 'What is the name salary of the Role?',
      },
      {
        name: 'depart',
        message: 'Which department does the Role belong too?',
      },
    ])
    .then((data) => {
      const sql = `INSERT INTO roles(title, salary, department_id) VALUES (?,?,?)`
      const params = [data.role, data.salary, data.depart]
      db.query(sql, params, (err, result) => {
        if (err) {
          console.error(err)
          return
        }
        console.log('Added')
        init()
      })
    })
}

function viewDepartments() {
  const sql = 'SELECT * FROM department'
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err)
      return
    }
    console.table(result)
    init()
  })
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: 'dep',
        message: 'What is the name of the Department?',
      },
    ])
    .then((data) => {
      const sql = `INSERT INTO department(name) VALUES (?)`
      const params = [data.dep]
      db.query(sql, params, (err, result) => {
        if (err) {
          console.error(err)
          return
        }
        console.log('Added')
        init()
      })
    })
}

init()

//app.listen(PORT, () => {
//console.log(`Server running on port ${PORT}`);
//});
