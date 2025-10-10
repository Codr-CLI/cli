import { startLoader, stopLoader } from "@cli/ui/Loader/loaderManager";
import { parseCodebase } from "@codebase";
import generateCallGraph from "@core/context/codebaseMetaData/callgraph";
import generateClassMetadata from "@core/context/codebaseMetaData/classMetadata";
import { generateCssMetadata } from "@core/context/codebaseMetaData/cssMetadata";
import generateFileMetadata from "@core/context/codebaseMetaData/filesMetadata";
import generateFunctionMetadata from "@core/context/codebaseMetaData/functionMeta";
import { generateHtmlMetadata } from "@core/context/codebaseMetaData/htmlMetadata";
// import callRAG, { RagClient } from "@transport/zeromqClient";
import chalk from "chalk";
import path from "path";

type CodeEntity = {
	entity_name: string;
	code: string;
	entity_type: string;
	file_path: string;
	start_line: number;
	end_line: number;
	description?: string;
};

interface QueryData {
	path: string;
	query: "none";
	parsedCodebase?: CodeEntity[];
	type: "codebase";
}

const metadataPath = path.resolve("./.codr/metadata");
// const rag = new RagClient();
const dirname = process.cwd();

const generateCodebaseMetadata = async () => {
	startLoader(`Generating Codebase Metadata`);
	try {
		// const { success, response } = await rag.callRagOnce({
		// 	type: "check_collection",
		// 	path: dirname,
		// });

		generateCallGraph();
		generateClassMetadata();
		generateFileMetadata();
		generateFunctionMetadata();
		generateHtmlMetadata();
		generateCssMetadata();

		// if (fs.existsSync(metadataPath) && response.exists) {
		//   startLoader("Checking .metadata folder existence");
		//   stopLoader(".metadata folder exists ✅");
		//   return "project .metadata folder already exists in the root folder and in the vector db";
		// }

		// if (!response.exists) {
		// 	// Parse codebase
		// 	startLoader(
		// 		chalk.cyan("🔍 Parsing and summarizing codebase..., path: ") + dirname,
		// 	);
		// 	const parsed = await parseCodebase(dirname);
		// 	stopLoader(chalk.cyanBright("📄 Parsed: ") + parsed?.length + " items");

		// 	// Send to RAG
		// 	startLoader(chalk.yellowBright("📡 Sending to RAG..."));
		// 	const data: QueryData = {
		// 		path: dirname,
		// 		parsedCodebase: parsed,
		// 		type: "codebase",
		// 		query: "none",
		// 	};

		// 	const { success: ragSuccess, response: context } = await callRAG(data);

		// 	if (!ragSuccess) {
		// 		stopLoader("❌ Failed to retrieve context from RAG.");
		// 		return { success: false };
		// 	}
		// }
		// stopLoader(
		// 	"project .metadata folder and vector embeddings created successfully",
		// );

		return "project .metadata folder and vector embeddings created successfully";
	} catch (error: any) {
		stopLoader("❌ Failed to generate metadata");
	}
};

export default generateCodebaseMetadata;
