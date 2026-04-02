# HANDOFF — Sistema de Pedidos Fosfo
> Última atualização: 02/04/2026 — Sessão 9

## Como usar este arquivo
Cole este documento no início de um novo chat (Claude ou Windsurf) para retomar o desenvolvimento.
Envie junto o `PROJECT_CONTEXT.md` e cole apenas os arquivos relevantes à tarefa (não o zip inteiro).

---

## Status do Projeto

### ✅ Fase 1 — Base (COMPLETA)
- [x] Autenticação com Supabase (email/password)
- [x] Sistema multi-tenant (profiles, stores, store_users)
- [x] Design system completo (Button, Input, Card, Badge, Modal, Toast, Skeleton)
- [x] Hooks customizados (useAuth, useCart)
- [x] Utilitários (formatCurrency, formatPhone, formatDate, getTrialDaysLeft)
- [x] Estrutura de rotas Next.js App Router
- [x] TypeScript strict em todo o projeto

### ✅ Fase 2 — Admin da Loja (COMPLETA)
- [x] Dashboard com métricas (vendas, pedidos, produtos)
- [x] CRUD completo de produtos com variações
- [x] CRUD de categorias
- [x] Gestão de pedidos (status, impressão)
- [x] Personalização da loja (logo, cor primária, banner)
- [x] Upload de imagens (Supabase Storage)
- [x] Drag & drop para ordenar produtos e categorias
- [x] Sistema de banners promocionais

### ✅ Fase 3 — Storefront (COMPLETA)
- [x] Página pública da loja (`/[slug]`)
- [x] Catálogo de produtos com filtros por categoria
- [x] Carrinho de compras (localStorage)
- [x] Checkout via WhatsApp
- [x] Página de loja inativa (design premium)
- [x] Responsivo mobile
- [x] Suporte a variações de produto
- [x] Banners promocionais na vitrine

### ✅ Fase 4 — Master Admin (COMPLETA)
- [x] Painel master (`/master`)
- [x] Gestão de lojas (listar, ativar/desativar, trial, free)
- [x] Gestão de usuários (listar, excluir)
- [x] Busca em tempo real (lojas e usuários)
- [x] Exclusão de lojas com modal de confirmação
- [x] Exclusão de usuários com modal de confirmação
- [x] Badges visuais de trial (Free, Expirado, Expirando, Ativo)
- [x] Ícones ghost para ações (Gift, Clock, Trash2)
- [x] Links clicáveis (email, WhatsApp)
- [x] Configurações da plataforma (trial padrão)
- [x] Funções RPC no Supabase
- [x] Banners de trial no dashboard admin

### ✅ Fase 5 — Demo + LP (COMPLETA)
- [x] Loja Demo funcional com produtos realistas (slug: demo)
- [x] Admin Demo com acesso aberto (rota: /demo-admin)
- [x] Revisão completa do copy da Landing Page
- [x] Redesign seção "O Problema" (comparativo visual dois cards)
- [x] Redesign CTA final (fundo escuro, pills)
- [x] Refinamento UI da Landing Page (navbar, hero, mockup)

### ⏳ Fase 6 — Polish (PRÓXIMA)
- [ ] Responsividade mobile (admin + loja + LP)
- [ ] Refinamento UI loja pública
- [ ] Refinamento UI admin
- [ ] Testes completos de fluxo
- [ ] Deploy Vercel final

---

## Histórico de Desenvolvimento

### Sessão 10 (02/04/2026) — Trial Dinâmico + Footers

**Sistema de Trial Dinâmico:**
- [x] Schema SQL atualizado: trial padrão de 14 para 30 dias
- [x] Função `getDefaultTrialDays()` criada em masterService (fallback: 30 dias)
- [x] Landing Page 100% dinâmica - busca trial do banco ao carregar
- [x] 6 ocorrências de "30 dias" substituídas por variável `{trialDays}`:
  - Badge hero: "{trialDays} dias para testar · sem cartão"
  - FAQ (2x): "Você tem {trialDays} dias..." e "Depois dos {trialDays} dias..."
  - TRUST pills: "{trialDays} dias para testar"
  - CTA final (2x): "{trialDays} dias grátis" e "{trialDays} dias sem custo..."
- [x] Modal de extensão no Master Stores busca valor padrão do banco
- [x] Alteração no Master Settings reflete em toda plataforma instantaneamente
- [x] Apenas novas lojas são afetadas (lojas existentes mantêm prazo original)

