function createProduct(createProductData) {
  const createMutation = `{"input": {"title":"${createProductData.title}", "handle":"${createProductData.handle}", "descriptionHtml":"${createProductData.description}", "vendor":"${createProductData.vendor}","tags":"${createProductData.tags}", "options":[${createProductData.options}], "variants":${JSON.stringify(createProductData.variants)}}}`;
  return createMutation;
};

function updateProduct(updateProductData) {
  const updateMutation = `{"input": {"id":"${updateProductData.id}", "title": "${updateProductData.title}", "handle":"${updateProductData.handle}", "descriptionHtml":"${updateProductData.description}", "vendor":"${updateProductData.vendor}", "tags":"${updateProductData.tags}", "options":[${updateProductData.options}], "variants":${JSON.stringify(updateProductData.variants)}}}`;
  return updateMutation;
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

function deleteProduct(id) {
  const deleteMutation = `mutation {
        productDelete(input: {id: ${id}}) {
          deletedProductId
        }
      }`;
  return deleteMutation;
}



module.exports = { createProduct, updateProduct, stagedUploads, createProducts, updateProducts, deleteProduct };