import { Configuration, OpenAIApi } from "openai";
export class OpenAI {
	constructor(apiKey) {
		// Create the Configuration and OpenAIApi instances
		this.openai = new OpenAIApi(new Configuration({ apiKey }));
	}
	// Asynchronous function to generate text from the OpenAI API
	async generateText(prompt, model, max_tokens, temperature = 0.85) {
		try {
			// Send a request to the OpenAI API to generate text
			const response = await this.openai.createCompletion({
				model,
				prompt,
				max_tokens,
				n: 1,
				temperature,
			});
			console.log(`request cost: ${response.data.usage.total_tokens} tokens`);
			// Return the text of the response
			return response.data.choices[0].text;
		} catch (error) {
			throw error;
		}
	}
}

const openAI = new OpenAI(process.env.OPENAI_KEY);
const topic = "NodeJs";
const model = "text-davinci-003";
// Function to generate the prompt for the OpenAI API
// In the future, it will be moved to a helper class in the next code review
const generatePrompt = (topic) => {
	return `Write an blog post about "${topic}", it should in HTML format, include 5 unique points, using informative tone.`;
};
// Use the generateText method to generate text from the OpenAI API and passing the generated prompt, the model and max token value
await openAI
	.generateText(generatePrompt(topic), model, 800)
	.then((text) => {
		// Logging the generated text to the console
		// In the future, this will be replaced to upload the returned blog text to a WordPress site using the WordPress REST API
		console.log(text);
	})
	.catch((error) => {
		console.error(error);
	});
