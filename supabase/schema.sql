-- ============================================
-- SISTEMA DE PEDIDOS FOSFO — Schema v2
-- ============================================
-- Executar no Supabase SQL Editor (na ordem)
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABELAS
-- ============================================

-- Perfis de usuário (espelha auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'master')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lojas (multi-tenant)
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Visual
  logo_url TEXT,
  banner_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  
  -- WhatsApp
  whatsapp_number TEXT,
  whatsapp_enabled BOOLEAN DEFAULT FALSE,
  
  -- Trial / Status
  is_active BOOLEAN DEFAULT TRUE,
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vínculo usuário-loja (suporte futuro a múltiplos admins)
CREATE TABLE store_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'master')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, store_id)
);

-- Categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slug, store_id)
);

-- Produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Imagens dos produtos
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tipos de variação (ex: "Tamanho", "Sabor", "Cor")
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opções de variação (ex: "Pequeno" = R$10, "Grande" = R$15)
CREATE TABLE variant_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) DEFAULT 0,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banners da loja
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  link_url TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number SERIAL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  notes TEXT,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'accepted', 'preparing', 'ready', 'delivered', 'cancelled')
  ),
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens do pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variant_description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configurações da plataforma (master)
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ÍNDICES
-- ============================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_owner ON stores(owner_id);
CREATE INDEX idx_stores_active ON stores(is_active);
CREATE INDEX idx_store_users_user ON store_users(user_id);
CREATE INDEX idx_store_users_store ON store_users(store_id);
CREATE INDEX idx_categories_store ON categories(store_id);
CREATE INDEX idx_categories_position ON categories(store_id, position);
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(store_id, is_active);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_variant_options_variant ON variant_options(variant_id);
CREATE INDEX idx_banners_store ON banners(store_id);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(store_id, status);
CREATE INDEX idx_orders_created ON orders(store_id, created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3.1 PROFILES
-- ============================================

-- Usuário vê próprio perfil
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Usuário atualiza próprio perfil
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Master vê todos os perfis
CREATE POLICY "Master reads all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master')
  );

-- Insert via trigger (ver seção 4)
CREATE POLICY "Service insert profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 3.2 STORES
-- ============================================

-- Público vê lojas ativas
CREATE POLICY "Public reads active stores" ON stores
  FOR SELECT USING (true);

-- Dono gerencia própria loja
CREATE POLICY "Owner manages own store" ON stores
  FOR ALL USING (owner_id = auth.uid());

-- Master gerencia todas as lojas
CREATE POLICY "Master manages all stores" ON stores
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master')
  );

-- ============================================
-- 3.3 STORE_USERS
-- ============================================

CREATE POLICY "Users read own assignments" ON store_users
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Store owner manages assignments" ON store_users
  FOR ALL USING (
    store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

CREATE POLICY "Master manages all assignments" ON store_users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master')
  );

-- Insert para registro (usuário cria próprio vínculo)
CREATE POLICY "Users create own assignment" ON store_users
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================
-- 3.4 CATEGORIAS
-- ============================================

-- Público lê categorias
CREATE POLICY "Public reads categories" ON categories
  FOR SELECT USING (true);

-- Admin gerencia categorias da própria loja
CREATE POLICY "Admin manages store categories" ON categories
  FOR ALL USING (
    store_id IN (SELECT store_id FROM store_users WHERE user_id = auth.uid())
  );

-- ============================================
-- 3.5 PRODUTOS
-- ============================================

-- Público lê produtos ativos
CREATE POLICY "Public reads products" ON products
  FOR SELECT USING (true);

-- Admin gerencia produtos da própria loja
CREATE POLICY "Admin manages store products" ON products
  FOR ALL USING (
    store_id IN (SELECT store_id FROM store_users WHERE user_id = auth.uid())
  );

-- ============================================
-- 3.6 IMAGENS DE PRODUTO
-- ============================================

CREATE POLICY "Public reads product images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Admin manages product images" ON product_images
  FOR ALL USING (
    product_id IN (
      SELECT id FROM products WHERE store_id IN (
        SELECT store_id FROM store_users WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================
-- 3.7 VARIAÇÕES
-- ============================================

CREATE POLICY "Public reads variants" ON product_variants
  FOR SELECT USING (true);

CREATE POLICY "Admin manages variants" ON product_variants
  FOR ALL USING (
    product_id IN (
      SELECT id FROM products WHERE store_id IN (
        SELECT store_id FROM store_users WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Public reads variant options" ON variant_options
  FOR SELECT USING (true);

CREATE POLICY "Admin manages variant options" ON variant_options
  FOR ALL USING (
    variant_id IN (
      SELECT id FROM product_variants WHERE product_id IN (
        SELECT id FROM products WHERE store_id IN (
          SELECT store_id FROM store_users WHERE user_id = auth.uid()
        )
      )
    )
  );

-- ============================================
-- 3.8 BANNERS
-- ============================================

CREATE POLICY "Public reads active banners" ON banners
  FOR SELECT USING (true);

CREATE POLICY "Admin manages banners" ON banners
  FOR ALL USING (
    store_id IN (SELECT store_id FROM store_users WHERE user_id = auth.uid())
  );

-- ============================================
-- 3.9 PEDIDOS
-- ============================================

-- Público cria pedidos (qualquer visitante pode fazer pedido)
CREATE POLICY "Public creates orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Admin lê pedidos da própria loja
CREATE POLICY "Admin reads store orders" ON orders
  FOR SELECT USING (
    store_id IN (SELECT store_id FROM store_users WHERE user_id = auth.uid())
  );

-- Admin atualiza pedidos da própria loja
CREATE POLICY "Admin updates store orders" ON orders
  FOR UPDATE USING (
    store_id IN (SELECT store_id FROM store_users WHERE user_id = auth.uid())
  );

-- Master lê todos os pedidos
CREATE POLICY "Master reads all orders" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master')
  );

-- ============================================
-- 3.10 ITENS DO PEDIDO
-- ============================================

CREATE POLICY "Public creates order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin reads store order items" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE store_id IN (
        SELECT store_id FROM store_users WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Master reads all order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master')
  );

-- ============================================
-- 3.11 CONFIGURAÇÕES DA PLATAFORMA
-- ============================================

CREATE POLICY "Master manages platform settings" ON platform_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master')
  );

CREATE POLICY "Public reads platform settings" ON platform_settings
  FOR SELECT USING (true);

-- ============================================
-- 4. FUNÇÕES E TRIGGERS
-- ============================================

-- Criar perfil automaticamente ao registrar
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 5. STORAGE BUCKETS
-- ============================================
-- Executar separadamente no Supabase Dashboard > Storage

-- Bucket: store-assets (logos, banners)
-- Bucket: product-images (fotos dos produtos)

-- Policies de storage (aplicar via Dashboard):
-- store-assets: public read, authenticated upload/delete
-- product-images: public read, authenticated upload/delete

-- ============================================
-- 6. DADOS INICIAIS
-- ============================================

-- Configurações padrão da plataforma
INSERT INTO platform_settings (key, value) VALUES
  ('default_trial_days', '14'),
  ('platform_name', 'Sistema de Pedidos Fosfo'),
  ('demo_store_slug', 'demo');

-- ============================================
-- NOTAS:
-- ============================================
-- Após executar este schema:
-- 1. Criar buckets de storage (store-assets, product-images)
-- 2. Configurar policies de storage
-- 3. Criar seu usuário master manualmente:
--    a. Registrar via app
--    b. UPDATE profiles SET role = 'master' WHERE id = 'seu-user-id';
-- 4. Criar loja demo para testes
