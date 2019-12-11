exports.badMethod = (req, res, next) => {
	res
		.status(405)
		.send({ msg: 'BAD METHOD: Method not allowed on this endpoint' });
};
