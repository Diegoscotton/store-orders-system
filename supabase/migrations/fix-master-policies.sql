-- Master Admin: policies para ler dados de todas as lojas

-- Platform settings: master pode gerenciar
DROP POLICY IF EXISTS "platform_settings_manage" ON platform_settings;
CREATE POLICY "platform_settings_manage" ON platform_settings
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM store_users WHERE user_id = auth.uid() AND role = 'master')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM store_users WHERE user_id = auth.uid() AND role = 'master')
  );
