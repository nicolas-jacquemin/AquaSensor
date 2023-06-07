import { SerialPort } from "serialport";

type Relay = {
    id: number;
    state: boolean;
}

export default class ArduinoSerial {
    private static instance: ArduinoSerial;
    private port: SerialPort = new SerialPort({
        baudRate: 9600,
        path: process.env.ARDUINO_SERIAL_PORT || "/dev/ttyACM0",
        autoOpen: false
    });
    private relays: any = {};
    private connected: boolean = false;
    constructor() {
        this.heartbeat();
        this.connect();
    }

    private connect() {
        this.port = new SerialPort({
            baudRate: 9600,
            path: process.env.ARDUINO_SERIAL_PORT || "/dev/ttyACM0",
            autoOpen: false
        });
        this.port.open((err) => {
            if (err) {
                console.log(`Cannot Connect to Arduino ${this.port.path}`);
                setTimeout(() => this.connect(), 1000);
            }
            else {
                console.log("Arduino Connected");
                this.connected = true;
            }
        })
        this.port.on("close", () => {
            if (this.connected) {
                this.connected = false;
                console.log("Arduino serial port closed");
                console.log("Retry connection");
                this.connect();
            }
        })
        this.port.on("error", () => {
            if (this.connected) {
                this.connected = false;
                console.log("Arduino serial port error");
                console.log("Retry connection");
                this.connect();
            }
        })
        for (let i = Number(process.env.RELAY_LIST_MIN); i < Number(process.env.RELAY_LIST_MAX); i++) {
            this.relays[i] = {
                id: i,
                label: `Relay ${i}`,
                state: false,
                timeoutToInvert: -1
            } as Relay;
        }
    }

    private async heartbeat() {
        if (!this.connected) {
            setTimeout(() => this.heartbeat(), 1000);
            return;
        }
        this.send("heartbeat;")
        .finally(() => {
            setTimeout(() => this.heartbeat(), 4000);
        });
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
            if (!this.connected)
                reject("Arduino not connected");
            this.port.write(data, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    public async relay(relayId: number, state: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            if (relayId < Number(process.env.RELAY_LIST_MIN) || relayId > Number(process.env.RELAY_LIST_MAX))
                throw new Error("Relay id out of range");
            switch (state) {
                case true:
                    this.send(`relayon,${relayId};`)
                    .catch((err) => {
                        reject(err);
                    })
                    .then(() => {
                        this.relays[relayId].state = true;
                        resolve();
                    })
                    break;
                case false:
                    this.send(`relayoff,${relayId};`)
                    .catch((err) => {
                        console.error(err);
                        reject(err);
                    })
                    .then(() => {
                        this.relays[relayId].state = false;
                        resolve();
                    })
                    break;
                default:
                    break;
            }
        });
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
