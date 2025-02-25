import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_KEY
        });
    }

    async validate(payload: any) {
        const authenticatedUser = await this.userService.findOne(payload.sub);
        // console.log("***************JWTStrategy Validate Invoked******************")
        // console.log(authenticatedUser);
        // console.log("***************JWTStrategy Validate Invoked******************")

        return authenticatedUser
    }
}