var express = require("express");
var router = express.Router();
const axios = require("axios");
const { MongoClient } = require("mongodb");
const cron = require("node-cron");

const uri = "YOU_MONGODB_CONNECTION_STRING";
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


// Task 2 Represent one currency in terms of another using the coingecko API 

async function getCurrencyPrice(currency, timestamp) {
  const url = `${COINGECKO_API_BASE}/coins/${currency}/market_chart/range`;
  const params = {
    vs_currency: "usd",
    from: timestamp - 86400, // 1 day before the specified date
    to: timestamp,
  };

  try {
    const response = await axios.get(url, { params });
    const prices = response.data.prices || [];
    if (prices.length > 0) {
      return prices[prices.length - 1][1];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching data from CoinGecko:", error.message);
    throw error;
  }
}

// endpooint for price fetching 

router.post("/get_price", async (req, res) => {
  const { fromCurrency, toCurrency, date } = req.body;

  
  // Convert date string to timestamp
  const timestamp = new Date(date).getTime() / 1000;
  try {
    const fromCurrencyPrice = await getCurrencyPrice(fromCurrency, timestamp);
    const toCurrencyPrice = await getCurrencyPrice(toCurrency, timestamp);

    if (fromCurrencyPrice !== null && toCurrencyPrice !== null) {
      
      

      const price = fromCurrencyPrice / toCurrencyPrice;
      res.json({ price });
    } else {
      res.status(500).json({ error: "Unable to retrieve price" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});



const apiUrl = 'http://localhost:3000/get_price';  

const requestData = {
    fromCurrency: 'bitcoin',
    toCurrency: 'ethereum',
    date: '2023-01-12',
};

// POST req made by axios

axios.post(apiUrl, requestData)
    .then(response => {
        console.log('Response:', response.data);
    })
    .catch(error => {
        console.error('Error:', error.response ? error.response.data : error.message);
    });


// Task 3 Companies holding particular 

router.get('/get_company/:id', async (req, res) => {
  const currencyToSearch = req.params.id || 'bitcoin'; // Default to bitcoin if not provided
  const companiesList = await getCompaniesHoldingCrypto(currencyToSearch);
    
  if (companiesList) {
    res.json({ companies: companiesList });
  } else {
     res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function getCompaniesHoldingCrypto(currency) {
  const apiUrl = `https://api.coingecko.com/api/v3/companies/public_treasury/${currency}`;
  const params = {
    currency: currency.toLowerCase(),
  };

  try {
    const response = await axios.get(apiUrl, { params });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

const serverUrl = 'http://localhost:3000'; 

const companyId = 'bitcoin'; // Can be replaced with actual company ID

// GET req from the Axios to the end point
axios.get(`${serverUrl}/get_company/${companyId}`)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
  });
module.exports = router;
