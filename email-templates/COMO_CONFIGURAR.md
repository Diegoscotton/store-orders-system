# Como Configurar o Template de Email no Supabase

## 📧 Template de Recuperação de Senha

O arquivo `reset-password.html` contém um template profissional e amigável para o email de recuperação de senha.

---

## 🔧 Passos para Configurar:

### 1. Acessar o Dashboard do Supabase
1. Vá para: https://supabase.com/dashboard/project/lfeoismqsjvgvpjceger/auth/templates
2. Faça login se necessário

### 2. Selecionar o Template
1. No menu lateral, clique em **Authentication** → **Email Templates**
2. Procure por **"Reset Password"** ou **"Magic Link"**
3. Clique para editar

### 3. Colar o Template
1. Abra o arquivo `reset-password.html` deste diretório
2. Copie **todo o conteúdo** do arquivo
3. Cole no editor do Supabase, substituindo o template padrão
4. Clique em **Save** ou **Salvar**

### 4. Testar
1. Acesse http://localhost:3000/forgot-password
2. Digite um email cadastrado
3. Verifique a caixa de entrada
4. O email deve aparecer com o novo design

---

## ✨ Características do Template:

- **Header escuro** (#111c14) com logo e nome do sistema
- **Mensagem amigável** com emoji 👋
- **Botão CTA** grande e visível para redefinir senha
- **Aviso de expiração** em destaque (1 hora)
- **Footer** com link para fosfo.com.br
- **Link alternativo** caso o botão não funcione
- **Responsivo** - funciona em desktop e mobile

---

## 🎨 Cores Usadas:

- **Verde Fosfo**: `#639922` (links e destaques)
- **Preto**: `#111827` (botão principal)
- **Fundo escuro**: `#111c14` (header)
- **Cinzas**: `#6b7280`, `#9ca3af` (textos secundários)

---

## 📝 Variáveis do Supabase:

O template usa estas variáveis que o Supabase substitui automaticamente:

- `{{ .ConfirmationURL }}` - Link completo de recuperação de senha
- `{{ .Email }}` - Email do usuário (opcional, não usado neste template)
- `{{ .Token }}` - Token de reset (opcional, não usado)

---

## ⚠️ Importante:

- **Não altere** as variáveis `{{ .ConfirmationURL }}`
- O template é **global** para todos os usuários
- Não é possível personalizar por loja individual
- O link expira em 1 hora (configuração padrão do Supabase)

---

## 🔄 Outros Templates:

Você pode usar o mesmo estilo para outros emails:
- **Confirm Signup** - Email de confirmação de cadastro
- **Invite User** - Convite de usuário
- **Magic Link** - Login sem senha

Basta adaptar o conteúdo mantendo a mesma estrutura visual.
