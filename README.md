# Crypto Tasks Information

This project involves implementing three practical functionalities related to cryptocurrency information using Coingecko's API, MongoDB, and Node.js with Express.

## Functionalities Overview

### Functionality 1: Update Cryptocurrency List

- Periodically fetches the list of all cryptocurrencies from Coingecko’s API.
- Stores the names and IDs of cryptocurrencies in a MongoDB database.
- Implements a background job to update the list every 1 hour.

### Functionality 2: Retrieve Historical Currency Price

- Provides an API endpoint `/get_price` that calculates the historical price of one cryptocurrency in terms of another on a specific date.
- Requires Coingecko IDs of two cryptocurrencies, and a date.
- Example Request:
    ```json
    {
        "fromCurrency": "bitcoin",
        "toCurrency": "ethereum",
        "date": "2023-01-12"
    }
    ```
- Utilizes Coingecko's market chart data to fetch historical prices.

### Functionality 3: Explore Companies Holding Cryptocurrency

- Integrates Coingecko’s `/companies/public_treasury` API.
- Offers an API endpoint `/get_company/:id` to retrieve a list of companies holding a specific cryptocurrency.
- Example Request:
    ```json
    {
        "id": "bitcoin"
    }
    ```
- Provides information on companies actively holding the specified cryptocurrency.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cryptotasks.git
   cd cryptotasks
   ```
2. Install dependencies:

  ```bash
  npm install
  ```
  ```bash
  npm install axios mongodb node-cron body-parser 
  ```

3. Configure MongoDB connection:

Open routes/index.js and update the uri variable with your MongoDB connection string.

4. Run the application:

    ```bash
    Copy code
    npm start
    ```
    
## Usage

    1. Visit http://localhost:3000/ in your browser to view the home page.
    
    2. Functionality 1: Update Cryptocurrency List
    - Cryptocurrency data is automatically updated in the MongoDB database every 1 hour.
    
    3. Functionality 2: Retrieve Historical Currency Price
    - Use the API endpoint /get_price for fetching the historical price of one cryptocurrency in another.
    
    4. Functionality 3: Explore Companies Holding Cryptocurrency
    - Use the API endpoint /get_company/:id to get information on companies holding a particular cryptocurrency.
    
## Additional Notes
- Ensure that MongoDB is running and accessible.
- The background job for Functionality 1 is scheduled using node-cron.
- Modify the Coingecko API base URL and endpoints if needed.
- Feel free to customize the CSS for a better visual experience.


## Author
Shubhankar Karajkhede
GitHub: https://github.com/shubhankar2602


