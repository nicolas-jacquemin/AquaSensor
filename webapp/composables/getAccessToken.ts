export default async function getAccessToken(): Promise<string> {
    if (localStorage.getItem("token") === null) {
        throw new Error("No token found");
    }
    try {
        let user = await fetch("http://localhost:3000/api/auth/infos", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        if (user.status === 401 || user.status === 400) {
            throw new Error("Invalid token");
        } else if (user.status !== 200) {
            throw new Error("Unknown error");
        }
        return localStorage.getItem("token")!;
    } catch (e: any) {
        if (e.message === "Unknown error")
            throw new Error("Unknown error");
        if (localStorage.getItem("refreshToken") === null)
            throw new Error("No refresh token found");
        let renew = await fetch("http://localhost:3000/api/auth/renewToken", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refreshToken: localStorage.getItem("refreshToken")
            })
        })
        if (renew.status === 401 || renew.status === 400) {
            throw new Error("Invalid token");
        } else if (renew.status !== 200) {
            throw new Error("Unknown error");
        }
        let json = await renew.json();
        if (json.data.token === undefined || json.data.refreshToken === undefined) {
            throw new Error("Invalid token");
        }
        localStorage.setItem("token", json.data.token);
        localStorage.setItem("expUTC", json.data.expUTC);
        localStorage.setItem("refreshToken", json.data.refreshToken);
        localStorage.setItem("refreshExpUTC", json.data.refreshExpUTC);
        return json.data.token;
    }
}