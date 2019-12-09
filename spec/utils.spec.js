const { expect } = require('chai');
const {
	formatDates,
	makeRefObj,
	formatComments
} = require('../db/utils/utils');

describe('formatDates', () => {
	it('Should return an empty array when passed an empty array', () => {
		expect(formatDates([])).to.eql([]);
	});
	it('Should return a single item in array with dateTime correctly reformatted', () => {
		const input = [{ created_at: 1542284514171 }];
		const expected = [{ created_at: new Date(1542284514171) }];
		expect(formatDates(input)).to.eql(expected);
	});
	it('Should not mutate other properties in the array', () => {
		const input = [
			{
				title: 'emojis in coding: a casestudy in madness',
				created_at: 1289996514171,
				topic: 'doug',
				author: 'dt_666',
				votes: 3
			}
		];
		const expected = [
			{
				title: 'emojis in coding: a casestudy in madness',
				created_at: new Date(1289996514171),
				topic: 'doug',
				author: 'dt_666',
				votes: 3
			}
		];
		expect(formatDates(input)).to.eql(expected);
		expect(input).to.not.eql(expected);
	});
	it('Should not mutate original array', () => {
		const input = [{ created_at: 1542284514171 }];
		const expected = [{ created_at: new Date(1542284514171) }];
		formatDates(input);
		expect(input).to.not.eql(expected);
	});
	it('Should handle multiple items in the array', () => {
		const input = [
			{ title: 'vegan ice-cream recipes', created_at: 1542284514171 },
			{ title: 'vegan ice-cream arts-and-crafts', created_at: 1416140514171 },
			{ title: 'vegan ice-cream fashion', created_at: 911564514171 },
			{ title: 'vegan ice-cream: Zeitgeist', created_at: 785420514171 },
			{ title: 'vegan ice-cream throughout history', created_at: 533132514171 }
		];
		const expected = [
			{ title: 'vegan ice-cream recipes', created_at: new Date(1542284514171) },
			{
				title: 'vegan ice-cream arts-and-crafts',
				created_at: new Date(1416140514171)
			},
			{ title: 'vegan ice-cream fashion', created_at: new Date(911564514171) },
			{
				title: 'vegan ice-cream: Zeitgeist',
				created_at: new Date(785420514171)
			},
			{
				title: 'vegan ice-cream throughout history',
				created_at: new Date(533132514171)
			}
		];
		expect(formatDates(input)).to.eql(expected);
	});
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
