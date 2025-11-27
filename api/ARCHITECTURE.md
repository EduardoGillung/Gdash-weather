# Arquitetura do Backend NestJS

## Estrutura do Projeto

```
api/
├── src/
│   ├── main.ts              # Ponto de entrada da aplicação
│   ├── app.module.ts        # Módulo raiz que organiza toda a aplicação
│   ├── app.controller.ts    # Controller principal com rotas básicas
│   ├── app.service.ts       # Service com lógica de negócio básica
│   └── health/              # Módulo de health check
│       ├── health.module.ts
│       └── health.controller.ts
├── test/                    # Testes end-to-end (E2E)
└── node_modules/            # Dependências instaladas
```

## Conceitos Fundamentais do NestJS

### 1. Módulos (@Module)

**O que são:** Organizadores da aplicação. Cada módulo agrupa controllers, services e outros providers relacionados.

**app.module.ts** - Módulo raiz que importa todos os outros módulos:

- `imports`: Outros módulos que este módulo precisa (ConfigModule, MongooseModule, HealthModule)
- `controllers`: Controllers que pertencem a este módulo
- `providers`: Services e outros providers disponíveis neste módulo

**Comunicação:** Módulos se comunicam através de imports/exports. Se um módulo exporta um service, outros módulos podem importá-lo e usá-lo.

### 2. Controllers (@Controller)

**O que são:** Responsáveis por receber requisições HTTP e retornar respostas. Definem as rotas da API.

**app.controller.ts** - Controller principal:

```typescript
@Controller() // Define que é um controller (rota base: /)
export class AppController {
  constructor(private appService: AppService) {} // Injeta o service

  @Get() // Define rota GET /
  getHello(): string {
    return this.appService.getHello(); // Chama o service
  }
}
```

**health.controller.ts** - Controller de health check:

```typescript
@Controller('health')      // Rota base: /health
export class HealthController {
  @Get()                   // GET /health
  @Get('db')               // GET /health/db
}
```

**Comunicação:** Controllers recebem requisições → chamam Services → retornam respostas.

### 3. Services (@Injectable)

**O que são:** Contêm a lógica de negócio. Podem ser injetados em controllers ou outros services.

**app.service.ts** - Service básico:

```typescript
@Injectable() // Permite que seja injetado via DI
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

**Comunicação:** Services são injetados via construtor usando Dependency Injection (DI).

### 4. Providers

**O que são:** Qualquer classe que pode ser injetada. Services são um tipo de provider.

**Tipos comuns:**

- Services (lógica de negócio)
- Repositories (acesso a dados)
- Factories (criação de objetos)
- Helpers (funções auxiliares)

## Fluxo de Comunicação

```
Requisição HTTP
    ↓
Controller (recebe e valida)
    ↓
Service (processa lógica)
    ↓
Repository/Database (persiste dados)
    ↓
Service (retorna resultado)
    ↓
Controller (formata resposta)
    ↓
Resposta HTTP
```

## Dependency Injection (DI)

O NestJS usa DI para gerenciar dependências automaticamente:

```typescript
// O NestJS cria e injeta automaticamente
constructor(
  private appService: AppService,           // Service
  private connection: Connection,           // Conexão MongoDB
  @InjectConnection() private conn: Connection  // Injeção explícita
) {}
```

## Configurações Importantes

### main.ts - Inicialização

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Cria a aplicação

  app.useGlobalPipes(
    new ValidationPipe({
      // Validação global
      whitelist: true, // Remove campos não definidos no DTO
      forbidNonWhitelisted: true, // Retorna erro se houver campos extras
      transform: true, // Transforma tipos automaticamente
    }),
  );

  await app.listen(3000); // Inicia o servidor
}
```

### app.module.ts - Configuração do Módulo Raiz

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({        // Carrega variáveis de ambiente (.env)
      isGlobal: true,             // Disponível em todos os módulos
    }),
    MongooseModule.forRootAsync({ // Conexão MongoDB assíncrona
      inject: [ConfigService],    // Injeta ConfigService
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),  // Pega URI do .env
      }),
    }),
    HealthModule,                 // Importa módulo de health check
  ],
  controllers: [AppController],
  providers: [AppService],
})
```

## Pasta test/

### Tipos de Teste

**1. Unit Tests (.spec.ts)**

- Testam componentes isoladamente
- Localizados junto aos arquivos (ex: app.controller.spec.ts)
- Usam mocks para dependências

**2. E2E Tests (test/)**

- Testam a aplicação completa
- Simulam requisições HTTP reais
- Testam integração entre componentes

**app.e2e-spec.ts** - Teste end-to-end:

```typescript
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule], // Importa módulo completo
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()) // Faz requisição HTTP
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
```

## Docker Compose

### MongoDB Container

```yaml
mongodb:
  image: mongo:7 # Imagem oficial do MongoDB
  ports:
    - '27017:27017' # Porta exposta
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin # Usuário root
    MONGO_INITDB_ROOT_PASSWORD: admin123 # Senha root
  volumes:
    - mongodb_data:/data/db # Persiste dados
```

**Conexão:** A aplicação conecta via `MONGODB_URI` no .env usando as credenciais definidas.

### RabbitMQ Container

```yaml
rabbitmq:
  image: rabbitmq:3-management # Com interface de gerenciamento
  ports:
    - '5672:5672' # Porta AMQP (mensageria)
    - '15672:15672' # Porta Management UI
```

**Acesso:** Management UI disponível em http://localhost:15672 (admin/admin123)

## Variáveis de Ambiente (.env)

```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/weather?authSource=admin
# Formato: mongodb://[usuario]:[senha]@[host]:[porta]/[database]?authSource=[db_auth]

JWT_SECRET=your-super-secret-jwt-key-change-in-production
# Chave secreta para assinar tokens JWT

JWT_EXPIRATION=7d
# Tempo de expiração do token (7 dias)

PORT=3000
# Porta onde a aplicação roda
```

## Decorators Principais

| Decorator       | Uso                      | Exemplo                                |
| --------------- | ------------------------ | -------------------------------------- |
| `@Module()`     | Define um módulo         | `@Module({ imports: [...] })`          |
| `@Controller()` | Define um controller     | `@Controller('users')`                 |
| `@Injectable()` | Define um provider       | `@Injectable()`                        |
| `@Get()`        | Rota GET                 | `@Get(':id')`                          |
| `@Post()`       | Rota POST                | `@Post()`                              |
| `@Put()`        | Rota PUT                 | `@Put(':id')`                          |
| `@Delete()`     | Rota DELETE              | `@Delete(':id')`                       |
| `@Body()`       | Pega corpo da requisição | `create(@Body() dto: CreateDto)`       |
| `@Param()`      | Pega parâmetro da URL    | `findOne(@Param('id') id: string)`     |
| `@Query()`      | Pega query string        | `findAll(@Query('page') page: number)` |

## Próximos Passos

Para criar um novo recurso (ex: usuários), você criaria:

1. **Module** - `users.module.ts` (organiza tudo)
2. **Controller** - `users.controller.ts` (rotas HTTP)
3. **Service** - `users.service.ts` (lógica de negócio)
4. **DTO** - `create-user.dto.ts` (validação de dados)
5. **Schema** - `user.schema.ts` (modelo MongoDB)
6. **Tests** - `users.controller.spec.ts` e `users.service.spec.ts`

Depois importaria o `UsersModule` no `AppModule`.
