import chalk from "chalk";
import { program } from "commander";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get project root from current file location
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, ".env");

if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
	console.log(chalk.dim("✓ .env loaded from"));
} else {
	console.log(envPath);

	console.warn(chalk.red("✕ .env not found"));
}

// Fast help and welcome screen handling (before any heavy logic)
if (process.argv.length <= 2) {
	const { printWelcomeScreen } = await import("./ui/WellcomeScreen");
	printWelcomeScreen();

	const { runMasterAgent } = await import(
		"@core/agents/masterAgent/masterAgent"
	);
	const { CONVERSATION_SYSTEM_PROMPT } = await import("@constants/masternode");
	const msg = "Hello!!";
	await runMasterAgent({
		systemPrompt: CONVERSATION_SYSTEM_PROMPT,
		userPrompt: msg,
	});
	process.exit(0);
}

if (process.argv.includes("-h") || process.argv.includes("--help")) {
	const { printHelpScreen } = await import("./ui/printHelpScreen");
	printHelpScreen();
	process.exit(0);
}

// Setup CLI meta
program.name("codr").description("AI CLI Assistant").version("1.0.0");

// Default conversation mode (lightweight, small tasks only)
program.argument("<prompt...>").action(async (prompt) => {
	const { runMasterAgent } = await import(
		"@core/agents/masterAgent/masterAgent"
	);
	const { CONVERSATION_SYSTEM_PROMPT } = await import("@constants/masternode");
	const msg = prompt.join(" ");
	await runMasterAgent({
		systemPrompt: CONVERSATION_SYSTEM_PROMPT,
		userPrompt: msg,
	});
});

// Codr init mode: generates full .codr/contexts/
program.command("init").action(async () => {
	const { runMasterAgent } = await import(
		"@core/agents/masterAgent/masterAgent"
	);
	const { INIT_SYSTEM_PROMPT } = await import("@constants/masternode");
	await runMasterAgent({
		userPrompt: "Do What ever the System Prompt Says",
		systemPrompt: INIT_SYSTEM_PROMPT,
	});
});

// Create mode: heavy fullstack project creation
program
	.command("create")
	.argument("<prompt>")
	.action(async (prompt) => {
		const { runMasterAgent } = await import(
			"@core/agents/masterAgent/masterAgent"
		);
		const { CREATE_SYSTEM_PROMPT } = await import("@constants/masternode");
		await runMasterAgent({
			userPrompt: prompt,
			systemPrompt: CREATE_SYSTEM_PROMPT,
		});
	});

// Start the CLI
await program.parseAsync();
