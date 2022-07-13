const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
	process.env.AIRTABLE_BASE_KEY
);

const table = base('coffee-stores');

const createCoffeeStore = async (req, res) => {
	if (req.method === 'POST') {
		const { id, name, neighbourhood, address, imgUrl, voting } = req.body;

		try {
			if (id) {
				const findCoffeeStoreRecords = await table
					.select({
						filterByFormula: `id=${id}`,
					})
					.firstPage();

				if (findCoffeeStoreRecords.length !== 0) {
					const records = findCoffeeStoreRecords.map((record) => {
						return {
							...record.fields,
						};
					});

					res.json(records);
				} else {
					if (name) {
						const createRecords = await table.create([
							{
								fields: {
									id,
									name,
									address,
									neighbourhood,
									voting,
									imgUrl,
								},
							},
						]);

						const records = createRecords.map((record) => {
							return {
								...record.fields,
							};
						});

						res.json(records);
					} else {
						res.status(400);
						res.json({ message: 'Name is missing' });
					}
				}
			} else {
				res.status(400);
				res.json({ message: 'Id is missing' });
			}
		} catch (error) {
			console.error('Error creating or finding a store', error);
			res.status(500);
			res.jsoN({ message: 'Error creating or finding a store', error });
		}
	}
};

export default createCoffeeStore;
