function getProduct(reqData) {
  const getProductQuery = `{
        products (first:1, query:"sku:${reqData}") {
        edges {
          node {
            id,
            tags
          }
        }
      }
    }
    `;
  return getProductQuery;
}

function getProductVariantBySKU(sku) {
  const getVariantQuery = `{
    productVariants (first:1, query:"sku:${sku}") {
    edges {
      node {
        id
      }
    }
  }
}
  `;
  return getVariantQuery;
}

function getProductByHandle (handle) {
  const getProductQueryByHandle = `{
    products (first:1, query:"${handle}") {
    edges {
      node {
        id
      }
    }
  }
}
`;
console.log(getProductQueryByHandle);
return getProductQueryByHandle;
}
 
function getProductByGUID(reqDataGUID) {
  const getProductQueryByGUID = `{
      products (first:1, query:"tag:${reqDataGUID}") {
      edges {
        node {
          id,
          tags
        }
      }
    }
  }
  `;
  return getProductQueryByGUID;
}

function getVariantById(reqData) {
  const getVariantBySKU = `{
    productVariants(first:1, query:"sku:${reqData}" ) {
      edges {
        node {
          id
          product {
            id
          }
        }
      }
    }
  }`;
  return getVariantBySKU;
}

function getProductInfo() {
  let getProductInformation = `mutation {
    bulkOperationRunQuery(
      query: """
          {
          products {
              edges {
                  node {
                      id,
                      handle,
                      title,
                      tags,
                      vendor,
                      descriptionHtml,
                      productType,
                      options {
                      name,
                      values
                        },
                      variants {
        edges {
          node {
            title,
            selectedOptions {
              name,
              value
            }
            price,
            compareAtPrice,
            sku,
            barcode,
            inventoryQuantity,
      			inventoryItem {
            unitCost {
              amount
            }
        }
          }
        }
      }
                  }
              }
          }
      }
      """
    ) {
      bulkOperation {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
  `;
  return getProductInformation;
}

function getBulkOperationId (bulkId) {
  const BulkOperationId = `
  query {
    node(id: "${bulkId}") {
      ... on BulkOperation {
        url
        partialDataUrl
      }
    }
  }
  `;
  return BulkOperationId;
}

function getMetafields () {
  const getMetafieldsInformation = `
  mutation {
    bulkOperationRunQuery(
     query: """
      {
        products {
          edges {
            node {
              id
              handle
              metafields {
                edges {
                  node {
                    id
                    namespace
                    key
                    value
                  }
                }
              }
              variants {
                edges {
                  node {
                    id,
                    sku
                  }
                }
              }
            }
          }
        }
      }
      """
    ) {
      bulkOperation {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
  `;
  return getMetafieldsInformation;
}

module.exports = { getProduct, getProductVariantBySKU, getProductByHandle, getProductByGUID, getVariantById, getProductInfo, getBulkOperationId, getMetafields };