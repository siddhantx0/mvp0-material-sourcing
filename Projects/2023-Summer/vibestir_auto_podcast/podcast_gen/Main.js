const fs = require("fs");
const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
});

/**
 * context file...
 *      [podcast-members,,,]
 *      [topic-summary]
 *      [generated-view]
 */

const main = () => {
	let toReadFile;
	let file;
	readline.question("creating a new podcast? (y/n) ", (ans) => {
		toReadFile = ans.toLowerCase().trim() !== "y"; // if we are creating a new podcast we need new context
		console.log("\n");
	});

	if (toReadFile)
		readline.question("enter filename (name.postfix): ", (ans) => {
			fs.readFile(`./${ans}`, "utf8", (err, data) => {
				file = data;
			});
		});
};
