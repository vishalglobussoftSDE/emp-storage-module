import express from "express";
import { configDotenv } from "dotenv";
import storageRoutes from "./routes/storage.route.js";

configDotenv();

const app = express();
const PORT = process.env.PORT || 8081;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("Server is running 🚀");
});


app.use("/storage", storageRoutes);


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
