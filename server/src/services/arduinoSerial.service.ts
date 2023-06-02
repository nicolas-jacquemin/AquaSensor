import { SerialPort } from "serialport";

type Relay = {
    id: number;
    state: boolean;
}

export default class ArduinoSerial {
    private static instance: ArduinoSerial;
    private port: SerialPort;
    private relays: any = {};
    constructor() {
        this.port = new SerialPort({
            baudRate: 9600,
            path: process.env.ARDUINO_SERIAL_PORT || "/dev/ttyACM0",
            autoOpen: false
        });
        for (let i = Number(process.env.RELAY_LIST_MIN); i < Number(process.env.RELAY_LIST_MAX); i++) {
            this.relays[i] = {
                id: i,
                label: `Relay ${i}`,
                state: false,
                timeoutToInvert: -1
            } as Relay;
        }
    }

    public async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.port.open((err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    public static getInstance(): ArduinoSerial {
        if (!ArduinoSerial.instance) {
            ArduinoSerial.instance = new ArduinoSerial();
        }
        return ArduinoSerial.instance;
    }
    public async send(data: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.port.write(Buffer.from(data), (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    public async relay(relayId: number, state: boolean): Promise<void> {
        if (relayId < Number(process.env.RELAY_LIST_MIN) || relayId > Number(process.env.RELAY_LIST_MAX))
            throw new Error("Relay id out of range");
        switch (state) {
            case true:
                this.relays[relayId].state = true;
                await this.send(`relayon,${relayId};`);
                break;
            case false:
                this.relays[relayId].state = false;
                await this.send(`relayoff,${relayId};`);
                break;
            default:
                break;
        }
    }

    public getRelay(relayId: number): Relay {
        if (relayId < Number(process.env.RELAY_LIST_MIN) || relayId > Number(process.env.RELAY_LIST_MAX))
            throw new Error("Relay id out of range");
        return this.relays[relayId];
    }

    public getRelays(): any {
        return this.relays;
    }
    
    public async read(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.port.on("data", (data) => {
                resolve(data.toString());
            });
        });
    }
    public on(event: string, callback: (data: string) => void): void {
        this.port.on(event, callback);
    }
}
