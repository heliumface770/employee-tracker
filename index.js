const inquirer = require('inquirer');
const mysql = require('mysql');
const table = require('console.table');
const depts = [
  {name: 'Couch Testing', roles: ['Stain Removal Expert', 'Pillow Dude', 'Cusion King']},
  {name: 'Snack Eating', roles: ['Cheese Melter', 'Dip Wrangler', 'EMT']},
  {name: 'Space Force', roles: ['Freeze Dried Ice Cream Truck Driver', 'Space Janitor', 'Guy That does *pew* *pew* sounds']}
]

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "6Bamboozle!",
    database: "employee_db"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    startPrompt();
  });

function startPrompt(){
inquirer.prompt ([
    {type: "list",
    name: "choice",
    choices: ["View Employees", "View Employees By Department", "View Employees By Manager", "Add Employee", "Remove Employee", "Update Role", "Update Manager"],
    message: "What would you like to do?"}
]).then(function(data){
    switch(data.choice) {
        case "View Employees":
          view();
          break;
        case "View Employees By Department":
          byDept();
          break;
        case "View Employees By Manager":
          byManager();
          break;
        case "Add Employee":
          add();
          break;
        case "Remove Employee":
          remove();
          break;
        case "Update Role":
          updateRole();
          break;
        case "Update Manager":
          updateManager();
          break;
      }
})}

function view(){
  let query =
  "select e.id, e.first_name, e.last_name, r.title, r.salary, d.department from employee e INNER JOIN roles r on e.role_id = r.id inner join department d on r.department_id = d.id";
connection.query(query, function(err, res) {
  if (err) throw err;
  if (res.length == 0) {
    console.log("\nNo Data Stored In The Emplyee Database\n");
    setTimeout(function(){add();}, 1000);
  }else{
  console.log(`\n${res.length} Employees Found\n`);
  console.table(res);
  startPrompt();}
});
}

function byDept(){

}

function byManager(){

}

function add(){
  function roleChoice(dept, employee){
    let multiplier = 0;
    let roleArr = [];
    for(i = 0; i < depts.length; i++){
      if(dept === depts[i].name){
        roleArr = depts[i].roles;
        multiplier = i;
      }
    }
    inquirer.prompt([
      {type: "list",
      name: "role",
      choices: roleArr,
      message: "What Is The Employee's Role?"}
    ]).then(function(data){
      employee.role_id = (roleArr.indexOf(data.role)+1) + (multiplier * 3);
      connection.query(
        "insert into employee set ?",
        employee,
        function(err, res) {
          if (err) throw err;
          console.log(`\n${res.affectedRows} employee added!\n`);
          startPrompt();
        }
      );
    })
  }
   inquirer.prompt ([
      {type: "input",
       name: "employee_name",
       message: "Enter Employee's First And Last Name: "},
      {type: "list",
      name: "dept", 
      choices: ['Couch Testing', 'Snack Eating', 'Space Force'],
      message: "Which Department Does This Employee Work In?"}
   ]).then(function(data){
     let nameArr = data.employee_name.split(" ");
     let employee = {first_name: nameArr[0], last_name: nameArr[1]};
     roleChoice(data.dept, employee);
   })
}

function remove(){
  let queryString =
  "SELECT e.first_name, e.last_name, e.id AS empID FROM employee e";
connection.query(queryString, function(err, res) {
  if (err) throw err;
  inquirer
    .prompt({
      name: "remove",
      type: "list",
      choices: function() {
        let employeeArr = [];
        for (let i = 0; i < res.length; i++) {
          employeeArr.push(`${res[i].first_name} ${res[i].last_name}`);
        }
        return employeeArr;
      },
      message: "Choose Employee To Remove: "
    })
    .then(function(answers) {
      let employeeId;
      for (let j = 0; j < res.length; j++) {
        if (`${res[j].first_name} ${res[j].last_name}` === answers.remove) {
          employeeId = res[j].empID;
        }
      }
      connection.query(
        "DELETE FROM employee WHERE ?",
        {
          id: employeeId
        },
        function(err, res) {
          if (err) throw err;
          console.log(`\n${answers.remove} Removed\n`);
          startPrompt();
        }
      );
    });
});
}

function updateRole(){

}

function updateManager(){

}