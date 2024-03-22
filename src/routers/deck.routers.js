const { Router } = require ('express');
const router = Router();
const deckCtrl = require('../controller/deck.controller');

router.get('/mis-mazos/:id_user', deckCtrl.getMyDecksWithData);

// router.get('/mis-mazos/?:id_deck', deckCtrl.getMyDeckById);

// router.get('/mis-mazos/:id', deckCtrl.fetchCardDataById);

router.put('/mis-mazos/:id_deck', deckCtrl.editMyDeckName);

router.put('/mis-mazos/cantidad/:id_deckCard', deckCtrl.updateCardQuantity);

router.put('/mis-mazos/compartir/:id_deck', deckCtrl.mySharedDeck);




// router.get('/mis-mazos/:id_user, )
// router.post('/mis-mazos, ) añadir deck, pasar por body tbn el id_user
// router.put('/mis-mazos/nombre, ) editar nombre deck, pasar por body tbn el id_user
// router.put('/mis-mazos, ) modificar deck, pasar por body tbn el id_user
// router.put('/mis-mazos/compartir, ) modificar compartir boolean, pasar por body tbn el id_user

module.exports = router;