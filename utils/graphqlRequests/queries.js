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
                      options {
                      name
                        },
                      variants {
        edges {
          node {
            title,
            price,
            sku,
            barcode,
          }
        }
      },
                      metafields {
                          edges {
                              node {
                                  namespace
                                  key
                                  value
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

module.exports = { getProduct, getProductByGUID, getVariantById, getProductInfo, getBulkOperationId };