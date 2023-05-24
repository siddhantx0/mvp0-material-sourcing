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
import fs from "fs";
import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
	console.log("parsing request...");
	// res.send(req.body);
	const configuration = new Configuration({
		apiKey: process.env.keke,
	});
	const openai = new OpenAIApi(configuration);
	const history = [];

	const state = `generate an email with this info below. start by saying "Dear Vendor,". please be concise but descriptive.`; // that take in specific information in the format of a JSON object and generate a concise, professional email that conveys all of the information present in the required message. the context of these messages is in the manufacturing niche. you are trying to ask for the best price and earliest date and method of shipment from vendors. generate this email how a manufacturing company sourcing supplies would generate an email. the message should start with "Dear Vendor,"`;
	const messages = [];
	const wowowgamingthesystem = "";
	//! FIX...
	const input = `${state}\n\n${JSON.stringify(req.body)}`;
	//!

	messages.push({ role: "user", content: input });

	try {
		console.log("1");
		console.log(input, req.body);
		const completion = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: input }],
		});
		console.log("2");
		const completionText = completion.data.choices[0].message.content;
		console.log(completionText);
		history.push([input, completionText]);

		//* EMAIL TEMPLATE
		//* ADD LOOKUP FUNCTiONALITY...
		let message = "";
		const vendors = JSON.parse(fs.readFileSync("./vendors.json"));
		for (let i = 0; i < vendors["vendor-names"].length; i++) {
			const text = completionText.replace("Vendor", vendors["vendor-names"][i]);
			// console.log(vendors["vendor-names"][i]);
			message += text + "\n";

			//! ******************************************************
			//! ******************************************************
			//! ******************************************************
			var transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					//! ADD INTO .env VARIABLES AND LOAD HERE...
					user: "burner.test.nova@gmail.com",
					pass: "burner123",
				},
			});

			var mailOptions = {
				from: "burner.test.nova@gmail.com",
				to: vendors["vendor-emails"][i],
				subject: "Order Request | Jesse @BetterCNC",
				text: text,
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log("Email sent: " + info.response);
				}
			});
			//! ******************************************************
			//! ******************************************************
			//! ******************************************************
		}
		res.send(`<p>${message}</p>`);
	} catch (error) {
		if (error.response) {
			console.log(error.response.status);
			console.log(error.response.data);
		} else {
			console.log(error.message);
		}
		res.end();
	}
});

app.listen(port, () => {
	console.log(`listening on port:${port}`);
});

//! use links to fetch content...
/* @deprecated
fetch("http://127.0.0.1:5500/input.json")
	.then((response) => response.json())
	.then((json) => console.log(json));
*/

/* @deprecated
app.get("/testget", (req, res) => {
	res.send("<h3>started nova>...<h3>");

	console.log(req.body);
});
*/
