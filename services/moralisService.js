const axios = require("axios");

module.exports.getNFTsForAddress = async (address) => {
    try {
        console.log(`moralisService.js ln 5 address ${address}`)
        var config = {
            method: "get",
            url: `https://deep-index.moralis.io/api/v2/${address}/nft?chain=eth&format=decimal`,
            headers: {
                "x-api-key": process.env.MORALIS_TOKEN,
            },
        };
        const response = await axios(config);
        console.log(`moralisService ln 14 response ${JSON.stringify(response.result)}`)

        return response.result;
    } catch (error) {
        console.error(error);
    }
}