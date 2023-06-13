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

function getProductByHandle(handle) {
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
                      status,
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
            },
            price,
            compareAtPrice,
            sku,
            barcode,
      			inventoryItem {
            unitCost {
              amount
            }
        },
          }
        }
      }
      media {
        edges {
          node {
            preview {
              image {
                url,
                altText
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

function getInventoryInfo() {
  const productInventory = `
  mutation {
    bulkOperationRunQuery(
      query: """
      {
        products (first:1, query:"sku:151615fddf463578") {
          edges {
            node {
              id,
              handle,
              title
              variants {
                edges {
                  node {
                    id,
                    title,
                    selectedOptions {
                      name,
                      value
                    }
                    sku,
                    inventoryItem {
                      harmonizedSystemCode,
                      countryCodeOfOrigin,
                      inventoryLevels(first: 5) {
                        edges {
                          node {
                            quantities(names: ["on_hand"]) {
                              name,
                              quantity
                            }
                            location {
                              name
                            }
                          }
                        }
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

  return productInventory;
};

function getBulkOperationId(bulkId) {
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

function getMetafields() {
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

function getMedia() {
  const getAllMedia = `
  mutation {
    bulkOperationRunQuery(
      query: """
      query GetProductAndVariantMedia {
        products {
          edges {
            node {
              id
              media {
                edges {
                  node {
                    mediaContentType
                    preview {
                      image {
                        url
                      }
                    }
                  }
                }
              }
              variants {
                edges {
                  node {
                    id
                    media {
                      edges {
                        node {
                          mediaContentType
                          preview {
                            image {
                              url
                            }
                          }
                        }
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
  return getAllMedia;
}

module.exports = { getProduct, getProductVariantBySKU, getProductByHandle, getProductByGUID, getVariantById, getProductInfo, getBulkOperationId, getMetafields, getMedia, getInventoryInfo };