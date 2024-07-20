import { v4 as uuid } from 'uuid';
import { db } from './firebaseConfig';
import {  doc, updateDoc, arrayUnion } from "firebase/firestore";


const pushMessage= async (seletectedTicket,inputMessage,currentUserEmail) => {

    if(!inputMessage || !seletectedTicket) return
    console.log(seletectedTicket, inputMessage, currentUserEmail) 
    await updateDoc(doc(db, "chats" , seletectedTicket.ticketId), {
        messages: arrayUnion({
            id: uuid(),
            message: inputMessage,
            sender: currentUserEmail,
            timestamp: Date.now(),
        }),
    });

    var secondUser;
    if (seletectedTicket.agentEmail === currentUserEmail) {
        secondUser = seletectedTicket.agentEmail;
    } else {
        secondUser = seletectedTicket.userEmail;
    }
    const currentTimestamp = Date.now();
    const ticketId = seletectedTicket.ticketId;
    await updateDoc(doc(db, "chatConnections", currentUserEmail), {
        [ticketId + ".lastMessage"]: inputMessage,
        [ticketId + ".lastUpdatedTimestamp"]: currentTimestamp,
        [ticketId + ".lastMessageBy"]: currentUserEmail
    });

    await updateDoc(doc(db, "chatConnections", secondUser), {
        [ticketId + ".lastMessage"]: inputMessage,
        [ticketId + ".lastUpdatedTimestamp"]: currentTimestamp,
        [ticketId + ".lastMessageBy"]: currentUserEmail
    });
}

export default pushMessage