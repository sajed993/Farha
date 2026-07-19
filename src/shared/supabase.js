// ═══ فرحة — Supabase client (shared by site + dashboard) ═══
// The publishable key is PUBLIC by design; Row-Level Security in
// supabase/schema.sql is what protects the data.
import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://fsxmplaxaczcbtswtupi.supabase.co'
export const SUPABASE_KEY = 'sb_publishable_InZlwlIkmaxQFB-b7b_3Dg_XO4XPpWv'

let client = null
try {
  client = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true },
  })
} catch (e) {
  console.warn('[farha] supabase init failed — running in local mode', e)
}

export const sb = client
