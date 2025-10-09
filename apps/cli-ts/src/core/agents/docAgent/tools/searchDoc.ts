// import { RagClient } from "@transport/zeromqClient";
// import { formatContextForLLM } from "@utils/formatContext";
// import chalk from "chalk";

// interface QueryData {
// 	path: string;
// 	query: string;
// 	type?: "doc";
// }

// const rag = new RagClient();

// export async function searchDoc(data: QueryData) {
// 	console.log(chalk.yellowBright("Search Doc Called\n"));

// 	try {
// 		data.type = "doc";
// 		const { success, response, error } = await rag.callRagOnce(data);

// 		// console.log(response.results, success);

// 		if (!success || !response?.results) {
// 			console.error("❌ RAG call failed:", response?.error || error);
// 			throw new Error("RAG failed to return context");
// 		}

// 		const formattedContext = formatContextForLLM(response.results, "doc");

// 		// console.log(chalk.green("Rag response: \n"), formattedContext);

// 		return formattedContext;
// 	} catch (error) {}
// }
