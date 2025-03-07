import { ResumeSchema } from './../../resume/schema/resume.schema';
import { InjectModel, Prop, Schema, SchemaFactory, } from "@nestjs/mongoose"
import * as mongoose from 'mongoose';
import { Schema as MongooseSchema, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema()
export class User {

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true, unique: true })
    email: string;

    // @Prop({ required: true, unique: true })
    @Prop({ unique: false})
    mobile: number;



    // @Prop({ type: [{ type: Types.ObjectId, ref: 'Resume' }], default: [] })  
    // resumes: Types.ObjectId[]; // Array of Resume _id references

    // // An array of references to the 'Program' model
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Resume' }] })
    resumes: typeof ResumeSchema[];
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: (err?: Error) => void) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const hashed = await bcrypt.hash(this['password'], 10);
        this['password'] = hashed;
        return next();
    } catch (err) {
        return next(err);
    }
});


// // post-delete hook. This hook will automatically remove the specified PROGRAM, ROLE or GROUP from all fields in users collection that reference to them.
// const userModel = mongoose.model<any>('User', UserSchema);

// UserSchema.post('deleteOne', async function (doc) {
//     if (doc) {
//         const deletedRoleId = doc._id;

//         // Remove the deleted privilege from all roles
//         await userModel.updateMany(
//             { role: deletedRoleId },
//             { $pull: { role: deletedRoleId } }
//         );
//     }
// });


// // // post-update hook. this hook will automatically update the specified PROGRAM, ROLE or GROUP from all fields in users collection that reference to them.
// // // post-update hook execute after document update but pre-update hook execute before.
// UserSchema.post('updateOne', async function (doc) {
//     if (doc) {
//         const updatedRoleId = doc._id;

//         // Remove the deleted privilege from all roles
//         await userModel.updateMany(
//             { role: updatedRoleId },
//             { $set: { role: updatedRoleId } }
//         );
//     }
// });