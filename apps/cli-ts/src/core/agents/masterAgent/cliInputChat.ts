import { HumanMessage } from "@langchain/core/messages";
import chalk from "chalk";
import readline from "readline";

const userPrefix = chalk.bold.blue("> You:");
const assistantPrefix = chalk.bold.green("> Assistant:");
const promptSymbol = chalk.gray("›");
const exitNotice = chalk.dim('(Type "exit" to quit)');
const emptyInputMessage = chalk.yellow("Please enter a message to continue...");

export async function chatInputNode(state: any) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	// Show last assistant response if exists
	if (state.messages?.length > 2) {
		const lastMessage = state.messages[state.messages.length - 1];

		if (lastMessage._getType() === "ai") {
			let content = lastMessage.content;

			if (typeof content !== "string") {
				try {
					content = JSON.stringify(content, null, 2);
				} catch {
					content = String(content);
				}
			}

			console.log(`\n${assistantPrefix} ${content}\n`);
		}
	}

	return new Promise<{ messages: any[] }>((resolve) => {
		// Dynamic prompt line
		const promptLine =
			state.messages?.length > 2
				? `${promptSymbol} Continue? ${exitNotice}\n${promptSymbol} `
				: `${promptSymbol} Your request ${exitNotice}\n${promptSymbol} `;

		const ask = () => {
			rl.question(promptLine, (answer) => {
				if (answer.trim() === "") {
					console.log(emptyInputMessage);
					ask(); // Ask again
					return;
				}

				if (answer.toLowerCase() === "exit") {
					console.log(chalk.dim("\nSession ended\n"));
					rl.close();
					process.exit(0);
				}

				// Echo user input cleanly
				console.log(`${userPrefix} ${answer}`);
				rl.close();

				const newMessages = state.messages
					? [...state.messages, new HumanMessage(answer)]
					: [new HumanMessage(answer)];

				resolve({ messages: newMessages });
			});
		};

		ask();
	});
}
