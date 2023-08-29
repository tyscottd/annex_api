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
				} else {
					data = [{ list: data }];
				}
			});

			return data.map((employee) => ({
				employees: employee,
			}));
		},
	},
	EmployeesMembers: {
		count: (parent) => {
			return parent.list.length;
		},
	},
}

export default resolvers;
