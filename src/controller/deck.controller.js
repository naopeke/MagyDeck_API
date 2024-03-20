const { pool } =  require('../database');
const axios = require('axios');

// router.get('/mis-mazos/:id_user', deckCtrl.getDecks);
// router.post('/mis-mazos', deckCtrl.addDeck);
// router.put('/mis-mazos/:id_deck', deckCtrl.editDeckName);
// router.put('/mis-mazos', deckCtrl.editDeck);
// router.put('/mis-mazos/compartir', deckCtrl.shareDeck);


//* get id_deck, indexDeck, nameDeck, id_card, id, share, quantity
// SELECT deck.id_deck, deck.indexDeck, deck.nameDeck, card.id_card, card.id, deck.share, deckCard.quantity 
// FROM magydeck.deck 
// JOIN magydeck.deckCard ON deck.id_deck = deckCard.id_deck 
// JOIN magydeck.card ON deckCard.id_card = card.id_card 
// WHERE id_user = 13 
// ORDER BY deck.id_deck ASC, deck.indexDeck ASC;




// const getMyDeckById = async (req, res, next) => {
//     try {
//         const getMyDeckByIdParams = [req.params.id_deck];
//         const getMyDeckByIdQuery = `SELECT user.id_user, deck.id_deck, deck.nameDeck, 
//                                     JSON_ARRAYAGG(JSON_OBJECT('id', card.id_card, 'quantity', deckCard.quantity)) AS cards
//                                     FROM magydeck.deckCard
//                                     JOIN deck ON (deckCard.id_deck = deck.id_deck)
//                                     JOIN user ON (deck.id_user = user.id_user)
//                                     JOIN card ON (deckCard.id_card = card.id_card) 
//                                     WHERE deck.share = 1 AND deck.id_deck = ?
//                                     GROUP BY deck.id_deck`;

//         const [getMyDeckByIdResult] = await pool.query(getMyDeckByIdQuery, getMyDeckByIdParams);

//         if (getMyDeckByIdResult.length > 0) {
//             const cardIds = getMyDeckByIdResult[0].cards.map(async (card) => {
//                 const response = await axios.get(`https://api.scryfall.com/cards/${card.id}`);
//                 const dataCard = {
//                     id: response.data.id,
//                     image_uris: response.data.image_uris.normal,
//                     name: response.data.name,
//                     printed_name: response.data.printed_name,
//                     type_line: response.data.type_line,
//                     oracle_text: response.data.oracle_text,
//                     printed_text: response.data.printed_text,
//                     color_identity: response.data.color_identity,
//                     legalities: response.data.legalities,
//                     set_name: response.data.set_name,
//                     set_type: response.data.set_type,
//                     prices: response.data.prices.eur,
//                     quantity: card.quantity
//                 };
//                 return dataCard;
//             });

//             const cardsData = await Promise.all(cardIds);
//             const responseData = {
//                 data: {
//                     nameDeck: getMyDeckByIdResult[0].nameDeck,
//                     cards: cardsData
//                 }
//             };
//             res.json(responseData);
//         } else {
//             res.status(500).json({ error: true, code: 500, message: 'No se ha encontrado el mazo' });
//         }
//     } catch (err) {
//         console.log('Error: ', err);
//         res.status(500).json({ error: true, code: 500, message: 'Server error' });
//     }
// };



const fetchCardDataById = async (id) => {
    try {
        const response = await axios.get(`https://api.scryfall.com/cards/${id}`);
        const cardData = {
            id: response.data.id,
            image_uris: response.data.image_uris.normal, 
            name: response.data.name,
            printed_name: response.data.printed_name,
            type_line: response.data.type_line,
            oracle_text: response.data.oracle_text,
            printed_text: response.data.printed_text,
            color_identity: response.data.color_identity,
            legalities: response.data.legalities,
            set_name: response.data.set_name,
            set_type: response.data.set_type,
            prices: response.data.prices.eur
        };
        return cardData;
    } catch (err) {
        console.log('Error fetching with id', err);
        throw new Error('Error fetching card data with id');
    }
}


const getMyDecks = async (req, res, next) => {
    try {
        const userId = req.body.id_user;
        const getMyDecksQuery = `SELECT deck.id_deck, deck.indexDeck, deck.nameDeck, card.id_card, card.id, deck.share, deckCard.quantity 
                                FROM magydeck.deck 
                                JOIN magydeck.deckCard ON deck.id_deck = deckCard.id_deck 
                                JOIN magydeck.card ON deckCard.id_card = card.id_card 
                                WHERE id_user = ? 
                                ORDER BY deck.id_deck ASC, deck.indexDeck ASC;`;
        const [getMyDecksResult] = await pool.query(getMyDecksQuery, [userId]);

        const decks = getMyDecksResult.map(async (deck) => {
            const cardData = await fetchCardDataById(deck.id);
            return {
                id_deck: deck.id_deck,
                indexDeck: deck.indexDeck,
                nameDeck: deck.nameDeck,
                card: {
                    id_card: deck.id_card,
                    id: deck.id,
                    ...cardData
                },
                share: deck.share,
                quantity: deck.quantity
            };
        });

        const allDecksData = await Promise.all(decks);

        res.status(200).json({ error: false, code: 200, message: "Got Decks' data", data: allDecksData });
    } catch (error) {
        console.log('Error getting deck info:', error);
        res.status(500).json({ error: true, code: 500, message: 'Server error' });
    }
}


const editMyDeckName = async (req, res, next) => {
    try {
        console.log('edit deck name try');
    } catch {
        console.log('edit deck name catch');
    }
}

const editMyDeck = async (req, res, next) => {
    try {
        console.log('edit deck try');
    } catch {
        console.log('edit deck catch');
    }
}

const mySharedDeck = async (req, res, next) => {
    try {
        console.log('share deck try');
    } catch {
        console.log('share deck catch');
    }
}


module.exports = {
    // getMyDeckById,
    fetchCardDataById,
    getMyDecks,
    editMyDeckName,
    editMyDeck,
    mySharedDeck
};