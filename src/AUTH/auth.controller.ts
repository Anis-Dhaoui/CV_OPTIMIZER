import { LocalAuthGuard } from './guards/local-auth.guard';
import { Controller, Post, Body, HttpStatus, Res, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Req() req) {
    // console.log("***************Auth.controller login Invoked*****************")
    // console.log(req.user)
    // console.log("***************Auth.controller login Invoked*****************")
    return this.authService.login(req.user);
  }


  @Post('/signup')
  async create(@Res() res, @Body() signupDto: SignupDto) {
    try {
      const newUser = await this.userService.signup(signupDto);
      return res.status(HttpStatus.CREATED).json({
        statusCode: 200,
        message: 'User created successfully',
        createdUser: newUser
      });
    } catch (error) {
      if (error && error.code == 11000) {
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: 409,
          message: `${Object.keys(error.keyPattern)[0]}: "${Object.values(error.keyValue)[0]}" is already exist`,
        })
      }
      return res.status(error.status).json(error.response);
    }
  }

}
