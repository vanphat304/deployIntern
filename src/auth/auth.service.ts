import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, Student } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { genSalt, hash, compare } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './authDto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signToken(user: Student): Promise<{ access_token: string }> {
    const secret: string = this.config.get('JWT_SECRET');
    const { passwordHashed, ...userSign } = user;
    return {
      ...userSign,
      access_token: await this.jwtService.signAsync(userSign, {
        expiresIn: '1h',
        secret,
      }),
    };
  }

  async decodedToken(token: string): Promise<{ id: string }> {
    const secret: string = this.config.get('JWT_SECRET');
    const data = this.jwtService.verifyAsync(token, {
      secret,
    });

    return data;
  }

  async scriptPassword(password: string): Promise<string> {
    const salt: string = await genSalt(10);
    const hashed: string = await hash(password, salt);

    return hashed;
  }

  async comparePassword(password: string, passwordHashed: string): Promise<boolean> {
    const isMatch: boolean = await compare(password, passwordHashed);
    return isMatch;
  }

  async register(dto: AuthDto) {
    try {
      const { email, password, firstName, identifierStudent, lastName } = dto;
      const passwordHashed = await this.scriptPassword(password);

      const userRegister: Student = await this.prisma.student.create({
        data: {
          email,
          passwordHashed,
          firstName,
          identifierStudent,
          lastName,
        },
      });

      return this.signToken(userRegister);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if ((error.code = 'P2002')) {
          throw new HttpException(
            `Unique constraint failed on the ${error?.meta?.target?.toString()}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw error;
    }
  }

  async signIn(dto: Pick<AuthDto, 'email' | 'password'>) {
    const { email, password } = dto;

    const user: Student = await this.prisma.student.findFirst({
      where: {
        OR: [{ email }],
      },
    });
    if (!user) {
      throw new HttpException('Tài khoản mật khẩu không chính xác', HttpStatus.BAD_REQUEST);
    }
    const isPasswordMatch: boolean = await this.comparePassword(password, user.passwordHashed);

    if (!isPasswordMatch) {
      throw new HttpException('Tài khoản mật khẩu không chính xác', HttpStatus.BAD_GATEWAY);
    }
    return this.signToken(user);
  }
}
