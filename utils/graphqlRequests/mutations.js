function createProduct(createProductData) {
  const createMutation = `{"input": {"title":"${createProductData.title}", "published": true, "handle":"${createProductData.handle}", "descriptionHtml":"${createProductData.description}", "vendor":"${createProductData.vendor}","tags":"${createProductData.tags}", "options":[${createProductData.options}], "variants":${JSON.stringify(createProductData.variants)}}}`;
  return createMutation;
};

function updateProduct(updateProductData) {
  const updateMutation = `{"input": {"id":"${updateProductData.id}", "status": "ACTIVE", "published": true, "handle":"${updateProductData.handle}", "title": "${updateProductData.title}", "descriptionHtml":"${updateProductData.description}", "vendor":"${updateProductData.vendor}", "tags":"${updateProductData.tags}", "options":[${updateProductData.options}], "variants":${JSON.stringify(updateProductData.variants)}}}`;
  console.log(updateMutation);
  return updateMutation;
}

function updateMetafields(updateMetafieldData) {
  const updateMetafieldMutation = `{"input":{"id":"${updateMetafieldData.id}", "metafields":${JSON.stringify(updateMetafieldData.metafields).replaceAll(/\\/g, "").replaceAll('","',',').replaceAll('"{','{').replaceAll('}"','}')}}}`;
  return updateMetafieldMutation;
}

function stagedUploads() {
  const uploadsMutation = `mutation {
        stagedUploadsCreate(input:{
          resource: BULK_MUTATION_VARIABLES,
          filename: "bulk_op_vars",
          mimeType: "text/jsonl",
          httpMethod: POST
        }){
          userErrors{
            field,
            message
          },
          stagedTargets{
            url,
            resourceUrl,
            parameters {
              name,
              value
            }
          }
        }
      }
      `;
  return uploadsMutation;
}

function createProducts(uploadUrl) {
  const createProductsMutation = `mutation {
      bulkOperationRunMutation(
        mutation: "mutation call($input: ProductInput!) { productCreate(input: $input) { product {id title variants(first: 10) {edges {node {id title inventoryQuantity }}}} userErrors { message field } } }",
        stagedUploadPath: "${uploadUrl}") {
        bulkOperation {
          id
          url
          status
        }
        userErrors {
          message
          field
        }
      }
    }
    `;
  return createProductsMutation.replace(/"(\w+)":/g, `$1:`);
};

function updateProducts(uploadUrl) {
  const updateProductsMutation = `mutation {
      bulkOperationRunMutation(
        mutation: "mutation call($input: ProductInput!) { productUpdate(input: $input) { product {id title variants(first: 10) {edges {node {id title inventoryQuantity }}}} userErrors { message field } } }",
        stagedUploadPath: "${uploadUrl}") {
        bulkOperation {
          id
          url
          status
        }
        userErrors {
          message
          field
        }
      }
    }
    `;
  return updateProductsMutation.replace(/"(\w+)":/g, `$1:`);
};

function updateVariants(uploadUrl) {
  const updateVariantsMutation = `mutation {
      bulkOperationRunMutation(
        mutation: "mutation call($input: ProductVariantInput!) { productVariantUpdate(input: $input) { product {id title variants(first: 10) {edges {node {id title inventoryQuantity }}}} userErrors { message field } } }",
        stagedUploadPath: "${uploadUrl}") {
        bulkOperation {
          id
          url
          status
        }
        userErrors {
          message
          field
        }
      }
    }
    `;
  return updateVariantsMutation.replace(/"(\w+)":/g, `$1:`);
};

function updateProductStatus(id) {
  const updateStatus = `mutation {
    productUpdate(input: {id:${id}, status: DRAFT}) {
      product {
        id
      }
    }
  }`;
  return updateStatus;
}



module.exports = { createProduct, updateProduct, stagedUploads, createProducts, updateProducts, updateVariants, updateProductStatus, updateMetafields };