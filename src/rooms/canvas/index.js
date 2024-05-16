// FIXME: This file should handle the room canvas API
// Link buttons to their respective functions
// Functions may include:
// - getCanvas (get the canvas of a room and deserialize it)
// - subscribeToRoom (subscribe to the stream of a room)
// - getPixelInfo (get the pixel info of a room)
// - placePixel (place a pixel in a room)

import { initCanvas } from "./utils";
import { authedAPIRequest } from "../../utils/auth";


export async function getCanvas(roomConfig)
{
    let name = document.location.href.replace(/^https?:\/\/.*\/(.*)$/, "$1");
    if (typeof name === "undefined" || name == "")
        name = "epi-place";
    let res = await fetch(import.meta.env.VITE_URL + "/api/rooms/" + name + "/canvas", {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
    if (res.status !== 200)
    {
        localStorage.removeItem("token");
        await authedAPIRequest();
        return await getCanvas(roomConfig);
    }
    let json = await res.json();
    let binary = "";
    for (var i = 0; i < json.pixels.length; i++) {
        binary += json.pixels.charCodeAt(i).toString(2).padStart(8, "0");
    }
    let pixels = [];
    let five = 0;
    let pixCode = "";
    for (let pixel of binary)
    {   
        pixCode += pixel;
        five++;
        if (five % 5 === 0)
        {
            pixels.push(parseInt(pixCode, 2));
            pixCode = "";
        }
    }
    initCanvas(roomConfig, pixels);

    return true;
}