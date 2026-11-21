
document.addEventListener("DOMContentLoaded", function () {

    async function muatDataTamu() {
        const tabelTamu = document.getElementById("tabelTamu");
        const statusData = document.getElementById("statusData");

        if (!tabelTamu) return;

        try {
            const response = await fetch("./data-tamu.csv");

            if (!response.ok) {
                throw new Error("File data-tamu.csv tidak ditemukan.");
            }

            const teksCSV = (await response.text()).replace(/^\uFEFF/, "");

            const baris = [];
            let kolom = [];
            let isi = "";
            let dalamKutip = false;

            for (let i = 0; i < teksCSV.length; i++) {
                const huruf = teksCSV[i];

                if (huruf === '"') {
                    if (dalamKutip && teksCSV[i + 1] === '"') {
                        isi += '"';
                        i++;
                    } else {
                        dalamKutip = !dalamKutip;
                    }
                } else if (huruf === "," && !dalamKutip) {
                    kolom.push(isi.trim());
                    isi = "";
                } else if ((huruf === "\n" || huruf === "\r") && !dalamKutip) {
                    if (huruf === "\r" && teksCSV[i + 1] === "\n") i++;

                    kolom.push(isi.trim());

                    if (kolom.some(nilai => nilai !== "")) {
                        baris.push(kolom);
                    }

                    kolom = [];
                    isi = "";
                } else {
                    isi += huruf;
                }
            }

            if (isi !== "" || kolom.length > 0) {
                kolom.push(isi.trim());
                baris.push(kolom);
            }

            if (baris.length < 2) {
                throw new Error("Data tamu di CSV masih kosong.");
            }

            const header = baris[0].map(h => h.trim());
            tabelTamu.innerHTML = "";

            for (let i = 1; i < baris.length; i++) {
                const data = {};

                header.forEach(function(namaKolom, index) {
                    data[namaKolom] = baris[i][index] || "";
                });

                const nama = data.nama_tamu;
                const instansi = data.instansi;
                const kategori = data.kategori;
                const nomor = (data.no_whatsapp || "").replace(/\D/g, "");

                const link = new URL("index.html", window.location.href);

                link.searchParams.set("nama", nama);
                link.searchParams.set("instansi", instansi);
                link.searchParams.set("kategori", kategori);

                let nomorWA = nomor;

                if (nomorWA.startsWith("0")) {
                    nomorWA = "62" + nomorWA.substring(1);
                }

                const pesan = "Halo " + nama +
                    ", berikut undangan Edu Fair & Career Day 2026: " +
                    link.href;

                const linkWA = "https://wa.me/" + nomorWA +
                    "?text=" + encodeURIComponent(pesan);

                const tr = document.createElement("tr");

                const tdNama = document.createElement("td");
                tdNama.textContent = nama;
                tr.appendChild(tdNama);

                const tdInstansi = document.createElement("td");
                tdInstansi.textContent = instansi;
                tr.appendChild(tdInstansi);

                const tdKategori = document.createElement("td");
                tdKategori.textContent = kategori;
                tr.appendChild(tdKategori);

                const tdWA = document.createElement("td");
                const tombolWA = document.createElement("a");

                tombolWA.href = linkWA;
                tombolWA.target = "_blank";
                tombolWA.textContent = "Kirim WhatsApp";

                tdWA.appendChild(tombolWA);
                tr.appendChild(tdWA);

                const tdUndangan = document.createElement("td");
                const tombolUndangan = document.createElement("a");

                tombolUndangan.href = link.href;
                tombolUndangan.target = "_blank";
                tombolUndangan.textContent = "Lihat Undangan";

                tdUndangan.appendChild(tombolUndangan);
                tr.appendChild(tdUndangan);

                tabelTamu.appendChild(tr);
            }

            if (statusData) {
                statusData.textContent =
                    "Berhasil memuat " + (baris.length - 1) + " data tamu.";
            }

        } catch (error) {
            console.error("Kesalahan membaca CSV:", error);

            if (statusData) {
                statusData.textContent = "Gagal memuat data: " + error.message;
            }
        }
    }

    const params = new URLSearchParams(window.location.search);

    const namaParam = (params.get("nama") || "").trim();
    const instansiParam = (params.get("instansi") || "").trim();
    const kategoriParam = (params.get("kategori") || "").trim();

    const elNamaPenerima = document.getElementById("namaPenerima");
    const elInstansiPenerima = document.getElementById("instansiPenerima");
    const elKategoriPenerima = document.getElementById("kategoriPenerima");

    const inputNama = document.getElementById("rsvpNama");
    const inputInstansi = document.getElementById("rsvpInstansi");

    if (elNamaPenerima) {
        elNamaPenerima.textContent = namaParam || "Tamu Undangan";
        if (elInstansiPenerima) elInstansiPenerima.textContent = instansiParam || "Instansi";
        if (elKategoriPenerima) elKategoriPenerima.textContent = kategoriParam || "Kategori Tamu";

        if (inputNama) {
            if (namaParam) {
                inputNama.value = namaParam;
                inputNama.readOnly = true;
                inputNama.style.backgroundColor = "#eef4fb";
            } else {
                inputNama.readOnly = false;
            }
        }

        if (inputInstansi) {
            if (instansiParam) {
                inputInstansi.value = instansiParam;
                inputInstansi.readOnly = true;
                inputInstansi.style.backgroundColor = "#eef4fb";
            } else {
                inputInstansi.readOnly = false;
            }
        }
    }

    const formRSVP = document.getElementById("formRSVP");

    if (formRSVP) {
        const pesan = document.getElementById("pesanRSVP");
        const selectKonfirmasi = document.getElementById("konfirmasi");
        const tombol = formRSVP.querySelector('button[type="submit"]');

        // Cek apakah tamu ini sudah pernah RSVP di perangkat ini
        const namaKunci = (namaParam || (inputNama ? inputNama.value : "")).toLowerCase();
        if (namaKunci && localStorage.getItem("rsvp_status_" + namaKunci)) {
            const statusSebelumnya = localStorage.getItem("rsvp_status_" + namaKunci);
            if (pesan) {
                pesan.innerHTML = `<span style="color:#105b33; font-weight:bold;">✓ Anda telah mengonfirmasi kehadiran sebelumnya: <strong>${statusSebelumnya}</strong>.</span>`;
            }
        }

        formRSVP.addEventListener("submit", async function (e) {
            e.preventDefault();

            const namaVal = (inputNama ? inputNama.value : namaParam).trim();
            const instansiVal = (inputInstansi ? inputInstansi.value : instansiParam).trim();
            const konfirmasi = selectKonfirmasi ? selectKonfirmasi.value : "";

            if (!namaVal) {
                pesan.style.color = "#c02b2b";
                pesan.textContent = "Silakan masukkan nama Anda.";
                return;
            }

            if (!instansiVal) {
                pesan.style.color = "#c02b2b";
                pesan.textContent = "Silakan masukkan instansi atau asal sekolah Anda.";
                return;
            }

            if (!konfirmasi) {
                pesan.style.color = "#c02b2b";
                pesan.textContent = "Silakan pilih konfirmasi kehadiran.";
                return;
            }

            if (!window.supabaseClient) {
                pesan.style.color = "#c02b2b";
                pesan.textContent = "Koneksi database belum tersedia. Pastikan config.js dan supabase.js termuat dengan benar.";
                return;
            }

            tombol.disabled = true;
            tombol.textContent = "Menyimpan ke database...";
            pesan.style.color = "#174879";
            pesan.textContent = "Sedang mengirim data konfirmasi...";

            try {
                const { data, error } = await window.supabaseClient
                    .from("konfirmasi_kehadiran")
                    .insert([{
                        nama: namaVal,
                        instansi: instansiVal,
                        kategori: kategoriParam || "Umum",
                        konfirmasi: konfirmasi
                    }]);

                if (error) {
                    throw error;
                }

                pesan.style.color = "#105b33";
                pesan.innerHTML = `<strong>✓ Terima kasih, ${namaVal}!</strong>.`;

                if (selectKonfirmasi) selectKonfirmasi.disabled = true;
                if (inputNama) inputNama.readOnly = true;
                if (inputInstansi) inputInstansi.readOnly = true;

                tombol.textContent = "✓ Konfirmasi Berhasil Dikirim";
                tombol.style.backgroundColor = "#27ae60";
                tombol.style.color = "#ffffff";

                // Simpan tanda di local storage
                localStorage.setItem("rsvp_status_" + namaVal.toLowerCase(), konfirmasi);

            } catch (error) {
                console.error("Gagal menyimpan RSVP:", error);
                pesan.style.color = "#c02b2b";
                pesan.textContent = "Gagal menyimpan konfirmasi: " + (error.message || error);

                tombol.disabled = false;
                tombol.textContent = "Kirim Konfirmasi Ulang";
            }
        });
    }

    muatDataTamu();

});
