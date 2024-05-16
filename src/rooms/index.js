// FIXME: This file should handle the rooms API
// Functions may include:
// - fetchRoomConfig (get the configuration of a room)
// - joinRoom (join a room by its slug)
// - listRooms (list all the rooms available)
// - createRoom (create a room)
// - updateRoom (update a room's configuration)
// - deleteRoom (delete a room)

import { v4 as uuidv4} from "uuid";
import { authedAPIRequest } from "../utils/auth";
//import fetch from "node-fetch";

function sleep(s) {
    return new Promise((resolve) => setTimeout(resolve, s  * 1000));
  }

export async function joinRoom(socket)
{
    let url = document.location.href;
    let name = url.replace(/^https?:\/\/.*\/(.*)$/, "$1");
    if (typeof name === "undefined" || name == "")
        name = "epi-place";
    socket.on("connect", () => {
        socket.send({
            id: uuidv4(),
            method: 'subscription',
            params: {
            path: 'rooms.canvas.getStream',
                input: {
                    json: {
                        roomSlug: name,
                    }
                }
            }
        });
    });

    await sleep(0.1);
    let res;
    await socket.on("message", (data) => {
        res = data;
    });
    return res;
}

export async function fetchRoomConfig()
{
    let roomName = document.getElementById("room-name");
    let roomDescription = document.getElementById("room-description");

    let name = document.location.href.replace(/^https?:\/\/.*\/(.*)$/, "$1");
    if (typeof name === "undefined" || name == "")
        name = "epi-place";
    let res = await fetch(import.meta.env.VITE_URL + "/api/rooms/" + name + "/config", {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
    if (res.status !== 200)
    {
        localStorage.removeItem("token");
        await authedAPIRequest();
        return await fetchRoomConfig();
    }
    let json = await res.json();

    roomName.innerHTML = json.metadata.name;
    if (json.metadata.description != null)
    {
        roomDescription.innerHTML = json.metadata.description;
        roomDescription.style.display = "block";
    }
    else
    {
        roomDescription.style.display = "none";
    }
    return json;
}