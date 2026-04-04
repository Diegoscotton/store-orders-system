# MASTER CONTEXT — Sistema de Pedidos Fosfo

## Identidade do Projeto

- **Nome:** Sistema de Pedidos Fosfo
- **Tipo:** Plataforma multi-tenant SaaS para pequenos negócios receberem pedidos online
- **Objetivo:** Permitir que qualquer pessoa crie um catálogo online em poucos passos, cadastre produtos com variações, receba pedidos pelo sistema e opcionalmente por WhatsApp
- **Referência visual:** origemchocolataria.com.br (funcionalidade), mas com design premium e moderno
- **Público:** Confeitarias, açaiterias, artesãos, marmitex — negócios simples que precisam de um catálogo online funcional

**Linguagem e posicionamento:**
- Usar "catálogo online" no lugar de "loja" — evita remeter a e-commerce
- Tom: próximo, acolhedor, quase pessoal — nunca corporativo
- Proposta central: organizar pedidos que chegam pelo WhatsApp, não substituí-lo
- Trial: 30 dias grátis (dinâmico, configurável em `/master/settings`), sem cartão. Preço pós-trial: R$49,90/mês (não exposto na LP inicialmente)

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + TypeScript |
| Estilização | Tailwind CSS 4 |
| Banco de dados | PostgreSQL (via Supabase) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (imagens) |
| Deploy | Vercel |
| Ícones | Lucide React |
| Componentes | Radix UI (dialogs, dropdowns) |

---

## Arquitetura Multi-Tenant

Toda informação no sistema é isolada por `store_id`. Cada loja só vê seus próprios dados.

```
Plataforma (LP + Auth + Master Admin)
  └── Loja A (slug: acai-central)
        ├── Categorias
        ├── Produtos + Variações + Imagens
        ├── Pedidos
        └── Configurações (WhatsApp, cores, logo, banner)
  └── Loja B (slug: pizzaria-joao)
        ├── ...
```

**Isolamento garantido por:**
- Row Level Security (RLS) no Supabase
- Filtro `store_id` em todas as queries
- Validação no middleware

---

## Módulos do Sistema

### 1. Landing Page (/)
Página pública premium que apresenta a plataforma.

