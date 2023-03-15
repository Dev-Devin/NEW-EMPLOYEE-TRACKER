-- query that includes the departmetn name on the role tables

SELECT role.id, role.title, department.name AS 'department', role.salery
FROM role
JOIN department ON role.department_id = department.id;