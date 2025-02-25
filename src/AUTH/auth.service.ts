
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { IUser } from 'src/user/entities/user.entity';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UserService) { }

  //$$$$$$$$$$$$$$$$$$// CHECK IF USER EXISTS WHEN TRYING TO AUTHENTICATE //$$$$$$$$$$$$$$$$$$//
  async getUser(query: object): Promise<IUser> {
    // console.log("***************AuthService getUser Invoked*****************")
    // console.log(query);
    // console.log("***************AuthService getUser Invoked*****************")

    return this.userService.userModel.findOne(query, '+password');
  }

  //$$$$$$$$$$$$$$$$$$// VALIDATE USERNAME AND PASSWORD //$$$$$$$$$$$$$$$$$$//
  async validateUser(username: string, password: string): Promise<any> {
    Logger.log('ValidateUser(username, password) METHOD INVOKDED');

    const user = await this.getUser({ username });
    if (!user) {
      throw new HttpException('No account belongs to this username', HttpStatus.NOT_FOUND);
    }

    const passwordValid = await bcrypt.compare(password, user.password)
    Logger.warn(passwordValid);

    if (!passwordValid) {
      throw new HttpException('Incorrect password!', HttpStatus.UNAUTHORIZED);
    }

    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  //$$$$$$$$$$$$$$$$$$// SIGNIN //$$$$$$$$$$$$$$$$$$//
  async login(user: IUser | any) {
    // console.log('**********AuthService Login Invoked**************');
    // console.log(user);
    // console.log('**********AuthService Login Invoked**************');
    const authenticatedUser = await this.userService.findOne(user._id);
    // console.log(authenticatedUser)
    const payload = { sub: user._id };
    return {
      user: authenticatedUser,
      access_token: this.jwtService.sign(payload),
    };
  }
}
