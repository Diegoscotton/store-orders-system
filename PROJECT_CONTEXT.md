# MASTER CONTEXT — Sistema de Pedidos Fosfo

## Identidade do Projeto

- **Nome:** Sistema de Pedidos Fosfo
- **Tipo:** Plataforma multi-tenant SaaS para lojas receberem pedidos online
- **Objetivo:** Permitir que qualquer pessoa crie uma loja online em poucos passos, cadastre produtos com variações, receba pedidos pelo sistema e opcionalmente por WhatsApp
- **Referência visual:** origemchocolataria.com.br (funcionalidade), mas com design premium e moderno
- **Público:** Pequenas lojas, restaurantes, confeitarias, açaiterias — negócios simples que precisam de um catálogo online funcional

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

**Seções:**
- Hero com headline forte e CTA
- Como funciona (3 passos visuais)
- Funcionalidades (cards com ícones)
- Demonstração (link para loja demo funcional)
- Depoimentos/Social proof (futuro)
- CTA final + rodapé

**Links:**
- "Ver demonstração" → `/demo` (loja demo funcional)
- "Ver admin demo" → `/demo/admin` (acesso aberto, sem senha)
- "Criar minha loja" → `/register`
- "Entrar" → `/login`

---

### 2. Autenticação

**Páginas:**
- `/login` — Login com email/senha
- `/register` — Cadastro de novo usuário + criação automática da loja

**Fluxo de registro:**
1. Usuário preenche: nome, email, senha, nome da loja
2. Sistema cria conta no Supabase Auth
3. Sistema cria a loja com slug gerado automaticamente
4. Sistema cria vínculo `store_users` (role: admin)
5. Redireciona para `/admin` (onboarding)

---

### 3. Loja Pública (/[slug])
Vitrine da loja acessível por qualquer pessoa.

**Layout:**
- Header com logo, nome da loja, descrição, botão do carrinho
- Banner opcional (imagem de destaque)
- Filtro por categorias (tabs ou pills horizontais)
- Grid de produtos (cards premium)
- Carrinho lateral (drawer)
- Checkout com formulário

**Card do Produto:**
- Foto principal do produto (placeholder padrão se não tiver)
- Nome + descrição curta
- Preço base (atualiza dinamicamente conforme variação selecionada)
- Seletor de variações (ex: Tamanho P/M/G) — pills ou dropdown. Cada opção pode ter preço diferente
- Seletor de quantidade (+/- com número)
- Botão "Adicionar ao carrinho"
- Se produto não tem variações: mostra só preço fixo + quantidade + botão

**Variações — como funciona:**
- Dono da loja cria "tipos" de variação livremente (ex: "Tamanho", "Sabor", "Cor")
- Para cada tipo, cria opções com preço específico (ex: P=R$25, M=R$40, G=R$60)
- Um produto pode ter múltiplos tipos de variação (ex: Tamanho + Sabor)
- Produto sem variação = preço fixo simples
- Na loja: o preço exibido muda ao selecionar a opção

**Imagens do produto:**
- Foto principal obrigatória (se não enviar, usa placeholder padrão bonito)
- Fotos adicionais opcionais (carrossel no detalhe/modal do produto)

**Carrinho:**
- Drawer lateral
- Lista de itens com foto, nome, variação, quantidade, preço
- Alterar quantidade (+/-)
- Remover item
- Total
- Botão "Finalizar Pedido"

**Checkout:**
- Formulário: Nome, Telefone (WhatsApp), Endereço (opcional), Observações
- Resumo do pedido
- Botão "Confirmar Pedido"
- Ao confirmar:
  - Grava pedido no banco (tabela orders + order_items)
  - Se WhatsApp ativo: abre WhatsApp do cliente com mensagem pré-formatada pro dono da loja (via wa.me)
  - Mostra modal bonito e amigável: "Pedido enviado com sucesso!" + número do pedido

**Loja Travada (trial expirado):**
- Vitrine continua visível (produtos aparecem)
- Botão de pedido desabilitado
- Aviso sutil: "Esta loja está temporariamente indisponível para pedidos"

---

### 4. Admin da Loja (/admin)
Painel do dono da loja para gerenciar tudo.

**Sidebar:**
- Dashboard
- Produtos
- Categorias
- Pedidos
- Banners
- Configurações
- Minha Loja (preview)

**Dashboard:**
- Cards de métricas: total produtos, pedidos hoje, pedidos pendentes, total de pedidos
- Gráfico de pedidos dos últimos 7 dias (futuro)
- Acesso rápido: últimos pedidos pendentes

**Produtos (/admin/products):**
- Tabela com: foto miniatura, nome, categoria, preço, status
- Botão "+ Novo Produto"
- Editar / Excluir
- Modal/página de criação:
  - Nome, descrição, preço base
  - Categoria (select)
  - Upload de imagens (múltiplas, drag & drop)
  - Variações dinâmicas:
    - Adicionar tipo de variação (ex: "Tamanho")
    - Para cada tipo, adicionar opções (ex: "P", "M", "G") com preço específico
  - Status: ativo/inativo

