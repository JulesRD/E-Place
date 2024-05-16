// FIXME: This file should handle the authentication
// Functions may include:
// - sendTokenRequest (get a token or refresh it)
// - authedAPIRequest (make an authenticated request to the API)

export async function authedAPIRequest()
{
    let token = localStorage.getItem("token");
    if (token == null)
    {
        let refresh_token = localStorage.getItem("refresh_token");
        if (refresh_token == null)
        {
            let url = new URL(import.meta.env.VITE_AUTH_URL + "/authorize");
            url.searchParams.append("client_id", import.meta.env.VITE_CLIENT_ID);
            url.searchParams.append("scope", "epita profile picture");
            url.searchParams.append("redirect_uri", "http://localhost:8080/complete/epita/");
            url.searchParams.append("response_type", "code");
            document.location.href = url;
        }
        else {
            let data = new FormData();
            data.append("client_id", import.meta.env.VITE_CLIENT_ID);
            data.append("redirect_uri", import.meta.env.VITE_URL + "/complete/epita/");
            data.append("grant_type", "refresh_token");
            data.append("refresh_token", localStorage.getItem("refresh_token"));

            const response = await fetch("/auth-api/token", 
                {
                    method: "post",
                    body: data,
                });
            if (response.status !== 200)
            {
                localStorage.removeItem("refresh_token");
                await authedAPIRequest();
                window.location.href = import.meta.env.VITE_URL;
            }
            const res = await response.json();
            localStorage.setItem("token", res.id_token);
            localStorage.setItem("refresh_token", res.refresh_token);
            
            window.location.href = import.meta.env.VITE_URL;
        }
    }
}