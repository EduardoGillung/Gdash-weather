# Documentação de Autenticação - Weather App

## Visão Geral

Sistema de autenticação JWT (JSON Web Token) implementado com NestJS no backend e React no frontend.

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
├─────────────────────────────────────────────────────────────┤
│  LoginPage.tsx                                               │
│    ↓ (submit form)                                          │
│  auth.service.ts                                             │
│    ↓ (HTTP request)                                         │
│  api/client.ts (Axios interceptor)                          │
│    ↓ (adds Bearer token)                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
├─────────────────────────────────────────────────────────────┤
│  auth.controller.ts                                          │
│    ↓ (validates DTO)                                        │
│  auth.service.ts                                             │
│    ↓ (checks DB + bcrypt)                                   │
│  user.schema.ts (MongoDB)                                    │
│    ↓ (generates JWT)                                        │
│  jwt.strategy.ts (validates token)                          │
│    ↓ (protects routes)                                      │
│  jwt-auth.guard.ts                                           │
└─────────────────────────────────────────────────────────────┘
```

## Fluxo de Autenticação

### 1. Registro de Usuário

**Frontend:**

```typescript
// client/src/pages/LoginPage.tsx
const response = await authService.register({
  name: "João Silva",
  email: "joao@example.com",
  password: "senha123",
});
```

**Backend:**

```typescript
// api/src/auth/auth.controller.ts
@Post('register')
register(@Body() registerDto: RegisterDto)

// api/src/auth/auth.service.ts
1. Verifica se email já existe
2. Hash da senha com bcrypt (10 rounds)
3. Salva usuário no MongoDB
4. Gera JWT token
5. Retorna { access_token, user }
```

**Resposta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

### 2. Login

**Frontend:**

```typescript
// client/src/pages/LoginPage.tsx
const response = await authService.login({
  email: "joao@example.com",
  password: "senha123",
});
```

**Backend:**

```typescript
// api/src/auth/auth.service.ts
1. Busca usuário por email
2. Compara senha com bcrypt.compare()
3. Se válido, gera JWT token
4. Retorna { access_token, user }
```

### 3. Armazenamento do Token

**Frontend:**

```typescript
// client/src/services/auth.service.ts
saveAuth(data: AuthResponse) {
  localStorage.setItem('token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
}
```

⚠️ **ATENÇÃO:** localStorage é vulnerável a XSS attacks.

### 4. Requisições Autenticadas

**Frontend:**

```typescript
// client/src/api/client.ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Backend:**

```typescript
// api/src/auth/strategies/jwt.strategy.ts
1. Extrai token do header Authorization
2. Valida assinatura do JWT
3. Busca usuário no banco
4. Anexa usuário ao request
```

### 5. Proteção de Rotas

**Backend:**

```typescript
// Exemplo de rota protegida
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user; // Usuário autenticado
}
```

## Estrutura de Arquivos

### Backend (api/src/auth/)

```
auth/
├── dto/
│   ├── login.dto.ts          # Validação de login
│   └── register.dto.ts       # Validação de registro
├── guards/
│   └── jwt-auth.guard.ts     # Guard para proteger rotas
├── schemas/
│   └── user.schema.ts        # Schema MongoDB do usuário
├── strategies/
│   └── jwt.strategy.ts       # Estratégia Passport JWT
├── auth.controller.ts        # Endpoints /auth/login e /auth/register
├── auth.module.ts            # Configuração do módulo
└── auth.service.ts           # Lógica de negócio
```

### Frontend (client/src/)

```
src/
├── api/
│   └── client.ts             # Axios client com interceptor
├── services/
│   └── auth.service.ts       # Serviço de autenticação
├── pages/
│   ├── LoginPage.tsx         # Tela de login/registro
│   └── DashboardPage.tsx     # Tela protegida
└── App.tsx                   # Controle de autenticação
```

## Detalhes Técnicos

### JWT Token

**Payload:**

```json
{
  "sub": "507f1f77bcf86cd799439011", // User ID
  "email": "joao@example.com",
  "iat": 1638360000, // Issued at
  "exp": 1638964800 // Expires (7 dias)
}
```

**Configuração:**

```typescript
// api/src/auth/auth.module.ts
JwtModule.registerAsync({
  useFactory: (config: ConfigService) => ({
    secret: config.get<string>("JWT_SECRET"),
    signOptions: { expiresIn: "7d" },
  }),
});
```

### Hash de Senha

```typescript
// api/src/auth/auth.service.ts
const hashedPassword = await bcrypt.hash(password, 10);
// 10 = salt rounds (custo computacional)
```

### Validação de Dados

```typescript
// api/src/auth/dto/register.dto.ts
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

## Segurança - Pontos de Atenção

### ⚠️ VULNERABILIDADES ATUAIS

1. **localStorage para tokens**

   - Vulnerável a XSS (Cross-Site Scripting)
   - Qualquer script malicioso pode acessar

2. **Sem refresh token**

   - Token expira em 7 dias
   - Usuário precisa fazer login novamente

3. **Sem rate limiting**

   - Vulnerável a brute force attacks

4. **CORS aberto**

   - Aceita requisições de qualquer origem em dev

5. **JWT_SECRET no .env**
   - Deve ser forte e único em produção

### ✅ MELHORIAS RECOMENDADAS

#### 1. Usar httpOnly Cookies (CRÍTICO)

**Backend:**

```typescript
// api/src/auth/auth.controller.ts
@Post('login')
async login(@Body() loginDto: LoginDto, @Res() res: Response) {
  const result = await this.authService.login(loginDto);

  res.cookie('access_token', result.access_token, {
    httpOnly: true,      // Não acessível via JavaScript
    secure: true,        // Apenas HTTPS
    sameSite: 'strict',  // Proteção CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  });

  return res.json({ user: result.user });
}
```

**Frontend:**

```typescript
// client/src/api/client.ts
const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // Envia cookies
});
```

#### 2. Implementar Refresh Token

**Schema:**

```typescript
// api/src/auth/schemas/refresh-token.schema.ts
@Schema()
export class RefreshToken {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;
}
```

**Fluxo:**

```
1. Login retorna: access_token (15min) + refresh_token (7 dias)
2. Access token expira
3. Frontend usa refresh_token para obter novo access_token
4. Refresh token é rotacionado (novo token gerado)
```

#### 3. Rate Limiting

```bash
npm install @nestjs/throttler
```

```typescript
// api/src/app.module.ts
ThrottlerModule.forRoot({
  ttl: 60,      // 60 segundos
  limit: 10,    // 10 requisições
}),

// api/src/auth/auth.controller.ts
@Throttle(5, 60) // 5 tentativas por minuto
@Post('login')
```

#### 4. Validação de Email

```bash
npm install nodemailer
```

```typescript
// Enviar email de confirmação no registro
// Usuário só pode fazer login após confirmar email
```

#### 5. Two-Factor Authentication (2FA)

```bash
npm install speakeasy qrcode
```

```typescript
// Gerar QR code para Google Authenticator
// Validar código 6 dígitos no login
```

#### 6. Logout Seguro

**Backend:**

```typescript
// Blacklist de tokens (Redis)
@Post('logout')
async logout(@Request() req) {
  const token = req.headers.authorization.split(' ')[1];
  await this.redisService.set(
    `blacklist:${token}`,
    'true',
    'EX',
    7 * 24 * 60 * 60
  );
}
```

#### 7. Auditoria de Segurança

```typescript
// api/src/auth/schemas/login-attempt.schema.ts
@Schema()
export class LoginAttempt {
  @Prop() email: string;
  @Prop() ip: string;
  @Prop() userAgent: string;
  @Prop() success: boolean;
  @Prop() timestamp: Date;
}
```

#### 8. Senha Forte

```typescript
// api/src/auth/dto/register.dto.ts
@Matches(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  { message: 'Senha deve ter 8+ caracteres, maiúscula, minúscula, número e símbolo' }
)
password: string;
```

#### 9. HTTPS Obrigatório

```typescript
// api/src/main.ts
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect("https://" + req.headers.host + req.url);
    }
    next();
  });
}
```

#### 10. Helmet (Security Headers)

```bash
npm install helmet
```

```typescript
// api/src/main.ts
import helmet from "helmet";
app.use(helmet());
```

## Variáveis de Ambiente

### Desenvolvimento

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
MONGODB_URI=mongodb://admin:admin123@localhost:27017/weather?authSource=admin
```

