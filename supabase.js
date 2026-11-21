/**
 * INISIALISASI SUPABASE CLIENT
 * Membaca konfigurasi dari window.APP_CONFIG (config.js) atau fallback otomatis.
 */

(function () {
    const config = window.APP_CONFIG || {};

    const SUPABASE_URL = config.SUPABASE_URL || "https://rvezikcdevujmubtfoac.supabase.co";
    const SUPABASE_KEY = config.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_eq92XZkau3Z2WhmQfeFPtg_oz9iUOqh";

    if (typeof window.supabase === "undefined" || !window.supabase.createClient) {
        console.warn("Library @supabase/supabase-js belum dimuat di halaman.");
        return;
    }

    try {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
            auth: {
                persistSession: false
            }
        });
        console.log("Supabase Client berhasil diinisialisasi.");
    } catch (err) {
        console.error("Gagal menginisialisasi Supabase Client:", err);
    }
})();
