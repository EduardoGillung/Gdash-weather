import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './schemas/user.schema';
import { LoginAttempt } from './schemas/login-attempt.schema';

export interface LoginContext {
  ip: string;
  userAgent: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(LoginAttempt.name)
    private loginAttemptModel: Model<LoginAttempt>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(registerDto: RegisterDto, context: LoginContext) {
    const existingUser = await this.userModel.findOne({
      email: registerDto.email,
    });

    if (existingUser) {
      // Log tentativa de registro com email existente
      await this.logLoginAttempt({
        email: registerDto.email,
        ip: context.ip,
        userAgent: context.userAgent,
        success: false,
        failureReason: 'Email already exists',
      });

      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userModel.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Log registro bem-sucedido
    await this.logLoginAttempt({
      email: user.email,
      ip: context.ip,
      userAgent: context.userAgent,
      success: true,
      userId: user._id.toString(),
    });

    this.logger.log(`Novo usuário registrado: ${user.email} (IP: ${context.ip})`);

    return this.generateToken(user);
  }

  async login(loginDto: LoginDto, context: LoginContext) {
    const user = await this.userModel.findOne({ email: loginDto.email });

    if (!user) {
      // Log tentativa de login com email inexistente
      await this.logLoginAttempt({
        email: loginDto.email,
        ip: context.ip,
        userAgent: context.userAgent,
        success: false,
        failureReason: 'User not found',
      });

      this.logger.warn(
        `Tentativa de login com email inexistente: ${loginDto.email} (IP: ${context.ip})`,
      );

      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      // Log tentativa de login com senha incorreta
      await this.logLoginAttempt({
        email: loginDto.email,
        ip: context.ip,
        userAgent: context.userAgent,
        success: false,
        failureReason: 'Invalid password',
        userId: user._id.toString(),
      });

      this.logger.warn(
        `Tentativa de login com senha incorreta: ${loginDto.email} (IP: ${context.ip})`,
      );

      throw new UnauthorizedException('Invalid credentials');
    }

    // Log login bem-sucedido
    await this.logLoginAttempt({
      email: user.email,
      ip: context.ip,
      userAgent: context.userAgent,
      success: true,
      userId: user._id.toString(),
    });

    this.logger.log(`Login bem-sucedido: ${user.email} (IP: ${context.ip})`);

    return this.generateToken(user);
  }

  private async logLoginAttempt(data: {
    email: string;
    ip: string;
    userAgent: string;
    success: boolean;
    failureReason?: string;
    userId?: string;
  }) {
    try {
      await this.loginAttemptModel.create(data);
    } catch (error) {
      this.logger.error('Erro ao registrar tentativa de login', error);
    }
  }

  private generateToken(user: User) {
    const payload = { sub: user._id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
