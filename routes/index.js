var express = require("express");
var router = express.Router();
const axios = require("axios");
const { MongoClient } = require("mongodb");
const cron = require("node-cron");

const uri = "mongodb+srv://shubhankar2003:KHaEoz2P0NrIw4y7@cluster0.5zib7ue.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// Coingecko API endpoint for getting the list of cryptocurrencies
const apiURL = "https://api.coingecko.com/api/v3/coins/list";
const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";


/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});


// Task 1 Store crypto currencies in MongoDB

const fetchCrypto = async () => {
  try {
    const response = await axios.get(apiURL);
    const data = response.data;

    // Connect to MongoDB
    await client.connect();

    // Get the database and collection
    const database = client.db("cryptocurrency_database");
    const collection = database.collection("cryptocurrencies");

    // Clear existing data in the collection
    await collection.deleteMany({});

    // Insert new data into the collection
    await collection.insertMany(data);

    console.log("Cryptocurrency data updated successfully.");
  } catch (error) {
    console.error(`Error updating cryptocurrency data: ${error.message}`);
  } finally {
    // Close MongoDB connection
    await client.close();
  }
};

// Initial data fetching
fetchCrypto();

// Schedule background job to run every 1 hour
cron.schedule("0 * * * *", fetchCrypto); // Run every hour at the beginning of the hour



