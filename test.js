const fetch = require('node-fetch');
const FormData = require('form-data');

const url = 'https://shopify-staged-uploads.storage.googleapis.com/';

const formData = new FormData();
formData.append('key', 'tmp/21759409/bulk/2d278b12-d153-4667-a05c-a5d8181623de/bulk_op_vars');
formData.append('x-goog-credential', 'merchant-assets@shopify-tiers.iam.gserviceaccount.com/20220830/auto/storage/goog4_request');
formData.append('x-goog-algorithm', 'GOOG4-RSA-SHA256');
formData.append('x-goog-date', '20220830T025127Z');
formData.append('acl', 'private');
formData.append('Content-Type', 'text/jsonl');
formData.append('success_action_status', '201');
formData.append('file', '/Users/username/Documents/bulk_mutation_tests/products_long.jsonl');

fetch(url, {
  method: 'POST',
  body: formData
})
.then(response => {
  // handle response
})
.catch(error => {
  // handle error
});
