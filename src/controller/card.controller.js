const { connection } =  require('../database');
const axios = require('axios');

const fetchCardData = async (req, res, next) => {
    if (req.query.cardName) {
        // スペースをプラス記号に置き換え
        const cardName = req.query.cardName.split(' ').join('+');
        try {
            const response = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${encodeURI(cardName)}`);
            const cardData = {
                id: response.data.id,
                image_uris: response.data.image_uris?.normal, // image_urisがundefinedの場合のためのオプショナルチェイニング
                name: response.data.name,
                type_line: response.data.type_line,
                oracle_text: response.data.oracle_text,
                printed_text: response.data.printed_text,
                color_identity: response.data.color_identity,
                legalities: response.data.legalities,
                set_name: response.data.set_name,
                set_type: response.data.set_type,
                prices: response.data.prices?.eur // pricesがundefinedの場合のためのオプショナルチェイニング
            };
            res.json(cardData); // クライアントにカードデータをJSON形式で返す
        } catch (err) {
            console.log('Error fetching card data', err);
            res.status(500).send('Error fetching card data');
        }
    } else {
        res.status(400).send('Card name is required');
    }
};


const addCards = async (req, res, next) => {
    try {
        console.log('add cards try');
    } catch {
        console.log('add cards catch');
    }
}


const deleteCards = async (req, res, next) => {
    try {
        console.log('add cards try');
    } catch {
        console.log('add cards catch');
    }
}

module.exports = {
    fetchCardData,
    addCards,
    deleteCards
};