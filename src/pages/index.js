// FIXME: This is the entry point of the application, write your code here

import { calculateLayout } from "./utils";
import { io } from "socket.io-client"
import { joinRoom, fetchRoomConfig } from "../rooms/index";
import { getCanvas } from "../rooms/canvas/index";
import {renderCanvasUpdate} from "../rooms/canvas/utils";
import './debug';
import { authedAPIRequest } from "../utils/auth";

// Initialize the layout
calculateLayout();

await authedAPIRequest();

const socket = io(import.meta.env.VITE_URL, {extraHeaders: {Authorization: `Bearer ${localStorage.getItem("token")}`}});

let b = false;
let list = [];
await joinRoom(socket);

await socket.on("pixel-update", (data) => {
    if (!b)
    {
        list.push(data);
    }
    else {
        
    let json = data.result.data.json;
    renderCanvasUpdate(json.color, json.posX, json.posY); 
    }
});

let roomConfig = await fetchRoomConfig();
await getCanvas(roomConfig);
b = true;

for (let d of list)
{
    let json = d.result.data.json;
    renderCanvasUpdate(json.color, json.posX, json.posY);
}


