const typeDefs = `#graphql
  input EmployeeInput {
    groupBy: String
  }

  input AvgInput {
    field: String!
  }

  type EmployeeList {
    employees: [Employee!]!
	  total: Int!
    avg(input: AvgInput!): Float!
  }

  type EmployeeGroup {
    group: String!
    employeeList(input: EmployeeInput): Employees!
  }

  type EmployeeGroupList {
    groups: [EmployeeGroup!]!
  }

  union Employees = EmployeeList | EmployeeGroupList

  type Employee {
    id: ID!
    name: String!
    gender: String!
    age: Int!
    hireDate: String!
    terminationDate: String
    department: String!
	}

  type Query {
    employees(input: EmployeeInput): Employees!
  }
`;

export default typeDefs;