INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Product"),
       ("Operations");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 1),
       ("Lead Engineer", 150000, 1),
       ("Account Manager", 160000, 2),
       ("Accountant", 125000, 2),
       ("Product Manager", 150000, 3),
       ("Product Designer", 125000, 3),
       ("Program Manager", 130000, 4),
       ("Operations Manager", 125000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Devin", "Polichetti", 2, 1),
       ("Jason", "Derulo", 1, 1);