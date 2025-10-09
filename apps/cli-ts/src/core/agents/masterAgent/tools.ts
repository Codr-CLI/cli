import { tool } from "@langchain/core/tools";
import { llm } from "@llm/llm";
import { z } from "zod";
import { codeTools } from "../codeAgent/CodeTools";
import { fileTools } from "../fileAgent/fileTools";
import { confirmAction } from "./tools/confirmAction";
import goalPlanner from "./tools/goalPlanner";
import runCommand from "./tools/runCliCommand";
// import { webSearch } from "./tools/webSearch";

const cliCommand = tool(runCommand, {
	name: "run_cli-command",
	description:
		"Executes terminal commands like installing packages, running scripts, or system operations",
	schema: z.object({
		command: z
			.string()
			.describe(
				"The CLI command to be executed in the user's terminal environment",
			),
	}),
});

const getFeedback = tool(confirmAction, {
	name: "get_user_feaeback",
	description:
		"Ask the user to confirm or override an AI decision before executing a tool or agent",
	schema: z.object({
		decision: z
			.string()
			.describe("The decision or action the AI wants confirmation for"),
	}),
});

const executionGoalPlanner = tool(goalPlanner, {
	name: "execution_goal_planner",
	description:
		"Given a high-level project goal, this tool generates a structured, step-by-step execution plan with precise actions (e.g., runCommand, writeFile, installPackage) suitable for automated agents.",
	schema: z.object({
		goal: z
			.string()
			.describe(
				"A natural language description of what the user wants to build or accomplish, such as 'Create a blog using Next.js and TailwindCSS with a contact form and dark mode'.",
			),
	}),
});

// temporarily unsupported due to rag dependency
// const searchOnWeb = tool(webSearch, {
// 	name: "web_search",
// 	description:
// 		"Searches the web for up-to-date information relevant to a user query. Useful when additional context, tutorials, latest documentation, or troubleshooting solutions are needed.",
// 	schema: z.object({
// 		query: z
// 			.string()
// 			.describe(
// 				"The natural language proper descriptive search string the user would type into a search engine.",
// 			),
// 	}),
// });

export const tools = [
	executionGoalPlanner,
	// searchOnWeb,
	getFeedback,
	cliCommand,
	...fileTools,
	...codeTools,
];

export const toolsByName = Object.fromEntries(
	tools.map((tool) => [tool.name, tool]),
);
export const llmWithTools = llm.bindTools(tools);
