const typeDefs = `#graphql
  type EmployeesMembers {
    count: Int!
    
    id: ID!
    name: String!
    gender: String!
    age: Int!
    hireDate: String!
    terminationDate: String
    department: String!
    division: String!
    jobTitle: String!
    location: String!
    employmentStatus: String!
  }

  type Result {
    employees: EmployeesMembers!
  }

  type Query {
    cube: [Result!]!
  }
`;

export default typeDefs;
