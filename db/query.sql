-- this is going to be a query that will include the department name on the role tables

SELECT role.id, role.title, department.name AS 'department', role.salery
FROM role
JOIN department ON role.department_id = department.id;

-- this is going to create a query that will include data from the department and role
SELECT employee.id, employee.first_name, employee.last_name, role.title AS 'title', department.name as 'department', role.salary as 'salary'
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id;