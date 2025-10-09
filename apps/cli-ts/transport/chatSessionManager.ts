// Deprecated: RAG integration (temporarily unsupported due to backend extraction & restructuring)
// This file heavily depends on the RAG server (ZeroMQ client).
// Keep it for reference until the new RAG APIs are stable and integrated again.

// RAG-related imports
// import { getCompletionFromOpenRouter } from "../utils/AI/ragAnswerAI";
// import { formatContextForLLM } from "../utils/formatContext";
// import type { RagClient } from "./zeromqClient";

import { randomUUID } from "crypto";
import { getSummarizeChat } from "../utils/AI/chatSummarizer";

export class ChatSessionManager {
	// RAG dependency (ZeroMQ client)
	// private ragClient: RagClient;

	private sessionId: string;
	private previousSummary = "";
	type: string | undefined;

	// constructor(ragClient: RagClient) {
	// 	this.ragClient = ragClient;
	// 	this.sessionId = randomUUID();
	// }

	constructor() {
		this.sessionId = randomUUID();
	}

	// Deprecated: Requires active RAG server
	// async startSession({
	// 	path,
	// 	query,
	// 	type,
	// }: {
	// 	path: string;
	// 	query: string;
	// 	type: string;
	// }) {
	// 	// Initializing chat session with RAG server
	// 	const payload = {
	// 		chat_type: "init_chat",
	// 		path,
	// 		query,
	// 		type,
	// 		session_id: this.sessionId,
	// 	};

	// 	this.type = type;

	// 	const { success, response } = await this.ragClient.callRagOnce(payload);

	// 	// Direct dependency on RAG response
	// 	console.log(chalk.greenBright(response.msg));

	// 	return { session_id: this.sessionId, query };
	// }

	// Deprecated: Requires RAG for context retrieval
	// async sendMessage(message: string) {
	// 	// Sending message to RAG server
	// 	const payload = {
	// 		chat_type: "chat_message",
	// 		message,
	// 		session_id: this.sessionId,
	// 		type: this.type,
	// 	};

	// 	const { success, response, error } =
	// 		await this.ragClient.callRagOnce(payload);

	// 	// Handling failure when RAG fails
	// 	if (!success || !response?.success) {
	// 		console.error("❌ RAG call failed:", response?.error || error);
	// 		throw new Error("RAG failed to return context");
	// 	}

	// 	// Formatting retrieved RAG context for LLM
	// 	const formattedContext = formatContextForLLM(response.data, response.type);

	// 	// Passing RAG context to OpenRouter completion
	// 	const { decision } = await getCompletionFromOpenRouter({
	// 		query: message,
	// 		context: formattedContext,
	// 		summary: this.previousSummary,
	// 	});

	// 	const currentChat = {
	// 		user_query: message,
	// 		assistant_answer: decision,
	// 	};

	// 	// Optional background summarization (not blocking main flow)
	// 	// this.updateSummary(currentChat);

	// 	return decision;
	// }

	//  Summarizer
	private async updateSummary(currentChat: any) {
		const { success, decision: newSummary } = await getSummarizeChat({
			chat: currentChat,
			prevSummary: this.previousSummary,
		});

		if (success && newSummary) {
			this.previousSummary = newSummary;
			console.log("📝 Chat Summary Updated.");
		}
	}
}
