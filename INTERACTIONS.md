# Guia de Interações - Dashboard

## Elementos Interativos

### 1. Menu de Perfil (Header)

**Localização:** Canto superior direito

**Como usar:**

- Clique no avatar/nome do usuário
- Abre um dropdown menu com opções:
  - **Perfil** - Ver informações do perfil (placeholder)
  - **Configurações** - Acessar configurações (placeholder)
  - **Sair** - Desconectar da conta (funcional)

**Feedback Visual:**

- Hover: Background cinza claro
- Menu aberto: Dropdown animado
- Opção "Sair" em vermelho para destaque

### 2. Cards de Métricas

**Localização:** Grid abaixo do card principal

**Interações:**

- Hover: Card aumenta levemente (scale 105%) e ganha sombra
- Cursor: Pointer indica que é clicável
- Preparado para futuras funcionalidades (detalhes expandidos)

**Cards disponíveis:**

- Umidade (azul)
- Vento (verde)
- Visibilidade (roxo)
- Índice UV (laranja)

### 3. Previsão de 5 Dias

**Localização:** Card inferior

**Interações:**

- Hover: Card aumenta (scale 105%), ganha sombra e borda azul
- Click: Console log (preparado para modal de detalhes)
- Focus: Ring azul para acessibilidade
- Cada dia é um botão clicável

**Feedback Visual:**

- Transições suaves em todas as interações
- Cores mudam no hover
- Animações respeitam prefers-reduced-motion

## Acessibilidade

✅ Todos os elementos interativos são acessíveis via teclado
✅ Focus rings visíveis
✅ Contraste adequado (WCAG AA)
✅ Aria labels onde necessário
✅ Suporte a dark mode

## Próximas Funcionalidades

### Perfil

- Modal com informações completas do usuário
- Edição de dados pessoais
- Upload de avatar

### Configurações

- Preferências de unidades (°C/°F)
- Notificações
- Tema (light/dark/auto)

### Cards de Métricas

- Modal com gráficos históricos
- Comparação com dias anteriores

### Previsão

- Modal com detalhes hora a hora
- Gráficos de temperatura
- Probabilidade de chuva
