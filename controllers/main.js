
exports.getHome = (req, res, next) => {
	// axios.get(url)
	// 	.then(result => {
	// 		console.log(result);
	// 	})
	// 	.catch(err => {
	// 		console.log(error);
	// 	})
	res.render('index', {
		path: '/',
		pageTitle: 'Home',
	});
};