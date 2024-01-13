import express from "express";
import { userRouter } from "./routes/user.js";
import { dumpRandomUsersToDatabase } from "./seeder/user-seeder.js";
import dotenv from "dotenv";
import { sequelize } from "./models/config.js";

// Load environment variables from .env file
dotenv.config();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

// uncommit to run seeder
//dumpRandomUsersToDatabase(100)


// Sync the model with the database
sequelize
  .sync()
  .then(() => {
    console.log("Database and tables are in sync");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

const app = express();

// Middleware to parse JSON in the request body
app.use(express.json());

// Middleware to parse URL-encoded data in the request body
app.use(express.urlencoded({ extended: true }));
app.use("/api/",userRouter);


app.listen(PORT, HOST, () => {
    console.log(`Connected to the DataBase. Server is running at http://${HOST}:${PORT}`);
  });