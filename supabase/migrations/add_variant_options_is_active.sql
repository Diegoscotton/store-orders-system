-- Adicionar is_active em variant_options
ALTER TABLE variant_options ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Criar índice para filtrar opções ativas
CREATE INDEX IF NOT EXISTS idx_variant_options_active ON variant_options(variant_id, is_active);
