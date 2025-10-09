// import { ensureRagServerRunning } from "@utils/ensureRagServer";
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

// Deprecated: Document query command
// This section is temporarily unsupported due to code restructuring & RAG extraction.
// Keeping here for reference until the new RAG backend integration is stable.
// Document query (RAG)
// program
// 	.command("doc")
// 	.description("Query a document (PDF, DOCX, TXT, CSV, MD) using RAG")
// 	.requiredOption("-p, --path <path>")
// 	.requiredOption("-q, --query <query>")
// 	.option("--chat", "Open persistent chat UI")
// 	.action(async (opts) => {
// 		const ok = await ensureRagServerRunning();
// 		if (!ok) {
// 			return process.exit(1);
// 		}

// 		if (opts.chat) {
// 			const { chatWithContext } = await import("./commands/chat");
// 			await chatWithContext({
// 				path: opts.path,
// 				query: opts.query,
// 				type: "doc",
// 			});
// 		} else {
// 			const { queryWebsite } = await import(
// 				"@core/tools/documents/queryAnswer"
// 			);
// 			await queryWebsite({ path: opts.path, query: opts.query, type: "doc" });
// 		}
// 	});

// Deprecated: Webpage query command
// This section is temporarily unsupported due to code restructuring & RAG extraction.
// Will be reintroduced once new RAG backend APIs are finalized.
// Webpage content query (same as doc but from HTML)
// program
// 	.command("webpage")
// 	.description("Analyze and extract info from a webpage HTML file")
// 	.requiredOption("-p, --path <path>")
// 	.requiredOption("-q, --query <query>")
// 	.option("--chat", "Open persistent chat UI")
// 	.action(async (opts) => {
// 		const ok = await ensureRagServerRunning();
// 		if (!ok) {
// 			return process.exit(1);
// 		}

// 		if (opts.chat) {
// 			const { chatWithContext } = await import("./commands/chat");
// 			await chatWithContext({
// 				path: opts.path,
// 				query: opts.query,
// 				type: "webpage",
// 			});
// 		} else {
// 			const { queryWebsite } = await import(
// 				"@core/tools/documents/queryAnswer"
// 			);
// 			await queryWebsite({
// 				path: opts.path,
// 				query: opts.query,
// 				type: "webpage",
// 			});
// 		}
// 	});

// Active: Codebase analysis command
// This is still supported and functional (JS, TS, Python)
// program
// 	.command("codebase")
// 	.description("Ask questions about a local JS/TS/Python codebase")
// 	.requiredOption("-p, --path <path>")
// 	.requiredOption("-q, --query <query>")
// 	.option("--chat", "Open persistent chat UI")
// 	.action(async (opts) => {
// 		// const ok = await ensureRagServerRunning();
// 		// if (!ok) {
// 		// 	return process.exit(1);
// 		// }
// 		if (opts.chat) {
// 			const { chatWithContext } = await import("./commands/chat");
// 			await chatWithContext({
// 				path: opts.path,
// 				query: opts.query,
// 				type: "codebase",
// 			});
// 		} else {
// 			const { indexCodebase } = await import("@core/tools/code/indexCodebase");
// 			await indexCodebase({
// 				path: opts.path,
// 				query: opts.query,
// 				type: "codebase",
// 			});
// 		}
// 	});

// Start the CLI
await program.parseAsync();
