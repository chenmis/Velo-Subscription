const https = require('https');
const fs = require('fs');
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 443;

const CLIENT_ID = '025748bf-b32b-4358-8601-fcc8cf9bea92';
const CLIENT_SECRET = 'e3498d8e-0a0a-45e9-876d-0524c6e9eaf2';
const DOMAIN = 'https://18.202.33.143';
const REDIRECT_URL = `${DOMAIN}/callback`;

app.get('/authorize', (req, res) => {
  const TOKEN = req.query.token;
  console.log(TOKEN)
  if (!TOKEN) {
    return res.status(400).send('Token is required');
  }

  const WIX_AUTH_URL = `https://www.wix.com/installer/install?token=${TOKEN}&appId=${CLIENT_ID}&redirectUrl=${REDIRECT_URL}&state=1234`;
  
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
    console.log(`Access token: ${access_token}`);
    console.log(`Refresh token: ${refresh_token}`);
    // Save the access token and refresh token in your database
    // ...

    res.send('OAuth succeeded');
  } catch (error) {
    console.error('Error in /callback:', error.message);
    res.status(500).send('OAuth failed');
  }
});

try {
  const options = {
    key: fs.readFileSync('privkey.pem'),
    cert: fs.readFileSync('fullchain.pem'),
  };
  
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Server running at ${DOMAIN}/`);
  });
} catch (error) {
  console.error('Failed to start server:', error.message);
}
