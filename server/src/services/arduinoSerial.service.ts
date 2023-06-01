import { SerialPort } from "serialport";
import { promisify } from "util";

export default class ArduinoSerial {
    private static instance: ArduinoSerial;
    private port: SerialPort;
    constructor() {
        this.port = new SerialPort({
            baudRate: 9600,
            path: process.env.ARDUINO_SERIAL_PORT || "/dev/ttyACM0",
            autoOpen: false
        });
    }

    public async init(): Promise<void> {
        await promisify(this.port.open)();
    }
    public static getInstance(): ArduinoSerial {
        if (!ArduinoSerial.instance) {
            ArduinoSerial.instance = new ArduinoSerial();
        }
        return ArduinoSerial.instance;
    }
    public async send(data: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.port.write(data, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    public async relay(relayId: number, state: boolean): Promise<void> {
        switch (state) {
            case true:
                await this.send(`relayon,${relayId};`);
                break;
            case false:
                await this.send(`relayoff,${relayId};`);
                break;
            default:
                break;
        }
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
