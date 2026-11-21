const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase Server Client (menggunakan Secret / Private Key secara aman di sisi server)
const supabaseUrl = process.env.SUPABASE_URL || "https://rvezikcdevujmubtfoac.supabase.co";
const supabaseSecretKey = process.env.SUPABASE_PRIVATE_KEY;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_eq92XZkau3Z2WhmQfeFPtg_oz9iUOqh";

let supabaseServerClient = null;
if (supabaseUrl && supabaseSecretKey) {
    try {
        supabaseServerClient = createClient(supabaseUrl, supabaseSecretKey);
        console.log("Supabase Server Client aktif (menggunakan private key aman di server).");
    } catch (e) {
        console.warn("Peringatan inisialisasi Supabase Server:", e.message);
    }
}

// 1. Endpoint publik untuk konfigurasi client yang aman (HANYA publishable key, TANPA secret key)
app.get("/api/config", (req, res) => {
    res.json({
        supabaseUrl: supabaseUrl,
        supabasePublishableKey: supabasePublishableKey
    });
});

// 2. Endpoint API RSVP Server-Side (Opsional, jika ingin mengirim RSVP lewat API server)
app.post("/api/rsvp", async (req, res) => {
    try {
        const { nama, instansi, kategori, konfirmasi } = req.body;

        if (!nama || !konfirmasi) {
            return res.status(400).json({ error: "Nama dan konfirmasi wajib diisi." });
        }

        const client = supabaseServerClient || createClient(supabaseUrl, supabasePublishableKey);

        const { data, error } = await client
            .from("konfirmasi_kehadiran")
            .insert([{
                nama: String(nama).trim(),
                instansi: String(instansi || "").trim(),
                kategori: String(kategori || "Umum").trim(),
                konfirmasi: String(konfirmasi).trim()
            }])
            .select();

        if (error) {
            throw error;
        }

        res.json({
            success: true,
            message: "Konfirmasi kehadiran berhasil disimpan ke database.",
            data: data
        });
    } catch (err) {
        console.error("Error pada /api/rsvp:", err);
        res.status(500).json({ error: err.message || "Gagal menyimpan konfirmasi." });
    }
});

// 3. Endpoint API Ambil Data RSVP (untuk Admin)
app.get("/api/rsvp", async (req, res) => {
    try {
        const client = supabaseServerClient || createClient(supabaseUrl, supabasePublishableKey);

        const { data, error } = await client
            .from("konfirmasi_kehadiran")
            .select("*")
            .order("tanggal", { ascending: false });

        if (error) {
            throw error;
        }

        res.json({ success: true, data: data });
    } catch (err) {
        console.error("Error pada GET /api/rsvp:", err);
        res.status(500).json({ error: err.message || "Gagal mengambil data." });
    }
});

// 4. Melayani file-file statis (HTML, CSS, JS, Gambar, CSV)
app.use(express.static(path.join(__dirname)));

// Route halaman utama
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Route halaman admin
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "admin.html"));
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Server Edu Fair berjalan di http://localhost:${PORT}`);
    console.log(`📄 Halaman Undangan : http://localhost:${PORT}`);
    console.log(`📊 Halaman Admin    : http://localhost:${PORT}/admin.html`);
    console.log(`======================================================\n`);
});