**Categorias (/admin/categories):**
- Lista com nome e quantidade de produtos
- Criar / Editar / Excluir
- Reordenar (futuro)

**Pedidos (/admin/orders):**
- Tabela com: nº pedido, cliente, telefone, total, status, data/hora
- Filtros: por status, por data
- Clique abre detalhes do pedido:
  - Itens com variações e quantidades
  - Dados do cliente
  - Observações
  - Alterar status: Pendente → Aceito → Preparando → Pronto → Entregue / Cancelado
- Impressão em lote: selecionar múltiplos pedidos → gerar folha A4 com vários pedidos formatados
- Marcar como atendido em lote

**Banners (/admin/banners):**
- Carrossel com múltiplos banners na loja
- Upload de imagens
- Reordenar (drag & drop ou setas)
- Ativar/desativar individualmente
- Link opcional (ao clicar no banner)

**Configurações (/admin/settings):**
- Dados da loja: nome, slug, descrição
- Visual: logo (upload), cor primária (color picker), banner principal (upload)
- WhatsApp: número do dono (máscara BR), toggle ativar/desativar envio automático
- Preview da mensagem de pedido que o cliente vai enviar

---

### 5. Master Admin (/master)
Painel exclusivo do Diego (super admin).

**Sidebar:**
- Dashboard
- Lojas
- Usuários
- Configurações

**Dashboard:**
- Total de lojas cadastradas
- Lojas ativas vs travadas
- Total de pedidos (global)
- Novos cadastros (últimos 7 dias)

**Lojas (/master/stores):**
- Tabela com: nome da loja, dono (nome + email + telefone), data cadastro, status (ativa/travada), trial (dias restantes)
- Toggle liga/desliga por loja
- Definir dias de trial
- Ver detalhes: métricas da loja, produtos, pedidos
- Link direto para a loja pública

**Usuários (/master/users):**
- Lista de todos os usuários cadastrados
- Dados: nome, email, loja vinculada, data cadastro

**Configurações (/master/settings):**
- Trial padrão (quantidade de dias)
- Dados da plataforma
- Loja demo (configurar qual loja é a demo)

---

## Sistema de Trial

**Funcionamento:**
- Ao criar a loja, `trial_ends_at` é definido como `NOW() + X dias` (configurável pelo master)
- Default: 14 dias (ajustável)
- No storefront: aviso sutil quando faltam poucos dias (ex: faixa superior discreta)
- Quando expira: `is_active = false`
  - Loja continua visível (vitrine aparece)
  - Pedidos são bloqueados
  - No admin da loja: aviso para "ativar plano" com contato
- Master pode: estender trial, ativar/desativar manualmente
- Cobrança é feita por fora (pessoalmente pelo Diego)

---

## WhatsApp

**Configuração:** feita pelo dono da loja em Configurações
- Campo: número de WhatsApp (com máscara BR)
- Toggle: ativar/desativar envio automático

**Envio:** via link `https://wa.me/{numero}?text={mensagem_codificada}`
- Ao confirmar pedido, abre WhatsApp Web/App com mensagem pré-formatada
- Mensagem inclui: número do pedido, itens, variações, quantidades, total, dados do cliente

