## Setup

- Run `docker-compose up` to start the server
- Go to `http://localhost:4000/` to interact with the API
	- This can be done through Postman, Insomnia, or the browser. No authentication is necessary.

## Description

This API allows you to group and aggregate data in a flexible way. Here are a few example queries:

#### Getting a list of employees
```
query Employees {
    employees {
        list {
            ... on Employee {
                id
                name
                gender
                age
            }
        }
    }
}
```

#### Getting a list of employees with total count and average age
```
query Employees {
    employees {
        total
        avg(input: {field: "age"})
        list {
            ... on Employee {
                id
                name
                gender
                age
            }
        }
    }
}
```

#### Getting a list of employees grouped by department, with total count and average age of each department
```
query Employees {
    employees(input: {groupBy: "department"}) {
        group
        total
        avg(input: {field: "age"})
        list {
            ... on Employee {
                id
                name
                gender
                age
            }
        }
    }
}
```

#### Getting a total count of all employees and total count of each department
```
query Employees {
    employees {
        total
        list(input: {groupBy: "department"}) {
            ... on GroupedList {
                group
                total
            }
        }
    }
}
```

#### Getting total count and average age of each department and the total count and average age of each gender within each department
```
query Employees {
    employees(input: {groupBy: "department"}) {
        group
        total
        avg(input: {field: "age"})
        list(input: {groupBy: "gender"}) {
            ... on GroupedList {
                group
                total
                avg(input: {field: "age"})
            }
        }
    }
}
```