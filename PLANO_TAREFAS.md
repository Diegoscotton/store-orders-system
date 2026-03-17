# PLANO DE TAREFAS — Sistema de Pedidos Fosfo
> Use este documento como guia no Windsurf (Cascade). Cole no chat e peça para executar tarefa por tarefa.
> Leia sempre o PROJECT_CONTEXT.md e o .windsurfrules antes de qualquer alteração.

---

## STATUS ATUAL (17/03/2026)

### ✅ CONCLUÍDO
- Projeto Next.js 16 + React 19 + TypeScript + Tailwind 4 + Supabase
- Auth: login + registro (cria conta + loja automaticamente)
- Admin da Loja: dashboard, produtos (CRUD + variações + imagens), categorias, pedidos (tabela + status + impressão A4), banners (upload + carrossel + reordenar), configurações (logo, cor, banner, WhatsApp)
- Storefront: grid de produtos, modal de detalhes com variações, carrinho drawer, checkout com gravação + WhatsApp
- Master Admin: dashboard com métricas, gestão de lojas (toggle on/off, trial, detalhes), usuários, configurações da plataforma
- Formatação BRL nos preços, máscara de telefone BR
- Middleware protegendo rotas /admin e /master com role check

### ⏳ PRÓXIMAS TAREFAS (em ordem de prioridade)

---

## TAREFA 1 — Loja Demo funcional
**Prioridade:** Alta
**Descrição:** Criar uma loja demo com produtos realistas para demonstração.

### O que fazer:
1. No banco (Supabase), criar uma loja com slug "demo" vinculada ao master
2. Ajustar `/demo/page.tsx` para redirecionar para `/demo` (a loja pública)
3. Criar um admin demo em `/demo/admin` com acesso aberto (sem senha) — o visitante pode ver o painel sem fazer login
4. Popular a loja demo com categorias e produtos realistas (usar tema genérico como confeitaria/doces que agrada qualquer público)

### Regras:
- A loja demo deve mostrar TODAS as funcionalidades: categorias, produtos com variações, imagens, banners, carrinho funcional
- O admin demo deve ser READ-ONLY (visitante vê mas não altera)
- Produtos demo devem ter fotos placeholder bonitas (usar URLs de imagens gratuitas)

---

## TAREFA 2 — Refinar Landing Page
**Prioridade:** Alta
**Descrição:** Melhorar a LP de venda do sistema para converter visitantes.

### O que fazer:
1. Melhorar o hero com headline mais impactante
2. Adicionar seção de screenshots/mockups do sistema (pode ser prints reais)
3. Adicionar seção de números ("Crie sua loja em 2 minutos", "100% gratuito para testar")
4. Adicionar seção de FAQ (perguntas frequentes)
5. Melhorar o CTA final
6. Links corretos: "Ver demonstração" → `/demo`, "Ver admin demo" → `/demo/admin`, "Criar minha loja" → `/register`

### Regras:
- Design premium, NÃO pode parecer template
- Mobile-first
- Manter o "Powered by Fosfo" no footer
- Sem animações pesadas — transições sutis apenas

---

## TAREFA 3 — Polish: Responsividade Mobile
**Prioridade:** Alta
**Descrição:** Passe completo de otimização mobile em TODAS as telas.

### Admin (mobile):
- Sidebar vira menu hambúrguer com overlay (toggle no header)
- Tabelas viram cards empilhados em telas < 768px
- Formulários full-width
- Modais ocupam tela inteira no mobile
- Botões de ação com touch targets de pelo menos 44x44px

### Loja pública (mobile):
- Grid de produtos: 1 coluna no mobile, 2 em tablet, 3-4 em desktop
- Carrinho drawer: full-screen no mobile
- Modal de produto: full-screen no mobile com scroll interno
- Header: logo menor, botão carrinho com badge
- Checkout: single-column, campos full-width
- Seletor de categorias: scroll horizontal com overflow

### Landing Page (mobile):
- Hero empilhado (texto acima, CTA abaixo)
- Cards de features empilhados
- Fontes ajustadas para legibilidade
- CTAs full-width no mobile

