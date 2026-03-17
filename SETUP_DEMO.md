# 🎯 Setup da Loja Demo

## Opção 1: Via Script Automático (Recomendado)

Execute o script que criará toda a estrutura automaticamente:

```bash
node scripts/create-demo-store.js
```

O script vai pedir suas credenciais de master (diego@fosfo.com.br) e criará:
- ✅ Loja "Doce Sabor Confeitaria" com slug `demo`
- ✅ 4 categorias (Bolos, Doces, Salgados, Bebidas)
- ✅ 11 produtos com variações e imagens
- ✅ 3 banners para o carrossel

Após executar, acesse:
- **Loja pública:** http://localhost:3000/demo
- **Admin:** http://localhost:3000/admin (faça login como master)

---

## Opção 2: Via Interface Admin (Manual)

Se o script não funcionar, você pode criar manualmente:

### 1. Criar a Loja
1. Faça login como master em `/master`
2. Vá em "Lojas" → "Nova Loja"
3. Preencha:
   - **Nome:** Doce Sabor Confeitaria
   - **Slug:** demo
   - **Descrição:** Bolos, doces e salgados artesanais feitos com muito carinho
   - **Cor primária:** #ec4899 (rosa)
   - **WhatsApp:** (54) 99988-7766
   - **WhatsApp habilitado:** Sim
   - **Entrega habilitada:** Sim

### 2. Criar Categorias
Faça login como master e acesse `/admin` da loja demo:

1. **Bolos**
   - Descrição: Bolos artesanais para todas as ocasiões
   
2. **Doces**
   - Descrição: Docinhos e sobremesas deliciosas
   
3. **Salgados**
   - Descrição: Salgados fresquinhos e crocantes
   
4. **Bebidas**
   - Descrição: Bebidas geladas para acompanhar

### 3. Criar Produtos

#### BOLOS

**Bolo de Chocolate** (R$ 45,00)
- Descrição: Delicioso bolo de chocolate com cobertura cremosa. Massa fofinha e sabor irresistível.
- Categoria: Bolos
- Imagem: https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800
- Variação "Tamanho":
  - Pequeno (500g) - R$ 45,00
  - Médio (1kg) - R$ 75,00
  - Grande (2kg) - R$ 130,00

**Bolo de Morango** (R$ 55,00)
- Descrição: Bolo recheado com creme e morangos frescos. Perfeito para festas e celebrações.
- Categoria: Bolos
- Imagem: https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800
- Variação "Tamanho":
  - Pequeno (500g) - R$ 55,00
  - Médio (1kg) - R$ 90,00
  - Grande (2kg) - R$ 160,00

**Bolo de Cenoura** (R$ 40,00)
- Descrição: Tradicional bolo de cenoura com cobertura de chocolate. Um clássico que todos amam!
- Categoria: Bolos
- Imagem: https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800

#### DOCES

**Brigadeiro Gourmet** (R$ 3,50)
- Descrição: Brigadeiros artesanais feitos com chocolate belga. Diversos sabores disponíveis.
- Categoria: Doces
- Imagem: https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800
- Variação "Sabor":
  - Tradicional - R$ 3,50
  - Morango - R$ 4,00
  - Pistache - R$ 5,00
  - Maracujá - R$ 4,50

**Beijinho** (R$ 3,00)
- Descrição: Beijinho tradicional com coco ralado. Doce e delicado.
- Categoria: Doces
- Imagem: https://images.unsplash.com/photo-1558326567-98ae2405596b?w=800

**Brownie** (R$ 8,00)
- Descrição: Brownie de chocolate com pedaços de nozes. Crocante por fora, macio por dentro.
- Categoria: Doces
- Imagem: https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800

#### SALGADOS

**Coxinha de Frango** (R$ 6,00)
- Descrição: Coxinha tradicional com recheio generoso de frango desfiado. Crocante e saborosa.
- Categoria: Salgados
- Imagem: https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800

**Pastel Assado** (R$ 7,50)
- Descrição: Pastel assado recheado. Opção mais leve e saudável.
- Categoria: Salgados
- Imagem: https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800

**Empada de Palmito** (R$ 8,50)
- Descrição: Empada artesanal com recheio cremoso de palmito.
- Categoria: Salgados
- Imagem: https://images.unsplash.com/photo-1619740455993-9e0c797bfb0e?w=800

#### BEBIDAS

**Refrigerante** (R$ 5,00)
- Descrição: Refrigerante gelado para acompanhar seu pedido.
- Categoria: Bebidas
- Imagem: https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800
- Variação "Tamanho":
  - Lata 350ml - R$ 5,00
  - Garrafa 600ml - R$ 7,00
  - Garrafa 2L - R$ 12,00

**Suco Natural** (R$ 8,00)
- Descrição: Suco natural de frutas frescas. Sem conservantes.
- Categoria: Bebidas
- Imagem: https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800

### 4. Criar Banners

1. **Banner 1**
   - Imagem: https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1200
   - Título: Bolos Artesanais

2. **Banner 2**
   - Imagem: https://images.unsplash.com/photo-1558326567-98ae2405596b?w=1200
   - Título: Doces Gourmet

3. **Banner 3**
   - Imagem: https://images.unsplash.com/photo-1612874742237-6526221588e3?w=1200
   - Título: Salgados Fresquinhos

---

## Verificação

Após criar tudo, verifique:

- ✅ Loja acessível em `/demo`
- ✅ 4 categorias visíveis
- ✅ 11 produtos com fotos
- ✅ Carrossel de banners funcionando
- ✅ Carrinho funcionando
- ✅ Checkout funcionando
- ✅ Modal de produto com variações funcionando

---

## Próximos Passos

Depois de popular a loja demo, continue com:
- **TAREFA 2:** Refinar Landing Page
- **TAREFA 3:** Polish - Responsividade Mobile
- **TAREFA 4:** Polish - UI da Loja Pública
