const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 7850;

// Middleware
app.use(bodyParser.json());

// Define your conversion logic here
const convertedData = [];
for (const conversion of toConvert) {
  const { amount, from, to } = conversion;
  const exchangeValues = [];

  for (const targetCurrency of to) {
    try {
      const response = await axios.get(
        `https://cdn.isdelivr.net/gh/fewazahmed0/currency-api@1/latest/currencies/${from}/${targetCurrency}.json`
      );
      const value = response.data[targetCurrency];
      exchangeValues.push({ to: targetCurrency, value });
    } catch (error) {
      console.error(`Error converting ${from} to ${targetCurrency}: ${error.message}`);
      exchangeValues.push({ to: targetCurrency, value: null });
    }
  }

  convertedData.push({ amount, from, exchangeValues });
}
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const exchangeRates = require("exchange-rates-api"); // Import the currency conversion library

// Define the conversion route
app.post("/convert", async (req, res) => {
  try {
    const { amount, from, to } = req.body;

    // Fetch exchange rates for the specified base currency
    const rates = await exchangeRates().base(from);

    // Calculate the conversions
    const conversions = to.map((targetCurrency) => ({
      from,
      to: targetCurrency,
      amount: amount * rates.get(targetCurrency),
    }));

    res.status(200).json({ conversions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});