// import { RagClient } from "@transport/zeromqClient";
// import { spawn } from "child_process";
// import { join } from "path";

// const projectRoot = join(__dirname, "..", "..", "..", "..", "..", "..");

// function startRagServerInBackground() {
// 	const subprocess = spawn("uv run -m apps.rag_py.transport.zeromq.server", {
// 		shell: true,
// 		detached: true,
// 		stdio: "ignore",
// 		windowsHide: true,
// 		cwd: projectRoot,
// 	});

// 	subprocess.unref();
// 	console.log("🚀 Restarted RAG server in background...");
// }

// function timeoutPromise(ms: number) {
// 	return new Promise((_, reject) =>
// 		setTimeout(
// 			() => reject(new Error("Timeout: RAG server not responding.")),
// 			ms,
// 		),
// 	);
// }

// interface RagResponse {
// 	success: boolean;
// 	response?: { success: boolean; msg?: string };
// 	error?: any;
// }

// async function checkRagServer(timeout = 1000): Promise<RagResponse> {
// 	const ragClient = new RagClient();
// 	const result: RagResponse = await Promise.race([
// 		ragClient.callRagOnce({ type: "ping" }),
// 		timeoutPromise(timeout) as Promise<never>,
// 	]);

// 	if (!result || !result.success || !result.response?.success) {
// 		throw new Error("RAG server responded, but not healthy.");
// 	}

// 	return result;
// }

// export async function ensureRagServerRunning(): Promise<boolean> {
// 	try {
// 		const res = await checkRagServer(5000);
// 		console.log("✅ RAG server is alive:", res.response?.msg || "pong");
// 		return true;
// 	} catch (err: any) {
// 		console.error("❌", err.message);
// 		startRagServerInBackground();

// 		// console.log("⏳ Waiting for RAG server to boot...");

// 		// 🔁 Retry loop: try every 1.5s up to 5 times (7.5 seconds max)
// 		const maxRetries = 20;
// 		for (let i = 0; i < maxRetries; i++) {
// 			await new Promise((r) => setTimeout(r, 5000));
// 			try {
// 				const res = await checkRagServer(5000);
// 				console.log(
// 					"✅ RAG server is now running:",
// 					res.response?.msg || "pong",
// 				);
// 				return true;
// 			} catch (e: any) {
// 				console.log(`⏳ Retry ${i + 1}/${maxRetries} failed: ${e.message}`);
// 			}
// 		}

// 		console.error("❌ Still failed after multiple retries.");
// 		return false;
// 	}
// }
