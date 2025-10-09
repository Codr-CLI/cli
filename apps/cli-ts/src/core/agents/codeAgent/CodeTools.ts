import { tool } from "@langchain/core/tools";
import { llm } from "@llm/llm";
import { z } from "zod";

// Tool implementations
import { deleteCodeAtLines } from "./tools/deleteCode";
import { editFileAtLine } from "./tools/editCode";
// import generateCodebaseMetadata from "./tools/generateCodebaseMetadata";
import { getCallGraphContext } from "./tools/getCallGraphContext";
import { getClassContext } from "./tools/getClassContext";
import { getContext } from "./tools/getContext";
// import { getCodeContextByQuery } from "./tools/getContextByQuery";
import { getFileContext } from "./tools/getFileContext";
import { getFunctionContext } from "./tools/getFunctionContext";

/**
 * Tool: Delete a code block using line ranges.
 */
const deleteCodeTool = tool(deleteCodeAtLines, {
	name: "delete_code",
	description:
		"Deletes a block of code from a file using the start and end line numbers. Useful for removing functions, classes, or arbitrary code sections.",
	schema: z.object({
		filePath: z
			.string()
			.describe("Path to the file where code should be deleted."),
		startLine: z
			.number()
			.describe("The starting line number of the block to delete."),
		endLine: z
			.number()
			.describe("The ending line number of the block to delete."),
	}),
});

/**
 * Tool: Insert or overwrite code at a specific location in a file.
 */
const editCodeTool = tool(editFileAtLine, {
	name: "edit_code",
	description:
		"Inserts or replaces code at a specific line number in a file. Ideal for injecting new logic or editing existing code.",
	schema: z.object({
		filePath: z
			.string()
			.describe("The file where the code will be inserted or modified."),
		startLine: z
			.number()
			.describe("The line number where the new content should be placed."),
		content: z.string().describe("The actual code content to insert."),
	}),
});

/**
 * Tool: Get metadata for any code entity — function, class, or file.
 */
const getContextTool = tool(getContext, {
	name: "get_context",
	description:
		"Retrieves metadata for a function, class, file, or UI artifact (HTML/CSS). Includes path, range, parameters, and structure.",
	schema: z.object({
		entityName: z
			.string()
			.describe("The name of the target function, class, or file."),
		type: z
			.enum(["function", "class", "file", "html", "css"])
			.describe("The type of entity to fetch context for."),
	}),
});

/**
 * Tool: Analyze function relationships in the call graph.
 */
const getCallGraphTool = tool(getCallGraphContext, {
	name: "get_call_graph",
	description:
		"Returns the call graph of a given function including other functions it calls and those that call it.",
	schema: z.object({
		fnName: z
			.string()
			.describe("The name of the function to analyze in the call graph."),
	}),
});

/**
 * Tool: Perform fuzzy or semantic search over the code metadata.
 */
// const getContextByQueryTool = tool(getCodeContextByQuery, {
// 	name: "get_context_by_query",
// 	description:
// 		"Searches the static code metadata using natural language queries to retrieve relevant context (function, file, or class info).",
// 	schema: z.object({
// 		query: z
// 			.string()
// 			.describe("A natural language query describing what you're looking for."),
// 	}),
// });

/**
 * Tool: Get function-level metadata by exact name.
 */
const getFunctionContextTool = tool(getFunctionContext, {
	name: "get_function_context",
	description:
		"Retrieves metadata for a function by name including parameters, return type, location, and docstring.",
	schema: z.object({
		fnName: z
			.string()
			.describe("The name of the function to fetch metadata for."),
	}),
});

/**
 * Tool: Get class-level metadata by exact name.
 */
const getClassContextTool = tool(getClassContext, {
	name: "get_class_context",
	description:
		"Retrieves metadata for a class by name including its properties, methods, and source location.",
	schema: z.object({
		className: z
			.string()
			.describe("The name of the class to fetch metadata for."),
	}),
});

/**
 * Tool: Get file-level metadata including language, size, and defined symbols.
 */
const getFileContextTool = tool(getFileContext, {
	name: "get_file_context",
	description:
		"Retrieves metadata for a file, including programming language, number of lines, imported/exported symbols, and defined entities.",
	schema: z.object({
		filePath: z
			.string()
			.describe("The full or relative path of the file to analyze."),
	}),
});

/**
 * Tool: Parse the codebase and generate static metadata (functions, classes, files, call graph).
 */
// const generateCodebaseMetadataTool = tool(generateCodebaseMetadata, {
// 	name: "generate_codebase_metadata",
// 	description:
// 		"Analyzes the entire codebase and creates static metadata files for functions, classes, and call graphs. Stores results in `.metadata/` folder and optional vector store.",
// 	schema: z.object({}),
// });

// Register tools for use
export const codeTools = [
	deleteCodeTool,
	editCodeTool,
	getContextTool,
	getCallGraphTool,
	// getContextByQueryTool,
	getFunctionContextTool,
	getClassContextTool,
	getFileContextTool,
	// generateCodebaseMetadataTool,
];

export const codeToolsByName = Object.fromEntries(
	codeTools.map((t) => [t.name, t]),
);

export const llmWithCodeTools = llm.bindTools(codeTools);
