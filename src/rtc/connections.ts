import Peer from 'simple-peer';

const peer1 = new Peer({ initiator: true });
const peer2 = new Peer();


peer1.on('signal', data => {
    // when peer1 has signaling data, give it to peer2 somehow
    console.log("peer1 to peer2 do you read me?");
    peer2.signal(data)
});

peer2.on('signal', data => {
    // when peer2 has signaling data, give it to peer1 somehow
    console.log("peer2 to peer1 do you read me?");
    peer1.signal(data)
});

peer1.on('connect', () => {
    // wait for 'connect' event before using the data channel
    peer1.send('hey peer2, how is it going?')
});

peer2.on('data', data => {
    // got a data channel message
    console.log('got a message from peer1: ' + data)
});

type CoolTypesOfMessages = "TextMessage" | "PlayerUpdate";

interface CoolChannelData {
    MessageType: CoolTypesOfMessages,
}

interface TextMessage extends CoolChannelData {
    MessageType: "TextMessage",
    MessageText: string,
}
/*
interface PlayerUpdateMessage extends CoolChannelData {
    MessageType: "PlayerUpdate",
    PlayerUpdate: Player,
}

//const Players = new Map<string, Player>();

class ReallyCoolChannel {
    private listeners: { type: CoolTypesOfMessages, callback: (data: CoolChannelData) => void }[] = [];
    
    Listen(type: CoolTypesOfMessages, callback: (data: CoolChannelData) => void) {
        this.listeners.push({ type, callback });
    }

    Unlisten(callback: (data: CoolChannelData) => void) {
        //console.log("Fine you don't want to listen anymore, but how will you find out about my next album?");
        this.listeners = this.listeners.filter(l => l.callback !== callback);
    }
}

export const PeerHostChannel = new ReallyCoolChannel();
*/