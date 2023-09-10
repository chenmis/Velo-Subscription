const express = require('express');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const app = express();
const PORT = 3000;

const CLIENT_ID = 'CLIENT_ID';
const CLIENT_SECRET = 'CLIENT_SECRET';
const DOMAIN = 'https://18.202.33.143';
const REDIRECT_URI = `${DOMAIN}:3000/callback`;

app.get('/authorize', (req, res) => {
  const TOKEN = req.query.token;
  const WIX_AUTH_URL = `https://www.wix.com/installer/install?token=${TOKEN}client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=1234`;
  
  res.redirect(WIX_AUTH_URL);
});

app.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    if (state !== '1234') {
      throw new Error('Invalid state');
    }

    const response = await axios.post('https://www.wixapis.com/oauth/access', {
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    });

    const { access_token, refresh_token } = response.data;
    console.log(access_token)
    console.log(refresh_token)
    // Save the access token and refresh token in your database
    // ...

    res.send('OAuth succeeded');
  } catch (error) {
    console.error(error);
    res.status(500).send('OAuth failed');
  }
});

// Create an HTTPS server instead of an HTTP server
const httpsServer = https.createServer(
  {
    key: fs.readFileSync('/home/ubuntu/privkey.pem'),
    cert: fs.readFileSync('/home/ubuntu/fullchain.pem'),
  },
  app
);

app.listen(PORT, () => {
  console.log(`Server running at ${DOMAIN}:${PORT}/`);
});
