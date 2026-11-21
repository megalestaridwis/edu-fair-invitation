/**
 * KONFIGURASI CLIENT-SIDE (FRONTEND) SUPABASE
 * 
 * CATATAN KEAMANAN PENTING:
 * 1. Di browser / frontend, HANYA gunakan 'SUPABASE_PUBLISHABLE_KEY' (anon/public key).
 * 2. JANGAN PERNAH memasukkan 'SUPABASE_PRIVATE_KEY' (service_role) atau Password Database PostgreSQL ke file frontend ini!
 * 3. Keamanan database dijaga oleh Row Level Security (RLS) di Supabase.
 */

window.APP_CONFIG = {
    SUPABASE_URL: "https://rvezikcdevujmubtfoac.supabase.co",
    SUPABASE_PUBLISHABLE_KEY: "sb_publishable_eq92XZkau3Z2WhmQfeFPtg_oz9iUOqh"
};
