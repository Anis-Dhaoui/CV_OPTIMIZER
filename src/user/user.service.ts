import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') public userModel: Model<IUser>) { }

  async signup(createUserDto: CreateUserDto): Promise<IUser> {
    const newUser: any = await new this.userModel(createUserDto).save();
    return this.findOne(newUser._id);
  }




  async findOne(id: Types.ObjectId): Promise<IUser> {
    const user = await this.userModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) } // Match based on the provided id
      },
      {
        $lookup: {
          from: 'resumes',
          localField: 'resume',
          foreignField: '_id',
          as: 'resume'
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          fullName: 1,
          email: 1,
          mobile: 1,
          program: 1,
        }
      }
    ]);

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user[0];
  }









  // async findAll(rights: any, userRole: any): Promise<IUser[]> {
  //   const projectFields: any = { _id: 1 }; // Always include the _id field
  //   rights.forEach(field => {
  //     switch (field) {
  //       case 'username':
  //       case 'password':
  //       case 'fullName':
  //       case 'email':
  //       case 'mobile':
  //       case 'program':
  //         projectFields[field] = 1;
  //         break;

  //       default:
  //         break;
  //     }
  //   });
  //   const pipeline: any[] = [
  //     // { $sort: { rank: -1 } },
  //     {
  //       $lookup: { // Populate process
  //         from: 'programs', // Represent roles collection
  //         localField: 'program', // Represent the role field in this users collection
  //         foreignField: '_id', // Represent the PK in roles collection which is FK in users collection
  //         as: 'program' // This specifies the name of the new array field to add to the input documents.
  //       }
  //     },
  //     {
  //       $project: projectFields
  //     }
  //   ]

  //   // Conditionally add the $match stage if userRole is not 'ADMIN'
  //   if (userRole !== 'ADMIN') {
  //     pipeline.unshift({
  //       $match: {
  //         rank: { $ne: 0 }
  //       }
  //     });
  //   }

  //   // Add $addFields stage to create a custom sort field
  //   pipeline.unshift({
  //     $addFields: {
  //       sortRank: {
  //         $cond: {
  //           if: { $eq: ["$rank", 0] },
  //           then: 0,
  //           else: 1
  //         }
  //       }
  //     }
  //   });

  //   // Add $sort stage to sort by the custom sort field and then by rank
  //   pipeline.unshift({
  //     $sort: {
  //       sortRank: 1,
  //       rank: -1
  //     }
  //   });

  //   // Log the pipeline for debugging
  //   // console.log('Pipeline:', JSON.stringify(pipeline, null, 2));

  //   const userData = await this.userModel.aggregate(pipeline);

  //   if (!userData || userData.length == 0) {
  //     throw new NotFoundException('User data not found');
  //   }
  //   return userData;
  // }









  // async update(id: string, updateUserDto: UpdateUserDto, rights: any): Promise<IUser> {
  //   //Filter UpdateUserDto object according to user's privileges (Security stuff)
  //   const selectedFields = rights.reduce((acc, field) => {
  //     if (updateUserDto.hasOwnProperty(field)) {
  //       acc[field] = updateUserDto[field];
  //     }
  //     return acc;
  //   }, {});

  //   const user = (await this.userModel.findByIdAndUpdate(id, selectedFields, { new: true })).populate(['role', 'program', 'group']);
  //   if (!user) {
  //     throw new NotFoundException(`User #${id} not found`);
  //   }
  //   return user;
  // }









  // async remove(id: string): Promise<IUser> {
  //   const deletedUser = await this.userModel.findByIdAndDelete(id);
  //   if (!deletedUser) {
  //     throw new NotFoundException(`User #${id} not found`);
  //   }
  //   return deletedUser;
  // }
}
