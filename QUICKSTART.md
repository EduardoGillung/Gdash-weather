# Guia Rápido - Testar Autenticação

## Passo a Passo para Testar

### 1. Iniciar MongoDB e RabbitMQ

```bash
docker-compose up -d
```

### 2. Iniciar Backend (Terminal 1)

```bash
cd api
npm run start:dev
```

Aguarde a mensagem: `Application is running on: http://localhost:3000`

### 3. Iniciar Frontend (Terminal 2)

```bash
cd client
npm run dev
```

Aguarde a mensagem com a URL (geralmente `http://localhost:5173`)

### 4. Testar no Navegador

1. Abra `http://localhost:5173`
2. Você verá a tela de login
3. Clique em "Não tem uma conta? Criar conta"
4. Preencha:
   - Nome: Seu Nome
   - Email: seu@email.com
   - Senha: senha123 (mínimo 6 caracteres)
5. Clique em "Criar Conta"
6. Você será redirecionado para o Dashboard
7. Teste o botão "Sair" no header
8. Faça login novamente com as mesmas credenciais

### 5. Testar API Diretamente (Opcional)

**Criar Conta:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Verificar MongoDB

```bash
# Conectar ao MongoDB
docker exec -it weather-mongodb mongosh -u admin -p admin123

# No shell do MongoDB
use weather
db.users.find().pretty()
```

## Troubleshooting

### Backend não inicia

- Verifique se o MongoDB está rodando: `docker ps`
- Verifique o arquivo `.env` em `api/.env`

### Frontend não conecta

- Verifique se o backend está rodando em `http://localhost:3000`
- Verifique o arquivo `.env` em `client/.env`

### Erro de CORS

- Certifique-se que o CORS está habilitado no `api/src/main.ts`

### Erro ao criar usuário

- Verifique se o email já existe no banco
- Senha deve ter no mínimo 6 caracteres
