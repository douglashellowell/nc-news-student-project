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
}); // << add 'created_at does not exist' edge case

describe('makeRefObj', () => {
	it('Should return an empty object when passed an empty array', () => {
		expect(makeRefObj([])).to.eql({});
	});
	it('Should return a correct refObj of single item in array', () => {
		const input = [{ name: 'doug', age: 27 }];
		const actual = makeRefObj(input, 'name', 'age');
		const expected = { doug: 27 };
		expect(actual).to.eql(expected);
	});
	it('Should handle multiple items in array', () => {
		const input = [
			{ name: 'doug', age: 27 },
			{ name: 'hannah', age: 26 },
			{ name: 'eve', age: 25 },
			{ name: 'toni', age: 13, favouriteFood: 'cucumber' }
		];
		const actual = makeRefObj(input, 'name', 'age');
		const expected = { doug: 27, hannah: 26, eve: 25, toni: 13 };
		expect(actual).to.eql(expected);
	});
	it('Should not mutate original array', () => {
		const input = [{ name: 'doug', age: 27 }];
		makeRefObj(input, 'name', 'age');
		expect(input).to.eql([{ name: 'doug', age: 27 }]);
	});
	it('articleRef example...', () => {
		const input = [
			{
				article_id: 1,
				title: 'Living in the shadow of a great man',
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'I find this existence challenging',
				created_at: 1542284514171,
				votes: 100
			},
			{
				article_id: 2,
				title: 'Sony Vaio; or, The Laptop',
				topic: 'mitch',
				author: 'icellusedkars',
				body:
					'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
				created_at: 1416140514171
			},
			{
				article_id: 3,
				title: 'Eight pug gifs that remind me of mitch',
				topic: 'mitch',
				author: 'icellusedkars',
				body: 'some gifs',
				created_at: 1289996514171
			}
		];
		const actual = makeRefObj(input, 'author', 'article_id');
		console.log(actual);
	});
}); // << add 'prop1/prop2 does not exist' edge case

describe('formatComments', () => {
	it('returns an empty array when passed an empty array', () => {
		expect(formatComments([])).to.eql([]);
	});
	it('correctly formats one comment object', () => {
		const input = [
			{
				body: 'I hate streaming noses',
				belongs_to: 'Living in the shadow of a great man',
				created_by: 'icellusedkars',
				votes: 0,
				created_at: 1385210163389
			}
		];
		const refObj = { 'Living in the shadow of a great man': 3 };
		const actual = formatComments(input, refObj);
		const expected = [
			{
				article_id: 3,
				body: 'I hate streaming noses',
				author: 'icellusedkars',
				votes: 0,
				created_at: new Date(1385210163389)
			}
		];
		expect(actual).to.eql(expected);
	});
	it('Correctly formats multiple comments in array', () => {
		const input = [
			{
				body:
					'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
				belongs_to: 'Different article name',
				created_by: 'icellusedkars',
				votes: 100,
				created_at: 1448282163389
			},
			{
				body: ' I carry a log — yes. Is it funny to you? It is not to me.',
				belongs_to: 'Living in the shadow of a great man',
				created_by: 'icellusedkars',
				votes: -100,
				created_at: 1416746163389
			},
			{
				body: 'I hate streaming noses',
				belongs_to: 'Living in the shadow of a great man',
				created_by: 'icellusedkars',
				votes: 0,
				created_at: 1385210163389
			}
		];
		const refObj = {
			'Living in the shadow of a great man': 3,
			'Different article name': 1
		};
		const actual = formatComments(input, refObj);
		const expected = [
			{
				body:
					'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
				article_id: 1,
				author: 'icellusedkars',
				votes: 100,
				created_at: new Date(1448282163389)
			},
			{
				body: ' I carry a log — yes. Is it funny to you? It is not to me.',
				article_id: 3,
				author: 'icellusedkars',
				votes: -100,
				created_at: new Date(1416746163389)
			},
			{
				article_id: 3,
				body: 'I hate streaming noses',
				author: 'icellusedkars',
				votes: 0,
				created_at: new Date(1385210163389)
			}
		];
		expect(actual).to.eql(expected);
	});
	it('does not mutate original array', () => {
		const input = [
			{
				body: 'I hate streaming noses',
				belongs_to: 'Living in the shadow of a great man',
				created_by: 'icellusedkars',
				votes: 0,
				created_at: 1385210163389
			}
		];
		const refObj = { 'Living in the shadow of a great man': 3 };
		const actual = formatComments(input, refObj);
		expect(input).to.eql([
			{
				body: 'I hate streaming noses',
				belongs_to: 'Living in the shadow of a great man',
				created_by: 'icellusedkars',
				votes: 0,
				created_at: 1385210163389
			}
		]);
	});
}); // << ? edge cases
