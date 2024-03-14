const {pool} = require('../database')

const getMyEvents = async(req, res) => {
    let respuesta;
    try{
        let params = req.params.id_user

        let getEvents = `SELECT id_user, participation, magydeck.evento.*
        FROM magydeck.userEvent
        JOIN magydeck.evento ON (userEvent.id_event = evento.id_event)
        WHERE id_user = ? AND participation = 1
        ORDER BY evento.date ASC LIMIT 3`

        let [result] = await pool.query(getEvents, params)
        console.log(result);

        if(result.length == 0){
            respuesta = {error: true, codigo: 200, mensaje: 'No se han encontrado eventos próximos en los que participes'}
        }else{
            respuesta = {error: false, codigo: 200, mensaje: 'Eventos recuperados', data: result}
        }
        
        res.json(respuesta)
        
    }
    catch (error){
        console.error(`Error: ${error}`);
    }
}

const getEventsCommunity = async(req, res) => {
    let respuesta;
    try{
        let params = req.params.id_user

        let getEvents = `SELECT id_user, participation, magydeck.evento.*
        FROM magydeck.userEvent
        JOIN magydeck.evento ON (userEvent.id_event = evento.id_event)
        WHERE id_user = ? AND (participation = 0 OR participation IS NULL)
        ORDER BY evento.date ASC LIMIT 3`

        let [result] = await pool.query(getEvents, params)
        console.log(result);

        if(result.length == 0){
            respuesta = {error: true, codigo: 200, mensaje: 'No se han encontrado eventos de la comunidad en los que NO participes'}
        }else{
            respuesta = {error: false, codigo: 200, mensaje: 'Eventos recuperados', data: result}
        }
        
        res.json(respuesta)
    }
    catch(error){
        console.log(`error: ${error}`);
    }
}

const postParticipacion = async (req, res) =>{
    let respuesta;
    try{
        let params = [req.body.id_user, req.body.id_event]

        let existQuery = `SELECT * FROM  magydeck.userEvent 
        WHERE  id_user = ? AND id_event = ?`

        let [exist] = await pool.query(existQuery, params)

        if(exist.length > 0){
            respuesta = {error: true, codigo: 200, mensaje: 'Ya participas en el evento'}
        }
        else {
            let postParticipacion = 'INSERT INTO magydeck.userEvent (id_user, id_event, participation) VALUES (?, ?, 1)'
        
            let [result] = await pool.query(postParticipacion, params)
            console.log([result]);
            
            respuesta = {error: false, codigo: 200, mensaje: '¡Ahora participas en el evento'}
            
        }

        res.json(respuesta)
    }

    catch (error){
        console.error(`Error: ${error}`);
    }
}

const getBestDecks = async (req, res) => {
    let respuesta;
    try{
        let getDecks = `SELECT mediaScore, nameDeck, photoDeck.URLphoto, user.nameUser 
        FROM magydeck.deck 
        JOIN magydeck.user ON (deck.id_user = user.id_user)
        JOIN magydeck.photoDeck ON (deck.id_photoDeck = photoDeck.id_photoDeck)
        ORDER BY mediaScore DESC LIMIT 3`
    
        let [result] = await pool.query(getDecks)
        console.log(result);
        

        if(result.length == 0){
            respuesta = {error: true, codigo: 200, mensaje: 'No existen mazos votados'}

        } else {
            respuesta = {error: false, codigo: 200, mensaje: 'Mazos recuperados', data: result}
        }
        res.json(respuesta)
        
    }

    catch (error){
        console.error(`Error: ${error}`);
    }
}


module.exports = {postParticipacion, getMyEvents, getEventsCommunity, getBestDecks}