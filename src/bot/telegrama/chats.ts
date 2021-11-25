/**
 ** Example .env
 **
 ** CHATS="1 2 3 -1004"
 **/
import dotenv from 'dotenv'

dotenv.config() // loads .env into process.env

const chatsString = process.env.CHATS || ''

export default chatsString.split(/\s+/).map(id => parseInt(id)).filter(Boolean)
