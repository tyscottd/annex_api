const typeDefs = `#graphql
  input GroupInput {
    groupBy: String
  }

  input AggregateInput {
    field: String!
  }

  type Employee {
    id: ID!
    name: String!
    gender: String!
    age: Int!
    hireDate: String!
    terminationDate: String
    department: String!
	}

  type User {
    id: ID!
    name: String!
  }

  union Iterable = Employee | User | GroupedList

  type GroupedList {
    group: String
    list(input: GroupInput): [Iterable!]!
    total: Int!
    avg(input: AggregateInput!): Float!
    sum(input: AggregateInput!): Float!
  }

  type Query {
    employees(input: GroupInput): [GroupedList!]!
  }
`;

export default typeDefs;