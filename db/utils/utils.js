exports.formatDates = list => {
	return list.map(({ created_at, ...rest }) => {
		return {
			...rest,
			created_at: new Date(created_at)
		};
	});
};

exports.makeRefObj = (list, prop1, prop2) => {
	const refObj = {};
	list.forEach(item => {
		refObj[item[prop1]] = item[prop2];
	});
	return refObj;
};

exports.formatComments = (comments, articleRef) => {
	return comments.map(({ created_by, belongs_to, created_at, ...rest }) => {
		return {
			...rest,
			author: created_by,
			article_id: articleRef[belongs_to],
			created_at: new Date(created_at)
		};
	});
};

exports.isLegalNumber = num => {
	const validators = [
		value => typeof value === 'number',
		value => !isNaN(value),
		value => value < 500,
		value => value > -500
	];
	return validators.every(validator => validator(num));
};
