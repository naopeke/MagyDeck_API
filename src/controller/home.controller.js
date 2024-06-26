const {pool} = require('../database')
const { format } = require('date-fns');

const getMyEvents = async(req, res) => {
    let respuesta;
    try{
        let params = req.params.id_user

        let getEvents = `SELECT userEvent.id_user, creator AS creatorEvent, magydeck.evento.*, avatarCreador.avatar AS avatar
        FROM magydeck.userEvent
        JOIN magydeck.evento ON (userEvent.id_event = evento.id_event)
        JOIN 
            (SELECT userEvent.id_event, user.avatar
            FROM magydeck.userEvent
            JOIN magydeck.user ON (userEvent.id_user = user.id_user)
            WHERE userEvent.creator = 1) AS avatarCreador 
            ON (userEvent.id_event = avatarCreador.id_event)
        WHERE userEvent.id_user = ? AND evento.date >= CURDATE() 
        ORDER BY evento.date ASC LIMIT 3;`

        let [result] = await pool.query(getEvents, params)
  
        result.forEach(evento => {
            evento.date = format(new Date(evento.date), 'yyyy-MM-dd')
            evento.hour = evento.hour.slice(0, 5); 
        });

        if(result.length == 0){
            respuesta = {error: true, codigo: 200, mensaje: 'No se han encontrado eventos próximos en los que participes', data:result}
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

        let getEvents = `SELECT DISTINCT magydeck.evento.*, userEvent.id_user, user.avatar
        FROM magydeck.evento
        JOIN magydeck.userEvent ON (evento.id_event = userEvent.id_event)
        JOIN magydeck.user ON (userEvent.id_user = user.id_user)
        WHERE creator = 1 AND evento.date >= CURDATE() AND userEvent.id_event NOT IN(
            SELECT id_event
            FROM userEvent
            WHERE id_user = ?)
            ORDER BY evento.date ASC LIMIT 3`

        let [result] = await pool.query(getEvents, params)
        result.forEach(evento => {
            evento.date = format(new Date(evento.date), 'yyyy-MM-dd')
            evento.hour = evento.hour.slice(0, 5); 
        });
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

const getParticipantes = async (req, res) => {
    let respuesta;
    try{
        let params = req.params.id_event

        let participantes = `SELECT userEvent.id_user, user.nameUser, userEvent.id_event, userEvent.creator AS creatorEvent FROM magydeck.userEvent
        JOIN magydeck.user ON (userEvent.id_user = user.id_user)
        WHERE id_event = ?`

        let [result] = await pool.query(participantes, params)
        if(result.length == 0){
            respuesta = {error: true, codigo: 200}
        }else{
            respuesta = {error: false, codigo: 200, mensaje: 'Participantes recuperados', data: result}
        }
        
        res.json(respuesta)
        
    }
    catch (error){
        console.error(`Error: ${error}`);
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
            let postParticipacion = 'INSERT INTO magydeck.userEvent (id_user, id_event) VALUES (?, ?)'
        
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

const deleteParticipacion = async (req, res) =>{
    let respuesta;
    try{
        let params = [req.body.id_user, req.body.id_event]

        let existQuery = `SELECT * FROM  magydeck.userEvent 
        WHERE  id_user = ? AND id_event = ?`
        let [exist] = await pool.query(existQuery, params)

        let creatorQuery = `SELECT * FROM  magydeck.userEvent 
        WHERE  id_user = ? AND id_event = ? AND creator = 1`
        let [creator] = await pool.query(creatorQuery, params)


        if(exist.length == 0){
            
            respuesta = {error: true, codigo: 200, mensaje: 'No participas en el evento'}
        } else if(creator.length > 0){
            let postParticipacion = 'DELETE FROM magydeck.userEvent WHERE userEvent.id_event = ?'
            let [result] = await pool.query(postParticipacion, [req.body.id_event])

            let deleteQuery = `DELETE FROM magydeck.evento WHERE evento.id_event = ?`
            let [deleteEvent] = await pool.query(deleteQuery, [req.body.id_event])
            respuesta = {error: false, codigo: 200, mensaje: '¡Has eliminado el evento!'}
        }
        else {
            let postParticipacion = 'DELETE FROM magydeck.userEvent WHERE userEvent.id_user = ? AND userEvent.id_event = ?'
            let [result] = await pool.query(postParticipacion, params)            
            respuesta = {error: false, codigo: 200, mensaje: '¡Has abandonado el evento!'}
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
        let getDecks = `SELECT id_deck, nameDeck, photoDeck.URLphoto, user.nameUser, ROUND((sumScores/nScores),1) AS mediaScore 
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


module.exports = {postParticipacion, getMyEvents, getEventsCommunity, getBestDecks, deleteParticipacion, getParticipantes}