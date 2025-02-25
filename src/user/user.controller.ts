import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpStatus, Res, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/AUTH/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }







  // @UseGuards(JwtAuthGuard)
  // @Get('/fetch')
  // async findAll(@Res() res, @Req() req) {
  //   try {
  //     const getRole = await this.roleService.findOne(req.user.role._id)

  //     const users = await this.userService.findAll(getRole.rights, getRole.roleName);
  //     return res.status(HttpStatus.OK).json({
  //       message: 'Users fetched successfully',
  //       users: users
  //     })
  //   } catch (error) {
  //     return res.status(error.status).json(error.response);
  //   }
  // }







  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Get('fetch/:id')
  // async findOne(@Res() res, @Param('id') id: Types.ObjectId) {
  //   try {
  //     const user = await this.userService.findOne(id);

  //     return res.status(HttpStatus.OK).json({
  //       message: `User ${user.fullName} fetched successfully`,
  //       user: user
  //     })
  //   } catch (error) {
  //     return res.status(error.status).json(error.response);
  //   }
  // }







  // @Roles('HR_EDITOR', 'ADMIN', 'IT_EDITOR')
  // @UseGuards(JwtAuthGuard)
  // @Put('edit/:id')
  // async update(@Req() req, @Res() res, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {

  //   //Getting the privileges of the user who is willing to update
  //   const getRole = await this.roleService.findOne(req.user.role._id);

  //   try {
  //     const updatedUser = await this.userService.update(id, updateUserDto, getRole.rights);
  //     return res.status(HttpStatus.OK).json({
  //       message: `User "${updatedUser.username}" updated successfully`,
  //       updatedUser: updatedUser
  //     })

  //   } catch (error) {
  //     if (error && error.code == 11000) {
  //       return res.status(HttpStatus.CONFLICT).json({
  //         statusCode: 409,
  //         message: `${Object.keys(error.keyPattern)[0]}: "${Object.values(error.keyValue)[0]}" is already exist`,
  //       })
  //     }
  //     return res.status(error.status).json(error.response);
  //   }
  // }




  // @UseGuards(JwtAuthGuard)
  // @Delete('remove/:id')
  // async remove(@Req() req, @Res() res, @Param('id') id: string) {
  //   try {
  //     if (!req.user._id.equals(id)) {

  //       const deletedUser = await this.userService.remove(id);
  //       return res.status(HttpStatus.OK).json({
  //         message: `User "${deletedUser.username}" deleted successfully`,
  //         deletedUser: deletedUser
  //       })
  //     } else {
  //       throw new UnauthorizedException('Cannot remove your own account, use different account');
  //     }
  //   } catch (error) {
  //     return res.status(error.status).json(error.response);
  //   }
  // }
}
