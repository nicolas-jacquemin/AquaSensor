export const relaySwitch = async (relay: number, state: boolean) => {
    try {
        const c = await fetch(`/api/relay/${relay}/${state ? "on" : "off"}`, {
            method: "POST",
        });
        return await c.json();
    } catch (e) {
        throw new Error("Failed to toggle relay");
    }
}
