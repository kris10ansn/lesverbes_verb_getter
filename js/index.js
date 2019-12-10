const getConjugations = require("./getConjugations");
const inquirer = require("inquirer");

let arg3 = process.argv[3];
async function prompt(verb) {
	return new Promise(async (resolve, reject) => {
		const conjugations = await getConjugations(verb).catch(err => {
			reject(`Verb "${verb}" ${err}`);
			return null;
		});

		if (conjugations === null) return;

		const answers = arg3
			? { form: arg3 }
			: await inquirer.prompt([
					{
						name: "form",
						message: `Which form would you like to see ${verb} in?`,
						choices: [...conjugations.map(c => c.title)],
						type: "list"
					}
			  ]);

		if (arg3) {
			conjugations.forEach(conjugation => {
				// Remove accent and convert to lowercase, replace - with space
				const simplify = str =>
					str
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.replace(/\-/g, " ")
						.toLowerCase();

				const arg = simplify(arg3);
				const formSimple = simplify(conjugation.title);

				if (arg === formSimple) {
					answers.form = conjugation.title;
				}
			});

			arg3 = null;
		}

		const form = answers["form"];
		const conjugation = conjugations.find(c => c.title === form);

		resolve(conjugation);
	});
}

let verb = process.argv[2];
async function start() {
	const answers = verb
		? { verb }
		: await inquirer.prompt([
				{
					name: "verb",
					message: "What verb are you looking for? ",
					type: "input"
				}
		  ]);

	verb = null;

	const conjugations = await prompt(answers["verb"]).catch(err => {
		console.log(err);
		return null;
	});

	if (conjugations !== null) {
		console.log(
			`
					${conjugations.title}:
					${conjugations.content}
				`.replace(/\t/g, "")
		);
	}

	setTimeout(start, 200);
}
start();
