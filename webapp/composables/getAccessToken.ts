function setStorage(email: string, icon: string, name: string, slug: string, permissions: string[]) {
    localStorage.setItem('email', email)
    localStorage.setItem('icon', icon)
    localStorage.setItem('name', name)
    localStorage.setItem('slug', slug)
    localStorage.setItem('permissions', JSON.stringify(permissions))
}

export default async function getAccessToken(): Promise<string> {
    if (localStorage.getItem("token") === null) {
        throw new Error("Invalid token");
    }
    try {
        let user = await fetch("/api/auth/infos", {
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
        let userData = await user.json();
        setStorage(userData.data.email, userData.data.icon, userData.data.name, userData.data.slug, userData.data.permissions);
        return localStorage.getItem("token")!;
    } catch (e: any) {
        if (e.message === "Unknown error")
            throw new Error("Unknown error");
        if (localStorage.getItem("refreshToken") === null)
            throw new Error("Invalid token");
        let renew = await fetch("/api/auth/renewToken", {
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
        setStorage(json.data.email, json.data.icon, json.data.name, json.data.slug, json.data.permissions);
        return json.data.token;
    }
}