**Seções (ordem atual):**
- Hero — headline + mockup visual do app (device frame realista com UI interna)
- O Problema — comparativo WhatsApp vs Sistema (dois cards lado a lado, vermelho/verde)
- Como funciona — 3 passos visuais
- Funcionalidades — cards com ícones
- Para quem é — fotos reais de produtos (confeitaria, artesanato, gastronomia)
- Demonstração — dois acessos: loja pública + painel admin
- FAQ — inclui "Por que não usar só o WhatsApp?", "Quanto custa?", "Preciso de técnico?"
- CTA final — fundo escuro (#111c14), "Testa agora. Decide depois.", pills na base

**Navbar:**
- Ícone Store verde (#639922) ao lado do texto "Sistema de Pedidos Fosfo"
- Menu mobile com scroll suave para âncoras e navegação normal para rotas
- Links: Como funciona, Funcionalidades, FAQ, Ver demo, Entrar, Criar catálogo grátis

**Hero Section:**
- Badge: "30 dias para testar · sem cartão"
- Título: "Seu catálogo online pronto em minutos." (max-w-1xl)
- Botões: "Criar catálogo grátis" (verde) + "Ver demonstração" (branco, ícone Play)
- Pills: 30 dias para testar, Sem cartão, Pronto em 2 minutos

**HeroMockup (Device Frame):**
- Smartphone realista (280px × 580px) com notch e bordas escuras
- UI da loja dentro: header verde, tabs, produtos, carrinho
- Cards flutuantes:
  - "47 Pedidos hoje" (top-left) com ponto verde pulsante
  - Card de notificação (top-right) alternando entre 3 pedidos a cada 3s
  - Card WhatsApp (bottom-left) com mensagem automática
- Background: círculos coloridos animados + blur + linhas diagonais
- Animações Framer Motion em 3 fases

**Trial Dinâmico:**
- Landing Page busca `default_trial_days` do banco ao carregar (fallback: 30 dias)
- Todas as menções ao trial são dinâmicas: badge hero, FAQ, TRUST pills, CTA final
- Alteração em `/master/settings` reflete instantaneamente em toda plataforma
- Apenas novas lojas são afetadas (lojas existentes mantêm prazo original)

**Regras de copy:**
- "catálogo" no lugar de "loja" em todo o copy
- Métricas (500+ lojas, 50K pedidos) estão ocultas com `hidden` — não deletar
- "Centenas de pequenos negócios..." deve ser removido ou substituído por algo factual

**Links:**
- "Ver demonstração" → `/demo` (loja pública com slug 'demo')
- "Ver admin demo" → `/demo-admin` (painel admin público sem autenticação)
- "Criar catálogo grátis" → `/register`
- "Entrar" → `/login`

**Footer:**
- "Sistema de Pedidos Fosfo · 2026" com link para https://fosfo.com.br
- Abre em nova aba, efeito hover

---

### 2. Autenticação e OAuth

**Páginas:**
- `/login` — Login com email/senha + botão "Continuar com Google"
- `/register` — Cadastro com nome, email, telefone, senha + nome da loja (cria loja + vincula) + botão "Continuar com Google"
- `/forgot-password` — Solicita email para recuperação de senha
- `/reset-password` — Define nova senha via link do email
- `/register/complete` — Completar cadastro para usuários que entraram via Google (escolher nome do catálogo)
- `/auth/callback` — Processa OAuth do Google e redireciona conforme contexto

**Fluxo tradicional (email/senha):**
1. Usuário se registra → cria conta + loja + vincula
2. Trigger `handle_new_user()` cria profile automaticamente
3. Redirect para `/admin` (ou `/master` se role = master)

**Fluxo OAuth (Google):**
1. Usuário clica "Continuar com Google" em `/login` ou `/register`
2. Autentica no Google → redireciona para `/auth/callback`
3. Callback verifica se usuário já tem loja:
   - **Tem loja:** redireciona para `/admin` (ou `/master` se master)
   - **Não tem loja:** redireciona para `/register/complete` para escolher nome do catálogo
4. Em `/register/complete`: cria loja + vincula usuário → redireciona para `/admin`

**Recuperação de senha:**
1. Usuário clica "Esqueci minha senha" em `/login`
2. Digita email em `/forgot-password`
3. Recebe email com link (template personalizado no Supabase)
4. Clica no link → vai para `/reset-password`
5. Define nova senha → redireciona para `/admin`

**Segurança:**
- Middleware protege rotas `/admin` e `/master`
- Usuários logados são redirecionados de `/login`, `/register`, `/forgot-password`
- `/reset-password` não requer autenticação (token vem na URL)
- OAuth usa `redirectTo` para callback seguro

---

### 3. Loja Pública (/[slug])

**Layout:**
- Header com logo, nome da loja, descrição, botão do carrinho
- Banner opcional (carrossel)
- Filtro por categorias (tabs ou pills)
- Grid de produtos
- Carrinho lateral (drawer)
- Checkout com formulário

**Card do Produto:**
- Foto principal (placeholder padrão se não tiver)
- Nome + descrição curta
- Preço base (atualiza conforme variação)
- Seletor de variações (pills ou dropdown, cada opção com preço)
- Seletor de quantidade (+/-)
- Botão "Adicionar ao carrinho"

**Checkout:**
- Formulário: Nome, Telefone, Endereço (opcional), Observações
- Grava pedido no banco (orders + order_items)
- Se WhatsApp ativo: abre wa.me com mensagem pré-formatada
- Modal de confirmação com número do pedido

**Loja Travada (trial expirado):**
- Vitrine continua visível
- Pedidos bloqueados
- Página premium com mensagem amigável

**Footer:**
- "{Nome da Loja} · Sistema de Pedidos - Fosfo"
- Nome da loja linka para `/{slug}` (própria loja)
- "Sistema de Pedidos - Fosfo" linka para `/` (home da plataforma)
- Layout responsivo (empilha verticalmente no mobile)

---

### 4. Admin da Loja (/admin)

**Sidebar (itens em ordem):**
- Dashboard
- Produtos
- Categorias
- Pedidos
- Banners
- Configurações
- — separador —
- Por onde começar (ícone Compass) → `/admin/start`
- Ver meu catálogo → loja pública
- Indique o sistema (ícone Share2) — copia link + feedback
- Falar com suporte (ícone MessageCircle) → WhatsApp 5554981219406
- Sair

**Dashboard (`/admin`):**
- Cards de métricas: total produtos, pedidos hoje, pedidos pendentes, total de pedidos
- Gráfico de vendas dos últimos 7 dias
- Produtos mais vendidos
- Pedidos recentes
- Cards de acesso rápido: Por onde começar / Acessar meu catálogo / Falar com suporte
- Banner de trial amarelo (≤10 dias) ou laranja (expirado)
- Banner de assinatura (≤7 dias, apenas `is_free !== true`): mensagem amigável + R$49,90/mês + botão "Assinar via WhatsApp"

**Página `/admin/start` — Por onde começar:**
- Passo a passo onboarding com 4 cards
- Passo 1: Configure sua loja → `/admin/settings`
- Passo 2: Crie suas categorias → `/admin/categories`
- Passo 3: Cadastre seus produtos → `/admin/products`
- Passo 4: Compartilhe seu catálogo → loja pública
- Cards com numeração visual (círculo verde), hover sutil, responsivo
- Acessível a qualquer momento pela sidebar

**Produtos (`/admin/products`):**
- Tabela com foto miniatura, nome, categoria, preço, status
- CRUD completo com variações dinâmicas e upload de imagens
- Drag & drop para reordenar

**Categorias (`/admin/categories`):**
- CRUD com reordenação

**Pedidos (`/admin/orders`):**
- Tabela com filtros por status e data
- Detalhes do pedido com alterar status
- Impressão em lote (A4)

**Banners (`/admin/banners`):**
- Upload, reordenar, ativar/desativar, link opcional

**Configurações (`/admin/settings`):**
- Dados da loja: nome, slug, descrição
- Visual: logo, cor primária, banner
- WhatsApp: número + toggle

**Regra importante:** Nenhuma das features de assinatura, indicação ou suporte deve aparecer na loja demo (`is_demo = true`).

---

### 5. Demo Público

**Loja Demo (`/demo`):**
- Loja pública acessível via slug `demo`
- Produtos e categorias populados com dados realistas (confeitaria)
- Todas as funcionalidades da vitrine funcionais: filtros, carrinho, checkout
- Banners promocionais ativos
- Serve como demonstração para potenciais clientes

**Admin Demo (`/demo-admin`):**
- Painel administrativo público sem necessidade de autenticação
- Interface standalone com sistema de tabs para navegação
- **Tabs disponíveis:**
  - Dashboard: métricas, gráficos, pedidos recentes
  - Produtos: listagem com fotos, preços, categorias
  - Pedidos: histórico com status e detalhes
  - Categorias: lista de categorias da loja
  - Banners: banners promocionais configurados
  - Configurações: dados da loja demo
- **Funcionalidades:**
  - Visualização completa (somente leitura)
  - Modais de detalhes para pedidos e produtos
  - Dados mockados quando loja demo não tem conteúdo real
  - Menu mobile responsivo
  - Link para voltar à landing page
- **Importante:** Não exibe features de assinatura, indicação ou suporte (modo demo puro)

---

### 6. Master Admin (/master)

**Sidebar:**
- Dashboard
- Lojas
- Usuários
- Configurações

**Lojas (`/master/stores`):**
- Tabela com nome, dono (nome + email + telefone clicáveis), data, status, trial
- Toggle ativa/desativa loja
- Badges: Free / Expirado / Expirando em X dias / Ativo
- Exclusão com modal de confirmação (digitar nome)
- Estender trial
- Marcar como free (remove cobrança)

**Usuários (`/master/users`):**
- Lista com busca em tempo real
- Exclusão com modal de confirmação

**Configurações (`/master/settings`):**
- Trial padrão (dias)
- Dados da plataforma
- Loja demo (qual loja é a demo)

---

## Sistema de Trial

- Ao criar a loja: `trial_ends_at = NOW() + X dias` (default 14)
- `is_free = true` → isenta completamente (sem banner de assinatura)
- Banner de aviso no admin: amarelo (≤10 dias), laranja (expirado)
- Banner de assinatura: aparece nos últimos 7 dias, apenas `is_free !== true`
- Quando expira: `is_active = false` → loja pública mostra página de bloqueio
- Master pode estender, ativar/desativar e marcar como free
- Cobrança feita pessoalmente pelo Diego via WhatsApp

**Preço:** R$49,90/mês (não exposto na LP, mencionado apenas no banner de trial do admin)

---

## WhatsApp

**Pedidos da loja:** via `https://wa.me/{numero_dono}?text={mensagem}`
**Suporte/Assinatura:** `https://wa.me/5554981219406` (Diego)

**Template da mensagem de pedido:**
```
🧾 *Novo Pedido #{numero}*

👤 {nome_cliente}
📞 {telefone}

📦 Itens:
• {quantidade}x {produto} ({variacao}) - R$ {preco}
...

💰 *Total: R$ {total}*

📍 Endereço: {endereco}
📝 Obs: {observacoes}
```

---

## Estrutura de Pastas

```
src/
├── app/
│   ├── page.tsx                    # Landing Page
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── demo-admin/page.tsx         # Admin demo público (implementado)
│   ├── [slug]/
│   │   ├── page.tsx                # Loja pública (inclui /demo)
│   │   └── checkout/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Dashboard
│   │   ├── start/page.tsx          # Onboarding "Por onde começar"
│   │   ├── products/
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── banners/
│   │   └── settings/
│   ├── master/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── stores/
│   │   ├── users/
│   │   └── settings/
│   └── api/
│       └── platform-settings/route.ts
├── components/
│   ├── ui/
│   ├── store/
│   ├── admin/
│   └── master/
├── lib/
│   ├── supabase.ts
│   ├── supabase-server.ts
│   └── utils.ts
├── services/
│   ├── storeService.ts
│   ├── productService.ts
│   ├── categoryService.ts
│   ├── orderService.ts
│   ├── userService.ts
│   ├── dashboardService.ts
│   └── masterService.ts
├── types/
│   └── index.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useStore.ts
│   └── useCart.ts
└── middleware.ts
```

---

## Design System

**Filosofia:** Premium, moderno, limpo.

**Paleta:**
- Fundo principal: branco / cinza muito claro
- Texto: cinza escuro / preto
- Accent: verde (#639922 plataforma, cor primária configurável por loja)
- Sucesso: verde
- Alerta: amarelo
- Erro: vermelho

**Admin:**
- Sidebar escura (cinza 900)
- Header com breadcrumbs
- Cards de métricas com ícones
- Tabelas com ações inline

**Storefront:**
- Layout limpo, muito espaço em branco
- Cards de produto com sombra suave
- Mobile-first, totalmente responsivo

---

## Regras de Desenvolvimento

1. **Sempre filtrar por store_id** — nunca buscar dados sem isolamento
2. **Nunca expor dados entre lojas** — RLS + validação no código
3. **Mobile-first** — toda UI funciona no celular
4. **Sem alert()** — usar toasts
5. **Loading states** — skeleton em listagens, spinner em ações
6. **Tratamento de erros** — try/catch com feedback visual
7. **Demo isolada** — loja demo usa slug `demo`, admin demo em `/demo-admin` (standalone, sem features de assinatura/indicação/suporte)
8. **Imagens otimizadas** — next/image quando possível
9. **TypeScript strict** — tipos definidos para tudo
10. **Admin demo público** — rota `/demo-admin` sem autenticação, dados mockados quando necessário

---

## Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://lfeoismqsjvgvpjceger.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
NEXT_PUBLIC_APP_URL=https://store-orders-system.vercel.app
```

---

## Estratégia de Marketing

### Posicionamento
O sistema não é um e-commerce. É um organizador de pedidos com cara de catálogo online.
A dor central: receber pedido pelo WhatsApp virou bagunça.
O sistema organiza o que chega no WhatsApp — sem fazer o cliente largar o que já usa.

### Público primário (fase inicial)
- Confeitarias e docerias
- Açaiterias e lanchonetes
- Artesãos e produtores caseiros
- Restaurantes e marmitex

### Captação inicial
- Abordagem direta via WhatsApp (scripts por nicho — a fazer)
- Foco local: Bento Gonçalves e região
- **Demo sem cadastro como principal ferramenta de conversão:**
  - Loja demo acessível em `/demo`
  - Admin demo acessível em `/demo-admin` (sem senha)
  - Visitante pode explorar todas as funcionalidades antes de se cadastrar
- Link de indicação na sidebar do admin incentiva usuários a compartilhar

### Trial
- 14 dias grátis, sem cartão
- Preço pós-trial: R$49,90/mês
- Preço não exibido na LP — usuário decide após testar
- Banner de assinatura aparece nos últimos 7 dias do trial