**Footers:**
- [x] Landing Page: "Sistema de Pedidos Fosfo · © 2026" com link para https://fosfo.com.br
- [x] Lojas públicas: "{Nome da Loja} · Sistema de Pedidos - Fosfo"
  - Nome da loja linka para `/{slug}` (própria loja)
  - "Sistema de Pedidos - Fosfo" linka para `/` (home da plataforma)
- [x] Layout responsivo (empilha verticalmente no mobile)

### Sessão 9 (02/04/2026) — Refinamento Landing Page

**Navbar:**
- [x] Ícone Store verde (#639922) adicionado ao lado do logo
- [x] Texto alterado para "Sistema de Pedidos Fosfo"
- [x] Menu mobile com scroll suave para âncoras (#como-funciona, #funcionalidades, #faq)
- [x] Links normais (/demo, /login, /register) funcionando corretamente
- [x] Diferenciação automática entre âncoras e rotas no menu mobile

**Hero Section:**
- [x] Título mantido: "Seu catálogo online pronto em minutos."
- [x] Largura máxima da div ajustada para max-w-1xl
- [x] Botão principal: "Criar catálogo grátis" (texto reduzido)
- [x] Botão secundário: "Ver demonstração" com ícone Play à direita
- [x] Ambos os botões com whitespace-nowrap para uma linha

**HeroMockup (Device Frame):**
- [x] Proporções realistas de smartphone (280px × 580px, aspect ratio 9:19.5)
- [x] Device frame com notch e bordas escuras
- [x] UI da loja renderizada dentro do celular (header verde, tabs, produtos, carrinho)
- [x] Cards flutuantes reposicionados:
  - "47 Pedidos hoje" (top-left, -left-32) com ponto verde pulsante
  - Card de notificação (top-right, -top-4 -right-28) alternando entre 3 pedidos a cada 3s
  - Card WhatsApp (bottom-left, bottom-16 -left-24) com mensagem automática
- [x] Background decorativo com círculos coloridos animados + blur + linhas diagonais
- [x] Animações Framer Motion em 3 fases (0 → 1 → 2)

**Melhorias Técnicas:**
- [x] Alternância automática de conteúdo no card de notificação (Ana Lima, Carlos M., Julia S.)
- [x] AnimatePresence com mode="wait" para transições suaves
- [x] Background com 4 círculos blur (verde, azul, roxo) com animações independentes
- [x] Todas as cores verdes atualizadas para #639922

### Sessão 8 (02/04/2026) — Admin Demo Implementado

**Admin Demo:**
- [x] Rota `/demo-admin` criada com acesso público (sem autenticação)
- [x] Dashboard completo com métricas da loja demo
- [x] Visualização de produtos, pedidos, categorias, banners e configurações
- [x] Interface responsiva com menu mobile
- [x] Dados mockados quando loja demo não tem conteúdo
- [x] Modais de visualização para pedidos e produtos
- [x] Sistema de tabs para navegação entre seções
- [x] Sem features de assinatura/indicação/suporte (modo demo puro)

**Loja Demo:**
- [x] Loja com slug `demo` funcional no storefront
- [x] Produtos e categorias populados via script
- [x] Carrinho e checkout funcionais
- [x] Banners promocionais ativos

### Sessão 7 (26/03/2026) — Melhorias no Admin + LP

**Landing Page:**
- [x] Seção "O Problema" completamente redesenhada — dois cards lado a lado (vermelho/verde), degradê suave, barra colorida no topo, ícones SVG, responsivo mobile (empilha em 1 coluna)
- [x] CTA final redesenhado — fundo escuro (#111c14), efeito glow verde, pill de trial, pills na base com ícones SVG verdes

**Admin da loja (apenas lojas reais, não afeta demo):**
- [x] Banner de trial ajustado:
  - Texto "Fosfo" substituído por "Sistema de pedidos"
  - Mensagem inclui valor: "Assine agora por apenas R$ 49,90/mês"
  - Botão "Assinar via WhatsApp" → `https://wa.me/5554981219406`
  - Exibição: apenas quando `is_free !== true` E `trial_ends_at - now <= 7 dias`
  - Não aparece para usuários com plano free
- [x] Sidebar — link de indicação adicionado:
  - Ícone Share2 + "Indique o sistema"
  - Subtexto: "Ganhe junto com quem você indica"
  - Clique copia link `https://fosfo.com.br` + feedback visual "Link copiado!" (verde, 2s)
  - Texto motivacional abaixo: "Compartilhe com outros empreendedores"
- [x] Sidebar — link de suporte adicionado:
  - Ícone MessageCircle + "Falar com suporte"
  - Abre `https://wa.me/5554981219406?text=Olá!%20Preciso%20de%20ajuda%20com%20o%20Sistema%20de%20Pedidos%20Fosfo.`
  - Posicionado próximo ao "Ver meu catálogo" e "Sair"
- [x] Sidebar — link "Por onde começar" adicionado:
  - Ícone Compass + "Por onde começar"
  - Link para `/admin/start`
- [x] Página `/admin/start` criada — onboarding passo a passo:
  - Passo 1: Configure sua loja → `/admin/settings`
  - Passo 2: Crie suas categorias → `/admin/categories`
  - Passo 3: Cadastre seus produtos → `/admin/products`
  - Passo 4: Compartilhe seu catálogo → loja pública
  - Cards com numeração visual (círculo verde), hover sutil, responsivo
- [x] Dashboard (`/admin`) — cards de acesso rápido adicionados:
  - "Por onde começar" com ícone e link
  - "Acessar meu catálogo" com ícone e link
  - "Falar com suporte" com ícone e link WhatsApp

**Número de suporte/assinatura:** `5554981219406` (Diego, 54 98121-9406)

### Sessão 6 (26/03/2026) — Revisão de Copy e Estratégia de Marketing
**Funcionalidades implementadas:**
- [x] Copy completo da Landing Page revisado
- [x] Substituição global de "loja" por "catálogo" em todo o copy da LP
- [x] Seção nova "O problema" adicionada (dor do WhatsApp)
- [x] Métricas falsas ocultadas (className="hidden") — não deletadas
- [x] FAQ atualizado com 3 novas perguntas:
  - "Por que não usar só o WhatsApp?"
  - "Quanto custa depois do período grátis?"
  - "Preciso de site, domínio ou técnico?"
- [x] CTA final revisado com ancoragem de trial (30 dias grátis, sem cartão)
- [x] Hero revisado: novo headline, subtítulo e benefícios nos botões
- [x] Auditoria de links e navegação da LP

**Decisões tomadas:**
- Termo "loja" substituído por "catálogo" — evita remeter a e-commerce completo
- Métricas ocultadas em vez de deletadas — podem ser reativadas futuramente
- Preço (R$49,90) não mencionado explicitamente na LP — estratégia de trial primeiro
- Tom definido: próximo e acolhedor, quase pessoal
- Público primário: confeitarias, açaiterias, artesãos, marmitex

### Sessão 5 (26/03/2026) — Preparação para Demo
- [x] `types/index.ts` — campo `is_demo: boolean` adicionado ao tipo `Store`
- [x] API Route `/api/platform-settings` — endpoint para buscar configurações da plataforma
- [x] Correção de estrutura de arquivos (nomes e locais corretos conforme Next.js App Router)
- [x] Reorganização de arquivos duplicados

### Sessão 4 (26/03/2026) — Master Admin: Busca e Exclusão
- [x] `/master/stores` — exclusão de lojas com modal de confirmação
- [x] `/master/users` — exclusão de usuários com modal de confirmação
- [x] Busca em tempo real em lojas e usuários
- [x] Email e telefone do dono clicáveis
- [x] `masterService.ts` — funções `deleteStore()` e `deleteUser()` com cascade

### Sessão 3 (26/03/2026) — Master Admin: Trial e Badges
- [x] Campo `is_free` na tabela `stores`
- [x] Funções RPC `master_toggle_store` e `master_set_store_free`
- [x] Badges visuais de trial (Free / Expirado / Expirando / Ativo)
- [x] Banner amarelo (≤10 dias) e laranja (expirado) no dashboard admin
- [x] Página de loja inativa com design premium

### Sessões anteriores (Fases 1-3)
- Implementação completa da base do sistema
- Painel admin da loja com todas as funcionalidades
- Storefront público com carrinho e checkout
- Sistema de autenticação e multi-tenancy
- Design system completo

---

## Stack

| Tecnologia | Versão |
|-----------|--------|
| Next.js | 16.1.7 |
| React | 19.2.x |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Supabase | JS 2.99.x |
| Lucide React | 0.577.x |
| Radix UI | Dialog, Dropdown, Toast, Select, Switch |

---

## Supabase

- **Projeto:** Sistema de pedidos - Fosfo
- **URL:** https://lfeoismqsjvgvpjceger.supabase.co
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZW9pc21xc2p2Z3ZwamNlZ2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MDA1NTksImV4cCI6MjA4OTI3NjU1OX0.75L5If1zn7Kvq8LUovFBS3BojCxZ2y3Iy01PwEpb8yk
- **Region:** East US
- **Storage Buckets:** store-assets (public), product-images (public)
- **Confirm email:** DESATIVADO
- **Auth trigger:** handle_new_user() cria profile automaticamente

### Tabelas
profiles, stores, store_users, categories, products, product_images, product_variants, variant_options, banners, orders, order_items, platform_settings

### Campos relevantes em `stores`
- `is_active` — liga/desliga a loja (master controla)
- `is_free` — isenta a loja de trial (banner de assinatura não aparece)
- `is_demo` — identifica loja demo (acesso público ao admin)
- `trial_ends_at` — data de expiração do trial
- `primary_color`, `logo_url`, `slug` — personalização

### Funções RPC no Supabase
- `master_toggle_store(store_id, is_active)` — ativa/desativa loja
- `master_set_store_free(store_id, is_free)` — marca/desmarca como free

### Funções de exclusão (masterService.ts)
- `deleteStore(storeId)` — exclui loja permanentemente (cascade)
- `deleteUser(userId)` — exclui usuário permanentemente (cascade)

---

## Credenciais de Teste

| Conta | Email | Role |
|-------|-------|------|
| Master | diego@fosfo.com.br | master |
| Admin teste | diegoscotton@hotmail.com | admin |

### Lojas para testar
| Nome | is_active | is_free | Situação |
|------|-----------|---------|----------|
| teste diego | true | false | Loja do master |
| DIEGO ANTONIO SCOTTON | false | true | Free |
| Açai Centra Bento | true | false | Ativa |
| Loja do Kiss | false | false | Inativa |
| Doce Sabor Confeitaria | true | false | Ativa |

---

## Contatos do Sistema

- **Suporte / Assinatura WhatsApp:** `5554981219406` (Diego, 54 98121-9406)
- **Link da plataforma:** `https://fosfo.com.br`
- **Deploy atual:** `https://store-orders-system.vercel.app`

---

## Arquivos-chave

- `PROJECT_CONTEXT.md` — Especificação completa do produto
- `HANDOFF.md` — Este arquivo
- `src/types/index.ts` — Todos os tipos TypeScript
- `src/hooks/useAuth.ts` — Hook de autenticação
- `src/hooks/useCart.ts` — Hook do carrinho
- `src/lib/utils.ts` — Utilitários (formatCurrency, getTrialDaysLeft, etc)
- `src/components/ui/index.ts` — Barrel export do design system
- `src/services/masterService.ts` — Funções master admin
- `src/services/dashboardService.ts` — getDashboardMetrics
- `src/app/api/platform-settings/route.ts` — API route configurações
- `src/app/master/stores/page.tsx` — Gestão de lojas
- `src/app/master/users/page.tsx` — Gestão de usuários
- `src/app/master/settings/page.tsx` — Configurações da plataforma
- `src/app/admin/page.tsx` — Dashboard admin (banners trial + cards acesso rápido)
- `src/app/admin/start/page.tsx` — Página onboarding "Por onde começar"
- `src/app/demo-admin/page.tsx` — Admin demo público (sem autenticação)
- `src/app/[slug]/page.tsx` — Loja pública + página inativa
- `src/app/page.tsx` — Landing Page

---

## Decisões de Design

1. **Variações de produto:** Um card = um produto. Variações são seletores (pills/dropdown). Cada opção pode ter preço diferente.
2. **Imagens:** Principal obrigatória (placeholder padrão se não enviar), adicionais opcionais.
3. **WhatsApp:** Via wa.me. Número do suporte: `5554981219406`.
4. **Trial:** 14 dias padrão. Banner de aviso aparece nos últimos 7 dias (apenas para não-free). Loja inativa → página de bloqueio no storefront.
5. **Plano free:** `is_free = true` remove banner de trial e cobrança. Controlado pelo master.
6. **Loja inativa:** Página premium com design escuro, mensagem amigável e CTA.
7. **Banners de trial no admin:** Amarelo (≤10 dias), Laranja (expirado). Não bloqueia o painel.
8. **Personalização da loja:** Apenas logo + cor primária + banner.
9. **Demo:** Loja demo (slug: `demo`) + admin demo (rota: `/demo-admin`) sem senha. Campo `is_demo` identifica. Admin demo é uma página standalone com tabs, sem features de assinatura/indicação/suporte.
10. **URL das lojas:** seusite.com/slug-da-loja
11. **Estrutura de arquivos:** Seguir convenções Next.js App Router

---

## Problemas já resolvidos

### Supabase & Database
- **Trigger handle_new_user():** `SET search_path = public` + `SECURITY DEFINER`
- **Policies com recursão infinita:** fix-nuclear.sql aplicado
- **Cache de queries:** Timestamp e filtros para forçar refresh
- **Cascade deletes:** Exclusão em cascata para lojas e usuários

### React & State Management
- **confirm() nativo:** Substituído por Modal com confirmação
- **setState com função:** Objeto wrapper `{ fn: ... }` para evitar stale closures
- **Toggle de loja:** Atualiza state local diretamente
- **Filtros de busca:** Busca em tempo real sem debounce

### TypeScript
- **Tipos do Supabase:** Sincronizados com schema (is_free, is_demo, email)
- **Type casting:** `(user as any).email` onde necessário

---

## Funcionalidades Completas por Módulo

### 🔐 Autenticação
- ✅ Login com email/password
- ✅ Registro de usuário + criação automática de loja
- ✅ Proteção de rotas por role (admin, master)
- ✅ Logout

### 👨‍💼 Painel Admin (`/admin`)
- ✅ Dashboard com métricas (vendas, pedidos, produtos)
- ✅ Gráfico de vendas dos últimos 7 dias
- ✅ Produtos mais vendidos
- ✅ Pedidos recentes
- ✅ Cards de acesso rápido: Por onde começar, Acessar catálogo, Falar com suporte
- ✅ Banner de trial (amarelo ≤10 dias, laranja expirado)
- ✅ Banner de assinatura (≤7 dias, apenas não-free) com botão WhatsApp
- ✅ CRUD completo de produtos com variações e imagens
- ✅ CRUD de categorias
- ✅ Gestão de pedidos (listar, filtrar, atualizar status, imprimir)
- ✅ Personalização da loja (logo, cor primária, banner)
- ✅ Sistema de banners promocionais
- ✅ Sidebar: Por onde começar, Indique o sistema, Falar com suporte
- ✅ Página onboarding `/admin/start` com passo a passo

### 🏪 Loja Pública (`/[slug]`)
- ✅ Catálogo com filtros por categoria
- ✅ Suporte a variações de produto
- ✅ Carrinho de compras (localStorage)
- ✅ Checkout via WhatsApp
- ✅ Banners promocionais
- ✅ Página de loja inativa (design premium)
- ✅ Responsivo mobile

### 👑 Painel Master (`/master`)
- ✅ Gestão de lojas (listar, ativar/desativar, trial, free, excluir)
- ✅ Gestão de usuários (listar, excluir)
- ✅ Busca em tempo real
- ✅ Badges visuais de trial
- ✅ Modal de confirmação para exclusão
- ✅ Configurações da plataforma (trial padrão)

### 🎭 Demo Público
- ✅ Loja demo acessível via `/demo`
- ✅ Admin demo acessível via `/demo-admin` (sem autenticação)
- ✅ Dashboard com métricas, produtos, pedidos, categorias, banners
- ✅ Interface responsiva com menu mobile
- ✅ Dados mockados quando necessário
- ✅ Modais de visualização (somente leitura)

### 🛠️ Infraestrutura
- ✅ Multi-tenancy completo (isolamento por store_id)
- ✅ Row Level Security (RLS) no Supabase
- ✅ Storage público para assets
- ✅ Funções RPC para operações master
- ✅ Design system completo e consistente
- ✅ TypeScript strict
- ✅ Error handling com toast feedback

---

## Como rodar localmente

**Terminal nativo do Mac** (não o Windsurf):
```bash
cd ~/Documents/web/AI/windsurf/store-orders-system && npm run dev
```

Se der erro de porta em uso:
```bash
lsof -ti:3000,3001,3002,3003 | xargs kill -9 ; npm run dev
```

---

## Próxima sessão — Fase 6

### Prioridade 1: Responsividade Mobile
- [ ] Testar e ajustar admin em dispositivos móveis
- [ ] Testar e ajustar loja pública em dispositivos móveis
- [ ] Testar e ajustar landing page em dispositivos móveis
- [ ] Garantir navegação fluida em telas pequenas

### Prioridade 2: Refinamento UI/UX
- [ ] Revisar espaçamentos e alinhamentos
- [ ] Melhorar feedback visual de ações
- [ ] Otimizar carregamento de imagens
- [ ] Adicionar estados de loading onde necessário

### Prioridade 3: Testes e Deploy
- [ ] Testar fluxo completo de cadastro → criação de loja → produtos → pedidos
- [ ] Testar fluxo de checkout via WhatsApp
- [ ] Validar funcionamento do painel master
- [ ] Deploy final no Vercel
- [ ] Configurar domínio personalizado (fosfo.com.br)
