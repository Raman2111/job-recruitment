var client = require('./connection.js');

client
	.index({
		index: 'recruiters',
		id: '609562e0bff591183cfbde04',
		type: 'users',
		body: {
			name: 'Raman',
			email: 'ramandeep2111@gmail.com',
			phone: '5876544810',
			country: 'Australia',
			address: '',
			title: 'Software engineer',
			about: '',
		},
	})
	.then((resp, status) => {
		console.log(resp);
	})
	.catch((err) => {
		console.log(err);
	});
