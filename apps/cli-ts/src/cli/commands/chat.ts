// import { startChatUI2 } from "@cli/ui/chatUI2";
// import { ChatSessionManager } from "@transport/chatSessionManager";
// // import { RagClient } from "@transport/zeromqClient";

// interface CallRAG {
// 	path: string;
// 	query: string;
// 	type: "doc" | "webpage" | "codebase";
// }

// export const chatWithContext = async (data: CallRAG) => {
// 	const ragClient = new RagClient();
// 	const chatManager = new ChatSessionManager(ragClient);

// 	const { session_id, query } = await chatManager.startSession(data);

// 	// console.log(chalk.bgCyanBright.black("Initial Response: "),session_id, query, data.type);

// 	if (!query) throw new Error("Query is required to start chat");

// 	const decision = await chatManager.sendMessage(query);

// 	if (!decision) throw new Error("No Decision Available");

// 	await startChatUI2(session_id, query, decision, chatManager);
// };