### Produção

```env
JWT_SECRET=<gerar com: openssl rand -base64 64>
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
MONGODB_URI=<MongoDB Atlas ou servidor seguro>
REDIS_URL=<Redis para blacklist>
NODE_ENV=production
```

## Testes de Segurança

### 1. Testar Token Expirado

```bash
# Gerar token com expiração curta
# Aguardar expiração
# Tentar acessar rota protegida
# Deve retornar 401 Unauthorized
```

### 2. Testar Token Inválido

```bash
curl -H "Authorization: Bearer token-invalido" \
  http://localhost:3000/profile
# Deve retornar 401
```

### 3. Testar Senha Fraca

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123"}'
# Deve retornar 400 (validação falha)
```

### 4. Testar SQL Injection

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com OR 1=1","password":"any"}'
# Mongoose protege automaticamente
```

## Checklist de Produção

- [ ] JWT_SECRET forte e único
- [ ] HTTPS obrigatório
- [ ] httpOnly cookies
- [ ] Refresh token implementado
- [ ] Rate limiting ativo
- [ ] Validação de email
- [ ] Auditoria de login
- [ ] Helmet configurado
- [ ] CORS restrito
- [ ] Senha forte obrigatória
- [ ] Backup do banco de dados
- [ ] Monitoramento de tentativas de login
- [ ] Logs de segurança
- [ ] Testes de penetração realizados

## Recursos Adicionais

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
- [bcrypt Best Practices](https://github.com/kelektiv/node.bcrypt.js#security-issues-and-concerns)

## Contato para Dúvidas

Para questões de segurança críticas, consulte um especialista em segurança antes de ir para produção.
