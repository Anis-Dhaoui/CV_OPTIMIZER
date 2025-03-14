import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        //  check user authenticate with custom column 'email'
        // super({ usernameField: 'username' });
        super();
    }

    async validate(username: string, password: string): Promise<any> {

        // console.log("***************Local Strategy Invoked***************")
        // console.log(username);
        // console.log(password);
        // console.log("***************Local Strategy Invoked***************")

        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}