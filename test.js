import { google } from "googleapis";
import readline from "readline";

// 🔴 Yaha apna client id & secret daal
const CLIENT_ID = "YOUR_CLIENT_ID";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";
const REDIRECT_URI = "http://localhost";  // IMPORTANT

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const scopes = ["https://www.googleapis.com/auth/drive"];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: scopes,
});

console.log("\nOpen this URL in your browser:\n");
console.log(authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nPaste the code here: ", async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("\n✅ TOKENS GENERATED:\n");
    console.log(tokens);

    console.log("\n🔥 COPY THIS REFRESH TOKEN:\n");
    console.log(tokens.refresh_token);

  } catch (error) {
    console.error("Error:", error.message);
  }

  rl.close();
});