exports.badMethod = (req, res, next) => {
	res
		.status(405)
		.send({ msg: 'BAD METHOD: Method not allowed on this endpoint' });
};

exports.psqlErrorHandling = (err, req, res, next) => {
	if (err.status) {
		next(err);
	} else {
		const psqlErrors = {
			'42703': [400, 'Column does not exist'],
			'22P02': [400, 'Invalid input syntax'],
			'23503': [404, 'Target does not exist in database']
		};
		const { code } = err;
		res.status(psqlErrors[code][0]).send({ msg: psqlErrors[code][1] });
	}
};

exports.customErrorHandling = (err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		res.status(500).send({
			msg:
				'Unhandled error, please send me the following so I can investigate:\n===================================================================\n\n',
			err
		});
	}
};

exports.noRouteErrorHandling = (req, res, next) => {
	res.status(404).send({ msg: 'Route not found' });
};
