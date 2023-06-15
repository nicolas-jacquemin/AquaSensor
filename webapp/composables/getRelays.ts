export default async function getRelays(token: string): Promise<string> {
    try {
        let relaysReq = await fetch("/api/settings/relayConfig", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (relaysReq.status === 401 || relaysReq.status === 400) {
            throw new Error("Invalid token");
        }
        if (relaysReq.status !== 200) {
            throw new Error("Unknown error");
        }
        let relays = await relaysReq.json();
        return relays.data;
    } catch (e: any) {
        throw new Error("Unknown error");
    }
}