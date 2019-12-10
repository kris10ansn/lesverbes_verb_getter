const getConjugations = require("./getConjugations");
const inquirer = require("inquirer");

async function prompt(verb) {
	return new Promise(async (resolve, reject) => {
		const conjugations = await getConjugations(verb)
								.catch(err => {
									reject(`Verb "${verb}" ${err}`)
									return null;
								});
								
		if(conjugations === null) return;

		inquirer
			.prompt([
				{
					name: "form",
					message: `Which form would you like to see ${verb} in?`,
					choices: [...conjugations.map(c => c.title)],
					type: "list"
				}
			])
			.then(answers => {
				const form = answers["form"];
				const conjugation = conjugations.find(c => c.title === form);

				resolve(conjugation);
			});
	});
}

function start() {
	inquirer
		.prompt([
			{
				name: "verb",
				message: "What verb are you looking for? ",
				type: "input"
			}
		])
		.then(async answers => {
			const conjugations = await prompt(answers["verb"])
				.catch(err => {
					console.log(err);
					return null;
				});

			if(conjugations !== null) {
				console.log(`
					${conjugations.title}:
					${conjugations.content}
				`.replace(/\t/g, ''));
			}

			setTimeout(start, 200);
		});
}
start();
