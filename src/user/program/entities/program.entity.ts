import { Document } from "mongoose";

export class IProgram extends Document {
    readonly programName: string;
}
