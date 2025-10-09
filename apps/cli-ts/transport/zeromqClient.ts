// Deprecated: RAG integration (ZeroMQ client)
// This section is temporarily unsupported due to backend restructuring & RAG extraction.
// Kept here for reference until new APIs / backend design are finalized.

// import zmq from "zeromq";

// interface CallRAG {
// 	path?: string;
// 	query?: string;
// 	type?: string;
// 	session_id?: string;
// }

// const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// const callRAG = async (data: CallRAG) => {
// 	const socket = new zmq.Request();

// 	try {
// 		await socket.connect("tcp://127.0.0.1:5500");

// 		await delay(100);
// 		// data.type = 'check_collection'
// 		const start = Date.now();
// 		await socket.send(JSON.stringify(data));

// 		const [result] = await socket.receive();

// 		if (!result) {
// 			throw new Error("No response received from ZeroMQ server.");
// 		}

// 		const response = JSON.parse(result.toString());

// 		return { success: true, response };
// 	} catch (error) {
// 		return { success: false, error };
// 	} finally {
// 		await delay(50);
// 		await socket.close();
// 	}
// };

// export default callRAG;

// export class RagClient {
// 	private endpoint: string;

// 	constructor(endpoint = "tcp://127.0.0.1:5500") {
// 		this.endpoint = endpoint;
// 	}

// 	private async delay(ms: number) {
// 		return new Promise((resolve) => setTimeout(resolve, ms));
// 	}

// 	async callRagOnce(payload: any) {
// 		const socket = new zmq.Request();

// 		try {
// 			await socket.connect(this.endpoint);
// 			await this.delay(100); // Small delay to ensure socket is ready

// 			await socket.send(JSON.stringify(payload));

// 			const [result] = await socket.receive();
// 			if (!result) {
// 				throw new Error("No response received from ZeroMQ server.");
// 			}

// 			const response = JSON.parse(result.toString());
// 			return { success: true, response };
// 		} catch (error) {
// 			return { success: false, error };
// 		} finally {
// 			await this.delay(50); // Ensure response is fully handled
// 			await socket.close();
// 		}
// 	}
// }

// Deprecated: Experimental Chat Summary
// Was used for maintaining rolling chat context via RAG summarization.
// Commented out until new summarization logic is implemented.
// void (async () => {
//     const { success, decision: newSummary } = await getSummarizeChat({
//         chat: currentChat,
//         prevSummary: previousSummary
//     });

//     if (success && newSummary) {
//         previousSummary = newSummary;
//         console.log("📝 Chat Summary Updated.");
//     }
// })();
