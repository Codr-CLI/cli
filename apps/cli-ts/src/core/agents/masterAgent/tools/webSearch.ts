/* temporarily unsupported due to rag dependency
import { startLoader, stopLoader } from "@cli/ui/Loader/loaderManager";
import { llm } from "@llm/llm";
import { RagClient } from "@transport/zeromqClient";
import { ensureRagServerRunning } from "@utils/ensureRagServer";

export async function webSearch({ query }: { query: string }) {
	startLoader(`Searching the web for: ${query}`);

	const res = await fetch(
		`https://google-search-api.aroy262692.workers.dev/search?q=${encodeURIComponent(query)}&num=2`,
	);

	const data = await res.json();

	const urls: any = [];

	// @ts-ignore
	data.items.forEach((item: any) => {
		urls.push(item.link);
	});

	const ragData = {
		urls,
		query,
		type: "agent",
	};

	const ok = await ensureRagServerRunning();
	if (!ok) {
		return process.exit(1);
	}

	const rag = new RagClient();

	const { success, response, error } = await rag.callRagOnce(ragData);

	// const formattedContext = formatContextForLLM(response.results, "doc");

	// console.log(chalk.yellow("Returned web response: \n"), response + "\n")

	// return `Here is the web search result, now provide the user with proper information based on this result:\n${response}`

	const prompt = `
You're helping debug the following issue: "${query}"

Here are some results from a web search:
${response}

Based on this info, explain the likely cause and recommend a fix, if available.
Return your answer in markdown, and be direct.

`;

	const { content: llmresponse } = await llm.invoke(prompt);

	stopLoader(`✓ Search Complete for: ${query}`);

	// console.log(chalk.greenBright("\nLLM Response: \n"),llmresponse);

	return llmresponse;
}

*/
