# Weather App - Sistema de Autenticação

Sistema completo de autenticação com JWT implementado usando NestJS (backend) e React (frontend).

## Estrutura do Projeto

```
├── api/                    # Backend NestJS
│   └── src/
│       ├── auth/          # Módulo de autenticação
│       │   ├── dto/       # Data Transfer Objects
│       │   ├── schemas/   # Mongoose schemas
│       │   ├── strategies/# Passport strategies
│       │   └── guards/    # Auth guards
│       └── health/        # Health check
├── client/                # Frontend React
│   └── src/
│       ├── components/    # Componentes UI (shadcn/ui)
│       ├── pages/         # Páginas (Login, Dashboard)
│       ├── services/      # Serviços (auth)
│       └── lib/           # Utilitários
└── docker-compose.yml     # MongoDB + RabbitMQ
```

## Tecnologias

### Backend

- NestJS 11.x
- MongoDB + Mongoose
- JWT Authentication
- Passport.js
- bcrypt
- class-validator

### Frontend

- React 19.x
- TypeScript
- Vite
- shadcn/ui
- Tailwind CSS 4.x
- Axios

## Configuração

### 1. Iniciar Infraestrutura

```bash
docker-compose up -d
```

### 2. Backend

```bash
cd api
npm install
npm run start:dev
```

O backend estará rodando em `http://localhost:3000`

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## Variáveis de Ambiente

### Backend (api/.env)

```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/weather?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
PORT=3000
```

### Frontend (client/.env)

```env
VITE_API_URL=http://localhost:3000
```

## Endpoints da API

### Autenticação

**POST** `/auth/register`

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**POST** `/auth/login`

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta de Sucesso:**

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

## Funcionalidades Implementadas

- ✅ Registro de usuário com validação
- ✅ Login com JWT
- ✅ Hash de senha com bcrypt
- ✅ Proteção de rotas com JWT Guard
- ✅ Validação de dados com class-validator
- ✅ Interface de login/registro responsiva
- ✅ Persistência de autenticação (localStorage)
- ✅ Dashboard protegido
- ✅ Logout

## Como Usar

1. Acesse `http://localhost:5173`
2. Crie uma conta clicando em "Criar conta"
3. Preencha nome, email e senha (mínimo 6 caracteres)
4. Após o registro, você será automaticamente autenticado
5. Para fazer logout, clique no botão "Sair" no header

## Comandos Úteis

### Backend

```bash
npm run build          # Build para produção
npm run start:prod     # Rodar em produção
npm run lint           # Lint do código
npm run format         # Formatar código
```

### Frontend

```bash
npm run build          # Build para produção
npm run preview        # Preview do build
npm run lint           # Lint do código
```

## Segurança

- Senhas são hasheadas com bcrypt (10 rounds)
- JWT expira em 7 dias
- Validação de dados no backend
- CORS configurado
- Tokens armazenados no localStorage (considere usar httpOnly cookies em produção)
