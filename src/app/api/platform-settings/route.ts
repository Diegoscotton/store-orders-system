import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from('platform_settings')
      .select('*')

    if (error) throw error

    const settings: Record<string, string> = {}
    data?.forEach((s) => { settings[s.key] = s.value })

    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
