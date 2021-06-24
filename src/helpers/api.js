const BASE_URL = 'https://api.binance.com';
const API_KEY = 'on8O6mEfAGfG2I6JlfrOWeQ12v7PJJTcjbvuPRIRroKimIJTF4bHIGPK9h2Ei4iz';
const API_SECRET = 'Y40BJYYYNqr8zs36tX4UtFaS8y30yGbPTslF1j0MM5ArYuL7PuKHuHspzI83s3AE';

const SOURCES = {
    CURRENT_AVERAGE_PRICE: `${BASE_URL}/api/v3/ticker/price?symbol=BTCUSDT`
}

const GET = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(data => resolve(data));
    })
}

const getAveragePrice = async () => {
    return await GET(SOURCES.CURRENT_AVERAGE_PRICE);
}

module.exports = {
    getAveragePrice
}