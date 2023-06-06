const fetch = require('node-fetch');
class WebhookController {
    async GetWebhookData (req, res) {
        try {

const shopifyUrl = 'https://apitestforme.myshopify.com/admin/api/2023-01/';
const endpoint = 'webhooks.json';
const apiKey = process.env.accessToken;

const payload = {
  webhook: {
    topic: 'bulk_operations/finish',
    address: 'https://fa7a-188-163-37-38.eu.ngrok.io/api/result',
    format: 'json'
  }
};

const headers = {
  'Content-Type': 'application/json',
  'X-Shopify-Access-Token': apiKey
};

fetch(shopifyUrl + endpoint, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(payload)
})
.then(response => {
  if (response.status === 201) {
    console.log('Webhook created successfully');
    res.status(200).json('Webhook created successfully');
  } else {
    console.log('Error creating webhook:', response.status, response.statusText);
    res.status(422).json('Error creating webhook:', response.status, response.statusText);
  }
})
.catch(error => {
  console.log('Error creating webhook:', error);
});

        }
        catch(e) {
            console.log(e);
        }
    }
}

module.exports = new WebhookController;