import axios from "axios";

export async function handler(event, context) {
  try {
    const targetUrl = event["headers"]["target-url"];
    const apiKey = process.env.API_KEY;
    const url = targetUrl + "&key=" + apiKey;
    const response = await axios.get(url);
    return {
      statusCode: 200,
      body: response.data,
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
}
