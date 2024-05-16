// FIXME: This file should handle the auth redirection
// Get the code from the URL parameters and redirect to the relevant page


let client_id = import.meta.env.VITE_CLIENT_ID;
let redirect_uri = import.meta.env.VITE_URL + "/complete/epita/";
let grant_type = "authorization_code";
let urlt = window.location.search;
const urlParams = new URLSearchParams(urlt);
let code = urlParams.get('code');



let data = new FormData();
data.append("client_id", client_id);
data.append("redirect_uri", redirect_uri);
data.append("grant_type", grant_type);
data.append("code", code);

async function quest()
{
    const response = await fetch("/auth-api/token", 
        {
            method: "post",
            body: data,
        });
    if (response.status !== 200)
    {
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token");
        //await authedAPIRequest();
        window.location.href = import.meta.env.VITE_URL;
        return;
    }
    const res = await response.json();
    localStorage.setItem("token", res.id_token);
    localStorage.setItem("refresh_token", res.refresh_token);
    
    window.location.href = import.meta.env.VITE_URL;
}

quest();