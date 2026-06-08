import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../../prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

const BCRYPT_ROUNDS = 12

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (existing) throw new ConflictException('Email already in use')

    const hashed = await bcrypt.hash(dto.password, BCRYPT_ROUNDS)
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashed, username: dto.username },
    })

    return this._issueTokens(user.id, user.email, user.subscriptionTier)
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user?.password) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    return this._issueTokens(user.id, user.email, user.subscriptionTier)
  }

  async refresh(rawRefreshToken: string) {
    try {
      const payload = this.jwt.verify<{ sub: string; email: string; tier: string }>(
        rawRefreshToken,
        { secret: this._refreshSecret() },
      )
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } })
      if (!user) throw new UnauthorizedException()
      return this._issueTokens(user.id, user.email, user.subscriptionTier)
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }
  }

  private _issueTokens(sub: string, email: string, tier: string) {
    const payload = { sub, email, tier }
    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' })
    const refreshToken = this.jwt.sign(payload, {
      secret: this._refreshSecret(),
      expiresIn: '7d',
    })
    return { accessToken, refreshToken }
  }

  private _refreshSecret() {
    return this.config.get<string>('JWT_REFRESH_SECRET', 'refresh-secret-change-me')
  }
}
