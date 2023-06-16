const express = require('express');
const http = require('http');
const querystring = require('querystring');
const iconv = require('iconv-lite');

const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Endpoint to handle the API request
app.get('/api', (req, res) => {
  const barcode = req.query.ean;
  const queryParams = querystring.stringify({
    ean: barcode,
    cmd: 'query',
    queryid: '400000000',
  });

  // Options for the target API request
  const options = {
    hostname: 'opengtindb.org',
    path: `/?${queryParams}`,
    method: 'GET',
  };

  // Make the request to the target API
  const request = http.request(options, (response) => {
    const chunks = [];

    response.on('data', (chunk) => {
      chunks.push(chunk);
    });

    response.on('end', () => {
      const data = Buffer.concat(chunks);
      const decodedData = iconv.decode(data, 'ISO-8859-1'); // Specify the correct encoding used by the response
      res.send(decodedData);
    });
  });

  request.on('error', (error) => {
    console.error(error);
    res.status(500).send('An error occurred');
  });

  request.end();
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
