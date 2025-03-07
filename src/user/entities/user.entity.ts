import { Document } from "mongoose";
import { IResume } from "src/resume/entities/resume.entity";

export class IUser extends Document {
    readonly username: string;
    readonly password: string;
    readonly fullName: string;
    readonly email: string;
    readonly mobile: number;
    readonly resumes: IResume[];
}
