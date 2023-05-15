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

function getVariantById (reqData) {
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

module.exports = { getProduct, getProductByGUID, getVariantById };