### Como testar:
- Chrome DevTools → toggle device toolbar (Cmd+Shift+M)
- Testar em: iPhone SE (375px), iPhone 14 (390px), iPad (768px)

---

## TAREFA 4 — Polish: Refinamento UI da Loja Pública
**Prioridade:** Alta
**Descrição:** Elevar o design da loja pública para nível premium.

### Cards de produto:
- Hover com scale sutil (transform: scale(1.02))
- Sombra mais pronunciada no hover
- Badge de categoria com design mais elegante
- Preço com destaque visual (tamanho maior, cor accent da loja)
- Transições suaves em tudo

### Modal de produto:
- Galeria de imagens com thumbnails (swipe no mobile)
- Variações como pills bonitas (selecionada = cor primária da loja)
- Seletor de quantidade com design premium (+/- com bordas arredondadas)
- Preço atualizando com animação suave ao trocar variação
- Botão "Adicionar" usando a cor primária da loja

### Carrinho drawer:
- Animação de entrada (slide from right)
- Items com foto, nome, variação, quantidade editável, preço
- Botão remover discreto
- Total fixo no bottom
- Botão "Finalizar" com destaque

### Checkout:
- Layout limpo com bastante espaço
- Formulário organizado em seções (dados pessoais, endereço, observações)
- Resumo do pedido visual (com fotos dos items)
- Modal de sucesso bonito (já existe, só refinar)

### Header da loja:
- Logo + nome alinhados
- Descrição da loja (se tiver)
- Botão carrinho com badge de quantidade (animação ao adicionar)
- Usar cor primária da loja nos elementos de destaque

### Footer:
- "Powered by Fosfo" discreto e elegante

---

## TAREFA 5 — Polish: Refinamento UI do Admin
**Prioridade:** Média
**Descrição:** Ajustes finais no painel admin.

### O que fazer:
- Verificar consistência visual entre todas as páginas
- Loading states com skeleton em toda listagem
- Empty states bonitos em toda página sem dados
- Toasts para todas as ações (nunca alert())
- Transições suaves na navegação da sidebar
- Breadcrumbs no header (ex: "Produtos > Editar > Pizza Calabresa")

---

## TAREFA 6 — Deploy na Vercel
**Prioridade:** Alta (após polish)
**Descrição:** Publicar o sistema.

### O que fazer:
1. Criar conta na Vercel (vercel.com)
2. Conectar repositório Git (ou fazer deploy direto)
3. Configurar variáveis de ambiente:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXT_PUBLIC_APP_URL (URL do Vercel)
4. Fazer deploy
5. Testar todas as funcionalidades em produção
6. Configurar domínio (se tiver)

---

## REGRAS GERAIS (lembrar sempre)

1. **Sempre filtrar por store_id** — multi-tenant obrigatório
2. **Nunca usar alert()** — sempre Toast
3. **Mobile-first** — testar no celular
4. **TypeScript strict** — sem `any` desnecessário
5. **Usar componentes do design system** — Button, Input, Card, Badge, Modal, Toast, Skeleton, CurrencyInput, PhoneInput
6. **Sem localStorage para dados críticos** — apenas carrinho
7. **Loading states** — Skeleton em listagens, spinner em botões
8. **Tratamento de erros** — try/catch com toast de feedback
9. **Build deve compilar** — rodar `npm run build` antes de cada entrega

---

## INFORMAÇÕES TÉCNICAS

### Supabase
- URL: https://lfeoismqsjvgvpjceger.supabase.co
- Storage: store-assets (logos, banners), product-images (fotos de produtos)
- Auth: email/password, confirm email DESATIVADO
- Master: diego@fosfo.com.br

### Estrutura de rotas
- `/` — Landing Page
- `/login` — Login
- `/register` — Registro (cria conta + loja)
- `/demo` — Loja demo
- `/demo/admin` — Admin demo (sem senha)
- `/[slug]` — Loja pública dinâmica
- `/[slug]/checkout` — Checkout
- `/admin/*` — Painel do dono da loja
- `/master/*` — Painel master (Diego)
