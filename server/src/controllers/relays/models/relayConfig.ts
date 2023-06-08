import mongoose from "mongoose";

export type relayConfig = {
    relayId: number,
    name: string,
    icon: string,
    normallyOpen: boolean,
}

const schema =  new mongoose.Schema<relayConfig>({
    relayId: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        indexes: true,
    },
    normallyOpen: {
        type: Boolean,
        required: true,
        default: false,
    },
});

export default mongoose.model<relayConfig>("relayConfigs", schema);
