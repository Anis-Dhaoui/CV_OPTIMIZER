import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import * as mongoose from 'mongoose';

@Schema()
export class Program {
    @Prop({ unique: true, required: true })
    programName: string;
}
export const ProgramSchema = SchemaFactory.createForClass(Program);