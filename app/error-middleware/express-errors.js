exports.badMethod = (req, res, next) => {
	res
		.status(400)
		.send({ msg: 'BAD METHOD: Method not allowed on this endpoint' });
};