**Template da mensagem:**
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
│   ├── page.tsx              # Landing Page
│   ├── login/page.tsx        # Login
│   ├── register/page.tsx     # Registro + Criar loja
│   ├── demo/page.tsx         # Loja demo
│   ├── [slug]/               # Loja pública dinâmica
│   │   ├── page.tsx          # Vitrine
│   │   └── checkout/page.tsx # Checkout da loja
│   ├── admin/                # Admin da loja
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Dashboard
│   │   ├── products/
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── banners/
│   │   └── settings/
│   └── master/               # Master admin (Diego)
│       ├── layout.tsx
│       ├── page.tsx          # Dashboard master
│       ├── stores/
│       ├── users/
│       └── settings/
├── components/
│   ├── ui/                   # Design system (Button, Card, Input, etc)
│   ├── store/                # Componentes da loja pública
│   ├── admin/                # Componentes do admin
│   └── master/               # Componentes do master
├── lib/
│   ├── supabase.ts           # Cliente Supabase
│   ├── supabase-server.ts    # Cliente server-side
│   └── utils.ts              # Utilitários
├── services/                 # Camada de dados
│   ├── storeService.ts
│   ├── productService.ts
│   ├── categoryService.ts
│   ├── orderService.ts
│   └── userService.ts
├── types/                    # TypeScript types
│   ├── store.ts
│   ├── product.ts
│   ├── category.ts
│   ├── order.ts
│   └── user.ts
├── hooks/                    # Custom hooks
│   ├── useAuth.ts
│   ├── useStore.ts
│   └── useCart.ts
└── middleware.ts              # Proteção de rotas
```

---

## Design System

**Filosofia:** Premium, moderno, limpo. Nada de "template Bootstrap".

**Paleta:**
- Fundo principal: branco / cinza muito claro
- Texto: cinza escuro / preto
- Accent: definido por loja (cor primária configurável)
- Sucesso: verde
- Alerta: amarelo
- Erro: vermelho

**Tipografia:**
- Font principal: Inter ou system-ui
- Títulos: bold, tracking tight
- Body: regular, line-height confortável

**Componentes base:**
- Button (primary, secondary, outline, ghost, danger)
- Card (com hover suave)
- Input (com label, placeholder, erro)
- Badge (status colors)
- Modal/Dialog (Radix UI)
- Dropdown/Select
- Table (com hover, zebra opcional)
- Toast/Notification (ao invés de alert())
- Skeleton (loading states)
- Avatar
- Tabs

**Admin:**
- Sidebar escura (cinza 900)
- Header com breadcrumbs
- Cards de métricas com ícones
- Tabelas com ações inline

**Storefront:**
- Layout limpo, muito espaço em branco
- Cards de produto com sombra suave
- Animações sutis (hover, transições)
- Mobile-first, totalmente responsivo

---

## Regras de Desenvolvimento

1. **Sempre filtrar por store_id** — nunca buscar dados sem isolamento de loja
2. **Nunca expor dados entre lojas** — RLS é a última linha de defesa, mas o código deve validar também
3. **Mobile-first** — toda UI deve funcionar perfeitamente no celular
4. **Sem alert()** — usar toasts/notificações bonitas
5. **Loading states** — skeleton em toda listagem, spinner em ações
6. **Tratamento de erros** — try/catch com feedback visual ao usuário
7. **Sem localStorage para dados críticos** — carrinho pode usar localStorage, mas com validação
8. **Imagens otimizadas** — next/image quando possível, fallback graceful
9. **TypeScript strict** — tipos definidos para tudo

---

## Fases de Desenvolvimento

### Fase 1 — Base (Fundação)
- [ ] Criar projeto Next.js do zero
- [ ] Configurar Supabase (schema + RLS + storage)
- [ ] Design system (componentes UI base)
- [ ] Auth (login + registro + middleware)
- [ ] Criar estrutura de pastas

### Fase 2 — Admin da Loja
- [ ] Layout admin (sidebar + header)
- [ ] Dashboard com métricas
- [ ] CRUD de categorias
- [ ] CRUD de produtos com variações e imagens
- [ ] Gestão de pedidos (tabela + detalhes + status)
- [ ] Configurações da loja
- [ ] Banners

### Fase 3 — Storefront (Loja Pública)
- [ ] Layout da loja (header + categorias + grid)
- [ ] Card de produto com variações e quantidade
- [ ] Carrinho (drawer)
- [ ] Checkout com formulário
- [ ] Envio de pedido (banco + WhatsApp opcional)
- [ ] Tela de confirmação

### Fase 4 — Landing Page + Demo
- [ ] Landing page premium
- [ ] Loja demo funcional (tema genérico, produtos realistas mostrando todas as features)
- [ ] Admin demo com acesso aberto (sem senha, visitante experimenta o painel)
- [ ] Página de registro (nome + email + senha + nome da loja → cria tudo de uma vez)

### Fase 5 — Master Admin
- [ ] Layout master (sidebar separada)
- [ ] Dashboard com métricas globais
- [ ] Gestão de lojas (tabela + toggle ativo/inativo)
- [ ] Sistema de trial (definir período, bloquear loja)
- [ ] Gestão de usuários

### Fase 6 — Polish
- [ ] Testes de fluxo completo
- [ ] Responsividade total
- [ ] Performance (lazy loading, skeleton)
- [ ] Deploy na Vercel
- [ ] Domínio

---

## Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
NEXT_PUBLIC_APP_URL=https://seusistema.com
```

---

## Notas Importantes

- **Sem sistema de pagamento online** — cobrança é feita pessoalmente pelo Diego
- **Sem sistema de entrega/frete** — o pedido é apenas registrado, entrega é por conta do dono da loja
- **WhatsApp é via link** — ao confirmar pedido, abre wa.me no dispositivo do cliente com mensagem pré-formatada pro dono da loja. Não é API.
- **Trial é simples** — data de expiração + flag ativo/inativo, sem automação complexa
- **Uma loja por usuário** (MVP) — no futuro pode expandir
- **Rodapé de toda loja** — "Powered by Fosfo" com link para fosfo.com.br
- **Personalização da loja** — apenas: logo, cor primária, banner. Sem troca de fonte ou cor de texto.
- **Demo aberta** — admin demo acessível sem login, para o visitante experimentar o painel
- **URL das lojas** — formato seusite.com/slug-da-loja (rota dinâmica [slug])
- **Supabase** — projeto novo do zero
- **Placeholder de produto** — imagem padrão bonita quando o dono não envia foto
- **Confirmação de pedido** — modal amigável (não alert()), com número do pedido
- **Banners** — carrossel com múltiplos banners na loja pública
