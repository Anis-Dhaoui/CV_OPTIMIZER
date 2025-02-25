import { Document } from "mongoose";
import { IProgram } from "../program/entities/program.entity";

export class IUser extends Document {
    readonly username: string;
    readonly password: string;
    readonly fullName: string;
    readonly email: string;
    readonly mobile: number;
    readonly program: IProgram;
}
