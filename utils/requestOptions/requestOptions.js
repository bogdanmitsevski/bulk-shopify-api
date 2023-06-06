function requestStructure(args) {
    const optionsMutation = {
        method: "post",
        headers: {
            "Content-Type": "application/graphql",
            "X-Shopify-Access-Token": "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"
        },
        body: args
    };
    return optionsMutation;
}

module.exports = requestStructure;