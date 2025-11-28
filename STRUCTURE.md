# Estrutura do Projeto

## Arquitetura: Feature-Based / Domain-Based

```
gdash-weather/
├── api/                           # Backend NestJS
│   └── src/
│       ├── auth/                  # Feature: Autenticação
│       │   ├── dto/               # Data Transfer Objects
│       │   │   ├── login.dto.ts
│       │   │   └── register.dto.ts
│       │   ├── guards/            # Guards de autenticação
│       │   │   └── jwt-auth.guard.ts
│       │   ├── schemas/           # Mongoose schemas
│       │   │   └── user.schema.ts
│       │   ├── strategies/        # Passport strategies
│       │   │   └── jwt.strategy.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.module.ts
│       │   └── auth.service.ts
│       ├── health/                # Feature: Health check
│       │   ├── health.controller.ts
│       │   └── health.module.ts
│       ├── app.module.ts          # Módulo raiz
│       └── main.ts                # Entry point
│
├── client/                        # Frontend React
│   └── src/
│       ├── api/                   # Configuração de API clients
│       │   └── client.ts          # Axios client configurado
│       ├── assets/                # Assets estáticos
│       │   └── react.svg
│       ├── components/            # Componentes reutilizáveis
│       │   └── ui/                # Componentes UI (shadcn/ui)
│       │       ├── button.tsx
│       │       ├── card.tsx
│       │       ├── input.tsx
│       │       └── label.tsx
│       ├── hooks/                 # Custom hooks (vazio por enquanto)
│       ├── lib/                   # Utilitários
│       │   └── utils.ts           # Funções auxiliares (cn, etc)
│       ├── pages/                 # Páginas da aplicação
│       │   ├── DashboardPage.tsx
│       │   └── LoginPage.tsx
│       ├── services/              # Serviços de negócio
│       │   └── auth.service.ts    # Serviço de autenticação
│       ├── App.tsx                # Componente raiz
│       ├── index.css              # Estilos globais + Tailwind
│       └── main.tsx               # Entry point
│
├── docker-compose.yml             # MongoDB + RabbitMQ
├── README.md                      # Documentação principal
├── QUICKSTART.md                  # Guia rápido
└── STRUCTURE.md                   # Este arquivo
```

## Convenções de Organização

### Backend (api/)

- **Feature-based**: Cada feature tem sua própria pasta (auth, health, etc)
- **Dentro de cada feature**:
  - `dto/` - Validação de entrada/saída
  - `schemas/` - Modelos do banco de dados
  - `guards/` - Proteção de rotas
  - `strategies/` - Estratégias de autenticação
  - `*.controller.ts` - Endpoints HTTP
  - `*.service.ts` - Lógica de negócio
  - `*.module.ts` - Configuração do módulo

### Frontend (client/)

- **api/** - Configuração de clientes HTTP (Axios)
- **components/** - Componentes reutilizáveis
  - `ui/` - Componentes de UI do shadcn/ui
- **hooks/** - Custom React hooks
- **lib/** - Utilitários e helpers
- **pages/** - Componentes de página (rotas)
- **services/** - Lógica de negócio e comunicação com API

## Princípios Seguidos

1. ✅ Separação clara entre features
2. ✅ Cada pasta tem responsabilidade única
3. ✅ Componentes UI isolados em `components/ui/`
4. ✅ Lógica de API em `services/`
5. ✅ Configuração de cliente HTTP em `api/`
6. ✅ Utilitários genéricos em `lib/`
7. ✅ Sem código duplicado ou desnecessário
8. ✅ TypeScript em todo o projeto
