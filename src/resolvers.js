import companyData from './datasources/company.js';

const resolvers = {
	Query: {
	  employees: (parent, args) => {
			const { groupBy } = args?.input || {};
			if (groupBy) {
				const groups = companyData.employees.reduce((acc, employee) => {
					const group = employee[groupBy];
					if (!acc[group]) {
						acc[group] = [];
					}
					acc[group].push(employee);
					return acc;
				}, {});

				const employees = Object.entries(groups).map(([group, employees]) => ({
					group,
					employees,
				}));
				return employees;
			}
			return companyData
		},
	},
	EmployeeList: {
			employees: (parent) => parent?.employees,
			total: (parent) => parent?.employees?.length,
			avg: (parent, args) => {
				const employees = parent?.employees;
				const { field } = args.input;
				const total = employees.reduce((acc, employee) => {
					if (typeof employee[field] !== 'number') {
						throw new Error(`Field ${field} is not a number`);
					}
					return acc + employee[field];
				}, 0);
				return total / employees.length;
			}
	},
	EmployeeGroupList: {
		groups: (parent) => parent,
	},
	EmployeeGroup: {
		group: (parent) => parent?.group,
		employeeList: (parent, args) => {
			const { groupBy } = args?.input || {};
			if (groupBy) {
				const groups = parent.employees.reduce((acc, employee) => {
					const group = employee[groupBy];
					if (!acc[group]) {
						acc[group] = [];
					}
					acc[group].push(employee);
					return acc;
				}, {});

				const employees = Object.entries(groups).map(([group, employees]) => ({
					group,
					employees,
				}));
				return employees;
			}
			return parent;
		},
	},
	Employees: {
		__resolveType: (parent) => {
			if (parent[0]?.group) {
				return 'EmployeeGroupList';
			}
			return 'EmployeeList';
		},
	},
}

export default resolvers;