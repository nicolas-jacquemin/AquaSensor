import { SerialPort } from "serialport";

export default class ArduinoSerial {
    private static instance: ArduinoSerial;
    private port: SerialPort;
    private constructor() {
        this.port = new SerialPort({
            baudRate: 9600,
            path: process.env.ARDUINO_SERIAL_PORT || "/dev/ttyACM0"
        });
    }
    public static getInstance(): ArduinoSerial {
        if (!ArduinoSerial.instance) {
            ArduinoSerial.instance = new ArduinoSerial();
        }
        return ArduinoSerial.instance;
    }
    public async send(data: string): Promise<void> {
        this.port.write(data);
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
