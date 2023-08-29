import companyData from './datasources/company.js';

function groupList(list, fields) {
	let groups = list.reduce((acc, listItem) => {
		const group = fields.reduce((acc, field) => {
			acc[field] = listItem[field];
			return acc;
		}, {});

		const groupStr = JSON.stringify(group);
		if (!acc[groupStr]) {
			acc[groupStr] = [];
		}
		acc[groupStr].push(listItem);
		return acc;
	}, {});

	let result = Object.entries(groups).map(([group, list]) => {
		return {
			...JSON.parse(group),
			list,
		}
	});
	return result;
}

const MEASURE_FIELDS = ['count'];

const resolvers = {
	Query: {
		cube: (parent, args, context, info) => {
			let data = [];
			let selectedCubes = info.fieldNodes[0].selectionSet.selections;

			selectedCubes.forEach((cube) => {
				let cubeName = cube.name.value;
				let cubeArgs = cube.arguments;
				let fields = cube.selectionSet.selections;
				let measures = [];
				let dimensions = [];

				switch (cubeName) {
					case 'employees':
						data = companyData.employees;
						break;
					default:
						throw new Error(`Cube ${cubeName} not found`);
				}

				fields.forEach((field) => {
					if (MEASURE_FIELDS.includes(field.name.value)) {
						measures.push(field.name.value);
					} else {
						dimensions.push(field.name.value);
					}
				});

				if (measures.length && dimensions.length) {
					data = groupList(data, dimensions);
				}
			});

			return data.map((employee) => ({
				employees: employee,
			}));
		},
	  employees: (parent, args) => {
			const { groupBy } = args?.input || {};
			let employees = companyData.employees;
			if (groupBy) {
				return groupList(employees, groupBy);
			}

			return [{ list: employees }];
		},
		turnover: (parent, args) => {
			const { groupBy } = args?.input || {};
			let turnover = companyData.turnover;
			if (groupBy) {
				return groupList(turnover, groupBy);
			}

			return [{ list: turnover }];
		},
	},
	EmployeesMembers: {
		count: (parent) => {
			return parent.list.length;
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

			if (parent?.id) {
				return 'Employee';
			}
			
			return 'Turnover';
		},
	},
}

export default resolvers;
