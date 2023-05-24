/*
* REST API that takes in specific parameters, queries a regional database and sends custom messages through the JS-Email client to various suppliers
* REST API Parameters: 
    ! 1. Materials Required (ie. 316SS Cond.)
    ! 2. Date by which needed? (vendor bidding)
    ! 3. Material Requirements (ie. No plasma cut etc.)
        ! a. Dimensions?
        ! b. Quantity (can setup various of the same material or similar of different materials)
        ! b. Specifications (ie. AMS 5648 >> Heat & Corrosion Resistant Metal Bars)
* PIPELINE:
! 1. get a JSON object conforming to the REST API Parameters
! 2. locate vendors that would apply best to these requirements
! 3. generate email templates based on the JSON object + located vendor information
! 4. send generated emails to vendors (waits for an output)
* UPON OUTPUT:
! 1. read information in... (read in price, avaialability, date met etc.)
    a. parse through OpenAI-GPT (custom prompts etc.)...
*/
import { Configuration, OpenAIApi } from "openai";
import fetch from "node-fetch";
import express from "express";

const app = express();
const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
app.get("/", async (req, res) => {
	const configuration = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	});
	const openai = new OpenAIApi(configuration);
	const history = [];
	const state = `you are an emailing client that takes in specific information and generate a concise, professional email that conveys all of the information present in the required message. the context of these messages is in the manufacturing niche`;
	const messages = [];

	const user_input = `${state}\n\n${readlineSync.question("Your input: ")}`;
	for (const [input_text, completion_text] of history) {
		messages.push({ role: "user", content: input_text });
		messages.push({ role: "assistant", content: completion_text });
	}

	messages.push({ role: "user", content: user_input });

	try {
		const completion = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: messages,
		});
		const completion_text = completion.data.choices[0].message.content;
		console.log(completion_text);
		history.push([user_input, completion_text]);
	} catch (error) {
		if (error.response) {
			console.log(error.response.status);
			console.log(error.response.data);
		} else {
			console.log(error.message);
		}
	}
});

//! use links to fetch content...
/* ! @deprecated
fetch("http://127.0.0.1:5500/input.json")
	.then((response) => response.json())
	.then((json) => console.log(json));
*/
