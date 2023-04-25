function getProduct(reqData) {
    const getProductQuery = `{
        products (first:1, query:"sku:${reqData}") {
        edges {
          node {
            id
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
          id
        }
      }
    }
  }
  `;
  return getProductQueryByGUID;
}

module.exports = { getProduct, getProductByGUID };