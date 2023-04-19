import companyData from './datasources/company.js';

function groupList(list, field) {
	let groups = list.reduce((acc, listItem) => {
		const group = listItem[field];
		if (!acc[group]) {
			acc[group] = [];
		}
		acc[group].push(listItem);
		return acc;
	}, {});

	return Object.entries(groups).map(([group, list]) => ({
		group,
		list: list,
	}));
}

const resolvers = {
	Query: {
	  employees: (parent, args) => {
			const { groupBy } = args?.input || {};
			let employees = companyData.employees;
			if (groupBy) {
				return groupList(employees, groupBy);
			}

			return [{ list: employees }];
		},
	},
	GroupedList: {
		total: (parent) => parent.list.length,
		avg: (parent, args) => {
			const list = parent?.list;
			const { field } = args.input;
			const sum = list.reduce((acc, listItem) => {
				if (typeof listItem[field] !== 'number') {
					throw new Error(`Field ${field} is not a number`);
				}
				return acc + listItem[field];
			}, 0);
			return sum / list.length;
		},
		sum: (parent, args) => {
			const list = parent?.list;
			const { field } = args.input;
			return list.reduce((acc, listItem) => {
				if (typeof listItem[field] !== 'number') {
					throw new Error(`Field ${field} is not a number`);
				}
				return acc + listItem[field];
			}, 0);
		},
		list: (parent, args) => {
			const { groupBy } = args?.input || {};
			let list = parent.list;
			if (groupBy) {
				return groupList(list, groupBy);
			}
			return list;
		},
	},
	Iterable: {
		__resolveType: (parent, args) => {
			// TODO: Account for other iterable types
			if (parent?.group) {
				return 'GroupedList'; 
			}
			return 'Employee';
		},
	},
}

export default resolvers;