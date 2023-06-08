import { default as ArduinoSerial, Relay } from "../tools/arduinoSerial.tools.js";
import relayConfig from "../controllers/relays/models/relayConfig.js";

async function waitDB() {
    return new Promise((resolve, reject) => {
        let interval = setInterval(async () => {
            if ((await import("../app.js")).dbConnected) {
                clearInterval(interval);
                resolve(true);
            }
        }, 500);
    });
}

export async function getUpdatedRelays() {
    await waitDB();
    let relaysRequest = await relayConfig.find();

    let relays: any = {};
    
    for (let relay of relaysRequest) {
        (relays[relay.relayId] as Relay) = {
            id: relay.relayId,
            normallyOpen: relay.normallyOpen,
            state: false
        };
    }
    return relays;
}

let arduino: ArduinoSerial = new ArduinoSerial(await getUpdatedRelays());

export default arduino;