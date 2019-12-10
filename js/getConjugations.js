const get = require('./get');
const fs = require('fs');
const HTMLParser = require('node-html-parser');

const forms = [
	"Présent",
	"Passé composé",
	"Passé simple",
	"Imparfait",
	"Plus-que-parfait",
	"Futur simple",
	"Futur antérieur",
	"Passé antérieur"
]

module.exports = async function getConjugations(verb) {
	return new Promise(async (resolve, reject) => {
		const data = await get(verb);
		const html = HTMLParser.parse(data);

		let text = "";
		html.childNodes.find(value => (text += value.text));

		const re = new RegExp(
			`(${forms.join("|").slice(0, -1)})(.|\\n)+?ils .+`, "g"
		);
		
		const conjugations = text.match(re).map(match => ({
			title: match.split('\n')[0],
			content: match.split('\n').slice(2, match.length).join('\n')
		}));

		if(conjugations.length > 0)
			resolve(conjugations);
		else
			reject('not found')
	});
}
