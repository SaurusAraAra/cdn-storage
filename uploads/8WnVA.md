# Referensi API Custom Script Wibusoft (bot.*)

> Versi API: v1.0.0 · diperbarui 26 Juni 2026 (bot v4.9.0)

---

Versi API v1.0.0 · diperbarui 26 Juni 2026 (bot v4.9.0). Riwayat perubahan ada di Riwayat versi.
Dasar
Bahasa: JavaScript. async/await, Promise, JSON, Math, Date, String/Array/Object, dll tersedia.
Math.random() berfungsi acak (di-seed entropy host tiap eksekusi), aman dipakai untuk command acak.
Date "beku": sandbox tidak punya jam asli, jadi Date.now()/new Date() selalu balik waktu tetap (1 Jan 2022). Jangan dipakai untuk waktu nyata, untuk waktu pesan pakai bot.msg.timestamp (unix detik dari host).
Tidak ada timer. setTimeout/setInterval tidak tersedia. Hanya Promise/await (microtask) yang jalan. Untuk jeda nyata pakai await bot.sleep(ms) (lihat bawah). Tidak ada penjadwalan lintas-pesan; eksekusi sekali-jalan dengan budget 100 detik.
Cara dipicu: script jalan saat user mengetik prefix + nama script (atau alias). Mis. script cuaca dipicu #cuaca jakarta.
Command bawaan diutamakan. Kalau nama/alias sama dengan command bawaan yang aktif, yang jalan command bawaan. Tapi kalau command bawaan itu nonaktif/maintenance, bot fallback menjalankan script dengan trigger yang sama.
Harus di-approve. Saat mode approval aktif, script jalan setelah di-approve admin. Mengedit kode setelah approve bikin perlu di-approve ulang.
Membalas user: panggil bot.reply(...). Selain itu, kalau script me-return sebuah string, string itu juga otomatis dibalas.
// contoh paling sederhana
bot.reply("Halo " + bot.msg.pushName + "!")
bot.msg - info pesan & pengirim (read-only)
Properti	Keterangan
text	teks lengkap pesan
command	nama command yang dipakai (tanpa prefix)
isCommand	boolean - true hanya saat pesan benar-benar memicu command (andal di bot tanpa prefix; pakai ini untuk session-routing, bukan cek prefix manual)
prefix	prefix yang dipakai (mis. #)
arg	semua teks setelah command (mentah)
args	teks setelah command, dipecah per spasi (string[])
sender	JID pengirim
pushName	nama tampilan pengirim
isGroup	apakah pesan dari grup
isOwner	apakah pengirim owner bot
isGroupAdmin	apakah pengirim admin grup
quotedText	teks pesan yang di-reply (kalau ada)
id	ID pesan
timestamp	waktu pesan (unix detik)
isFromMe	apakah pesan dari bot sendiri
isForwarded	apakah pesan diteruskan
mentions	JID yang di-tag di pesan (string[])
mediaType	jenis media pemicu: image/video/audio/document/sticker, atau ""
mediaMime	mimetype media pemicu
hasMedia	apakah pesan punya media
isReply	apakah pesan ini me-reply pesan lain
quotedId	ID pesan yang di-reply
quotedSender	JID pengirim pesan yang di-reply
quotedPushName	nama pengirim pesan yang di-reply
quotedMediaType	jenis media pesan yang di-reply
quotedMediaMime	mimetype media pesan yang di-reply
// #salam budi  ->  args = ["budi"], arg = "budi"
bot.reply("Salam untuk " + bot.msg.arg)
Media: download & upload
bot.msg.download() / quotedDownload() - ambil byte media

Mengunduh media dari pesan pemicu (download) atau pesan yang di-reply (quotedDownload). Balik { ok, mime, size, base64 }, atau { ok: false } kalau tidak ada media. Maks 8 MB. base64-nya bisa dikirim ulang via bot.reply/send({ base64 }) atau diteruskan ke API lewat bot.http.

// re-upload gambar yang di-reply jadi balasan
if (bot.msg.quotedMediaType === "image") {
  const m = bot.msg.quotedDownload()
  if (m.ok) bot.reply({ base64: m.base64, caption: "ini gambarmu (" + m.mime + ")" })
}

Byte menyeberang ke script sebagai base64. Mengolah byte mentah di JS dibatasi 8 KB per nilai (lihat catatan biner di bagian bot.http). Untuk sekadar menjadikan media jadi URL publik, pakai upload()/quotedUpload() yang menangani byte di host (tanpa batas itu).

bot.msg.upload() / quotedUpload() - upload media jadi URL publik

Mengunggah media dari pesan pemicu (upload) atau pesan yang di-reply (quotedUpload) ke file host publik, lalu balik URL-nya. Berguna saat butuh meneruskan gambar ke API eksternal yang minta ?image=<url> (mis. popcat, removebg). Balik { ok, url, mime, size }, atau { ok: false } kalau tidak ada media. Maks 8 MB.

Beda dengan download(): byte di-download dan di-upload sepenuhnya di sisi host, byte tidak pernah masuk ke JS. Jadi tidak terkena batas biner sandbox, dan jauh lebih cepat daripada download() lalu upload manual lewat bot.http.

// reply gambar -> jadikan meme "wanted" lewat popcat
bot.react("📸")
if (bot.msg.quotedMediaType !== "image") {
  bot.reply("Reply gambar dulu.")
  return
}

const up = await bot.msg.quotedUpload()
if (!up.ok) {
  bot.reply("Gagal upload gambar.")
  return
}

await bot.reply({
  url: "https://api.popcat.xyz/v2/wanted?image=" + encodeURIComponent(up.url),
})
bot.msg.rawMsg() - proto pesan mentah

Balik proto pesan pemicu sebagai objek JSON (untuk membaca tipe pesan yang tidak tersedia di bot.msg.*). Dipanggil saat dibutuhkan saja. Proto ini berisi data mentah pesan, termasuk pointer enkripsi media (mediaKey, directPath, dll) untuk pesan tersebut. Hanya pesan pemicu yang diekspos.

const raw = bot.msg.rawMsg()
console.log(raw)   // mis. { conversation: "...", imageMessage: {...}, ... }
Mengirim pesan

bot.reply(x) balas pesan pemicu, bot.send(x) kirim ke chat tanpa nge-quote. x boleh string, atau objek { url | base64, caption, ...opsi } (media dari URL atau dari byte hasil download()).

Opsi objek (semua opsional):

caption: keterangan media.
base64: media hasil download()/quotedDownload() untuk dikirim ulang.
asDocument: kirim sebagai dokumen/file, bukan gambar/video.
fileName: nama file (untuk dokumen).
isVn: kirim audio sebagai voice note.
forward / forwardScore: tandai diteruskan + angka "forwarded many times".
asImage / asVideo / asAudio / asSticker: paksa jenis kiriman.
mentions: daftar JID yang di-tag (mis. ["628xx@s.whatsapp.net"]).
to: khusus bot.send - JID tujuan (mis. "628xx@s.whatsapp.net" atau "<id>@g.us"). Kosong = chat saat ini, JID tidak valid = error. bot.reply mengabaikan to.

Default webp = stiker. Media image/webp otomatis dikirim sebagai stiker. Untuk mengirimnya sebagai gambar biasa, paksa dengan asImage: true (atau asDocument: true).

bot.reply("teks biasa")
bot.reply({ url: "https://contoh.com/foto.jpg", caption: "ini fotonya" })
bot.send({ url: "https://contoh.com/file.pdf", asDocument: true, fileName: "materi.pdf" })
bot.send("dikirim tanpa quote")

Untuk { url }, bot mengunduh file-nya lewat proxy yang sama dengan bot.http (alamat internal/privat diblokir, maks 25 MB, URL harus publik). Untuk { base64 }, byte didecode di sisi host (tidak lewat proxy).

Nilai balik. bot.reply(...) dan bot.send(...) mengembalikan { id } (id pesan terkirim), berguna untuk bot.deleteMsg(id) nanti. Mis. const m = await bot.reply("loading..."); await bot.deleteMsg(m.id).

bot.react(emoji) - beri reaksi ke pesan pemicu
bot.react("🔥")
Moderasi (hapus pesan, kick) - butuh bot admin grup
Fungsi	Hasil
bot.msg.delete()	hapus pesan pemicu (revoke)
bot.msg.deleteQuoted()	hapus pesan yang di-reply
bot.deleteMsg(id, sender?)	hapus pesan id di chat ini; sender kosong = pesan bot sendiri
bot.group.kick(jid)	keluarkan anggota dari grup ini (mis. bot.msg.sender)

Semua terbatas ke chat/grup tempat script jalan. Menghapus pesan orang lain atau kick butuh bot jadi admin grup, kalau bukan admin fungsi melempar error (bungkus dengan try/catch). bot.group bernilai null di chat pribadi.

// anti-link sederhana (dipakai sebagai EventCode - lihat bagian Event-script)
if (!bot.event || bot.event.type !== "message") return  // skip event grup (bot.msg null di sana)
if (!bot.msg.isGroup) return
if (!/(https?:\/\/|chat\.whatsapp\.com)/i.test(bot.msg.text || "")) return
try { bot.msg.delete() } catch (e) {}
bot.reply({ text: "Link tidak diperbolehkan.", mentions: [bot.msg.sender] })
bot.handled()   // stop: jangan teruskan ke command lain
bot.sleep(ms) - jeda

Menunda eksekusi ms milidetik (jeda nyata di host). Maks 30 detik, dihitung ke budget 100 detik. Berguna untuk "tunggu sebentar lalu kirim".

bot.reply("sebentar ya...")
await bot.sleep(2000)
bot.reply("ini setelah 2 detik")
bot.createSticker(base64, opts?) - buat stiker webp

Mengubah gambar/video (base64, mis. dari download()) menjadi stiker webp di sisi host. Balik { base64, mime: "image/webp" }, melempar error kalau gagal (bungkus try/catch). opts = { pack?, author? } menimpa metadata stiker default device. Maks 8 MB.

const img = await bot.msg.quotedDownload()
const st = await bot.createSticker(img.base64, { pack: "Wibu", author: "Bot" })
await bot.reply({ base64: st.base64 })   // webp -> stiker
bot.convertSticker(base64, opts?) - stiker jadi gambar/video

Kebalikan createSticker: mengubah stiker (webp, mis. dari quotedDownload()) menjadi gambar atau video, di sisi host. opts = { animated? } - false (default) = gambar, true = video. Balik { base64, mime }, melempar error kalau gagal (bungkus try/catch). Maks 8 MB.

const st = await bot.msg.quotedDownload()              // stiker webp
const out = await bot.convertSticker(st.base64, { animated: true })   // -> video
await bot.reply({ base64: out.base64 })                // bytes -> auto image/video
bot.http & fetch - request HTTP keluar

Tersedia bot.http.get(url, opts), bot.http.post(url, opts), dan alias global fetch(url, opts) (semua rute & aturan sama). Semua request wajib lewat proxy sistem, alamat internal/privat diblokir, cuma http/https.

Opsi (body, pilih salah satu):

headers: objek header.
body: string / objek (jadi JSON) / Uint8Array (biner).
form: objek, dikirim x-www-form-urlencoded.
multipart: array { name, value | base64, filename?, contentType? }. value = string/Uint8Array (dibangun di JS, kena batas biner 8 KB). base64 = string base64 yang di-decode di host (biner ukuran berapa pun tanpa batas itu, mis. langsung dari download().base64).
bodyBase64: string base64 yang di-decode di host jadi body biner mentah, alternatif body untuk biner besar tanpa olah byte di JS.

Respons:

status (number), headers (object), res.text(), res.json(), res.bytes() (Uint8Array), res.base64() (string base64 dari byte respons, dikembalikan apa adanya dari host tanpa batas 8 KB, cocok untuk diteruskan ke createSticker() atau field base64 di multipart).

// GET JSON
const res = await bot.http.get("https://api.cuaca.com/now?kota=" + bot.msg.arg)
const data = res.json()
bot.reply("Suhu: " + data.temp + " C")

// POST JSON
await bot.http.post("https://api.tujuan.com/kirim", {
  headers: { "content-type": "application/json" },
  body: { pesan: "halo", ke: bot.msg.sender },
})

// Form biasa
await bot.http.post(url, { form: { user: "a", pass: "b" } })

Catatan biner: olah byte mentah di JS (Uint8Array untuk body/multipart dan res.bytes()) dibatasi 8 KB per nilai. Untuk mengirim biner besar ke API, lewatkan sebagai string base64 via field base64 (multipart) atau bodyBase64 (di-decode di host tanpa batas itu). Untuk sekadar menjadikan media jadi URL, pakai bot.msg.upload()/quotedUpload().

Kirim media (dari download()) ke API tanpa olah byte di JS, pakai base64:

const img = await bot.msg.quotedDownload()           // { ok, mime, base64 }
const r = await bot.http.post("https://catbox.moe/user/api.php", {
  multipart: [
    { name: "reqtype", value: "fileupload" },
    { name: "fileToUpload", filename: "image.jpg", contentType: img.mime, base64: img.base64 },
  ],
})
bot.reply(r.text())   // -> URL hasil upload
bot.store - penyimpanan KV per-script

Key → value terisolasi per script (counter, skor, state). Bukan database utama. set(key, value) (value non-string otomatis di-JSON.stringify), get(key) balik { value, exists } (bukan nilai langsung), del(key) hapus.

// counter sederhana
const cur = bot.store.get("hit")           // { value, exists }
const n = cur.exists ? parseInt(cur.value) : 0
bot.store.set("hit", String(n + 1))
bot.reply("Dipakai " + (n + 1) + " kali")

// simpan objek
bot.store.set("profil", { kota: "Jakarta", level: 3 })
const p = bot.store.get("profil")
const profil = p.exists ? JSON.parse(p.value) : {}

Batas: maks 100 key per script, 16 KB per nilai.

bot.secret - secret/environment script (read-only)

Nilai rahasia (API key, token) yang dipakai script. Di-set lewat dashboard, bukan dari dalam script, dan read-only di sandbox. bot.secret.get("KEY") balik string, atau null kalau key belum diatur.

const key = bot.secret.get("OPENAI_KEY")   // string, atau null kalau belum di-set
if (!key) return bot.reply("Secret OPENAI_KEY belum diatur di dashboard.")

const res = await bot.http.get("https://api.contoh.com/data", {
  headers: { Authorization: "Bearer " + key },
})
bot.reply(res.json().hasil)
Dua tingkat. bot.secret.get membaca secret level-script (di halaman edit script, bagian "Secret / Env") dan level-akun (halaman "Secret akun", dipakai semua scriptmu). Untuk key yang sama, secret per-script menimpa secret akun.
Per-script + per-pemilik. Tiap bot punya nilai sendiri untuk script yang sama, jadi secret satu orang tidak bocor ke bot lain (penting buat script publik di galeri).
Terenkripsi (AES-256-GCM) dan tidak pernah di-log. Nilai tidak bisa dibaca balik dari dashboard, untuk ganti harus ketik ulang.
Jangan tampilkan secret lewat bot.reply atau console.log, itu membocorkannya ke chat/log.

Batas: maks 50 key per script (dan 50 per akun), panjang key maksimal 64 byte, nilai maksimal 4 KB.

bot.session - sesi game (in-memory, lintas pesan)

State sementara per-chat untuk game (tic-tac-toe, tebak-tebakan, dll). Disimpan di memori (hilang saat bot restart), auto-expire (TTL), dan owner-scoped (hanya script yang memulai yang bisa baca/ubah).

Fungsi	Hasil
start(data, { ttl })	mulai/klaim sesi di chat ini untuk script ini. data = state (JSON), ttl detik (default 60, maks 600)
get()	{ active, data } - active=false = tak ada sesi milik script ini (data bernilai null); active=true = data berisi state tersimpan
set(data)	update state + refresh TTL
end()	akhiri sesi

Saat sesi aktif, script dijalankan untuk setiap pesan di chat itu. Panggil bot.handled() kalau pesan sudah ditangani (mis. gerakan valid) supaya command biasa tidak ikut jalan; jangan panggil kalau mau pesan diteruskan ke command lain. Sesi yang ditinggal hilang sendiri setelah TTL (tanpa pesan "waktu habis").

Sesi dikunci berdasarkan apa?

Satu sesi diidentifikasi oleh kombinasi: bot + chat + nama script.

Per-chat, bukan per-user. Sesi otomatis terikat ke chat tempat pesan datang (host yang mengikat). Di grup, satu sesi dipakai bersama semua anggota, siapa pun yang menjawab benar duluan dialah yang menang. Di chat pribadi otomatis per-user. Kalau mau game per-pemain dalam satu grup, simpan sendiri di dalam data (mis. { perUser: { "62812...": {...} } }) dan bedakan pakai bot.msg.sender.
Owner-scoped per script. Hanya script yang memulai sesi yang bisa get/set/end. Script lain di chat yang sama tidak bisa membaca/menimpa.
In-memory & per-worker. State hidup di memori worker dan hilang saat bot restart, bukan untuk data permanen (pakai bot.store untuk itu).
TTL. Default 60 detik, maks 600 detik; sesi yang tidak disentuh sampai TTL habis dianggap tidak ada lagi.

Pola umum:

satu script jalan di DUA situasi - saat dipicu command-nya (belum ada sesi) untuk memulai game, dan saat sesi aktif untuk menangani tiap pesan. Bedakan keduanya lewat bot.session.get().active.

// Script "tebakartis" - tebak nama artis, jawab langsung tanpa command
const s = bot.session.get()

if (!s.active) {
  // MULAI GAME (dipicu command, mis. -tebakartis)
  const idols = [
    { name: "Jungkook", group: "BTS" },
    { name: "Karina", group: "aespa" },
    { name: "IU", group: "Aktris" },
  ]
  const idol = idols[Math.floor(Math.random() * idols.length)]
  const huruf = idol.name.split(" ").join("")
  const petunjuk = huruf[0] + "•".repeat(Math.max(huruf.length - 2, 1)) + huruf[huruf.length - 1]

  // jawaban disimpan di SESI chat ini, auto-expire 120 detik
  bot.session.start(
    { jawaban: idol.name.toLowerCase(), nama: idol.name, group: idol.group, salah: 0 },
    { ttl: 120 }
  )
  bot.react("🎤")
  bot.reply("*TEBAK ARTIS*\n\nKategori: " + idol.group + "\nJumlah huruf: " + huruf.length + "\nPetunjuk: " + petunjuk + "\n\nKetik nama jawabanmu langsung.")
  bot.handled()
} else {
  // SESI AKTIF: setiap pesan di chat ini masuk ke sini
  const text = (bot.msg.text || "").trim()
  if (bot.msg.isCommand) return  // command lain biarkan jalan
  if (!text) return

  const st = s.data
  if (text.toLowerCase() === st.jawaban) {
    bot.session.end()
    bot.react("✅")
    bot.reply("Benar! Jawabannya " + st.nama + " (" + st.group + ").")
  } else {
    st.salah++
    bot.session.set(st)  // update + refresh TTL
    bot.reply("Salah, coba lagi! (percobaan ke-" + st.salah + ")")
  }
  bot.handled()
}
Tak perlu command "jawab" - selama sesi aktif, pemain cukup ketik nama; tiap pesan otomatis masuk ke script.
Per-chat, bukan global. Beberapa grup bisa main bersamaan tanpa jawaban saling tertimpa, beda dengan bot.store yang key-nya dipakai bareng seluruh chat.
if (bot.msg.isCommand) return membiarkan command lain (mis. -menu) tetap jalan saat game berlangsung, karena bot.handled() tidak dipanggil. Pakai bot.msg.isCommand, bukan cek prefix manual: bot tanpa prefix punya bot.msg.prefix === "" dan "...".startsWith("") selalu true, jadi gerakan tak pernah diproses.
Contoh: game per-pemain dalam satu grup

Karena sesi itu per-chat (dibagi seluruh anggota grup), state tiap pemain disimpan sendiri di dalam data, dipetakan per JID bot.msg.sender. Contoh tebak angka, tiap pemain punya angka rahasia & jumlah tebakan sendiri:

// Script "tebakangka" - tebak 1-50, tiap pemain punya angka sendiri
const s = bot.session.get()
const me = bot.msg.sender
const text = (bot.msg.text || "").trim()
const tag = "@" + me.split("@")[0]

if (!s.active) {
  // command -tebakangka membuka ronde di grup ini
  bot.session.start({ players: {} }, { ttl: 300 })
  bot.reply("*TEBAK ANGKA (1-50)*\n\nKetik *main* untuk dapat angka rahasiamu, lalu tebak dengan ketik angka.")
  bot.handled()
} else {
  if (bot.msg.isCommand) return  // command lain tetap jalan
  const st = s.data

  // join: tiap pemain dapat angka rahasianya sendiri
  if (text.toLowerCase() === "main") {
    if (!st.players[me]) {
      st.players[me] = { target: 1 + Math.floor(Math.random() * 50), tries: 0 }
      bot.session.set(st)
      bot.reply({ text: tag + " angka rahasiamu dibuat (1-50). Mulai tebak!", mentions: [me] })
    } else {
      bot.reply({ text: tag + " kamu sudah main, tebak angkanya.", mentions: [me] })
    }
    bot.handled()
    return
  }

  // hanya proses tebakan dari pemain yang sudah join
  const p = st.players[me]
  if (!p) return                        // bukan pemain & bukan command, biarkan
  const guess = parseInt(text, 10)
  if (!Number.isInteger(guess)) return  // bukan angka, abaikan

  p.tries++
  if (guess === p.target) {
    const target = p.target, tries = p.tries
    delete st.players[me]               // pemain ini selesai; yang lain tetap jalan
    bot.session.set(st)
    bot.reply({ text: "🎉 " + tag + " BENAR (" + target + ") dalam " + tries + " tebakan!", mentions: [me] })
  } else {
    bot.session.set(st)                 // refresh TTL ronde
    bot.reply({ text: tag + " " + (guess > p.target ? "terlalu besar" : "terlalu kecil") + " (percobaan " + p.tries + ")", mentions: [me] })
  }
  bot.handled()
}
data.players[bot.msg.sender] memisahkan state tiap pemain dalam satu sesi grup.
Pemain bergabung lewat keyword (main) di dalam cabang sesi-aktif, bukan lewat command lagi (command hanya memicu cabang !active untuk membuka ronde).
Pemain yang belum join & pesan non-angka, return tanpa bot.handled(), jadi chat biasa/command lain tetap normal.
Hapus entri pemain (delete st.players[me]) saat ia menang; sesi tetap hidup untuk pemain lain sampai TTL habis.

Maksimal data sesi 16 KB (JSON). bot.session cocok untuk state game yang sementara; untuk data permanen (mis. skor/leaderboard) pakai bot.store.

Event-script - jalan di setiap pesan

Satu script bisa punya dua handler: Kode (command, dipicu prefix - wajib, muncul di menu, kena gerbang limit/cooldown/level) dan Event handler (opsional). Kalau Event handler diisi, script juga dijalankan di setiap pesan di semua chat, sebelum command - cocok untuk anti-link/anti-spam, welcome, auto-reply kata kunci, dan event grup. Dibatasi 5 event handler aktif per bot.

Karena keduanya satu script (nama sama), bot.session & bot.store-nya nyambung: command bisa bot.session.start(...), lalu event handler membaca/melanjutkannya.

Session-routing vs Event handler, pilih yang mana?
Game turn-based (tebakartis, tic-tac-toe) - cukup command + bot.session (lihat bot.session). Host otomatis menjalankan ulang Kode hanya di chat yang sedang main, dan tidak memakai slot event handler.
Selalu-on (anti-link, welcome, auto-reply, event grup) - pakai event handler, karena harus bereaksi tanpa command pemicu. Jalan di tiap chat tiap pesan (lalu return cepat kalau tak relevan).
Untuk satu game pakai salah satu, jangan dua-duanya (akan jalan dua kali per pesan).

Di dalam event handler, bot.event memberi tahu jenis event:

bot.event = null saat dijalankan sebagai command (Kode).
bot.event = { type: "message" } saat dijalankan sebagai event pesan.

Jenis lain seperti group_participant/call menyusul; cek bot.event.type biar script-mu siap. Pakai bot.handled() di event handler untuk menghentikan pemrosesan (session-routing, command, event lain di-skip), mis. anti-link yang sudah menghapus pesan.

Event grup (join/leave/promote/demote)

Selain "message", event handler juga jalan saat ada perubahan anggota grup. Di sini bot.msg bernilai null (tidak ada pesan pemicu) - pakai bot.event dan bot.send:

bot.event = {
  type: "group_participant",
  action: "join" | "leave" | "promote" | "demote",   // enum - salah satu string ini
  participants: ["628xx@s.whatsapp.net", ...], // JID yang terdampak
  group: "12036...@g.us",
  actor: "628yy@s.whatsapp.net",                // pelaku aksi, "" kalau tak diketahui
  timestamp: 1750000000                         // unix detik kapan event terjadi
}

Karena bot.msg null di event ini, waktu event ada di bot.event.timestamp (bukan bot.msg.timestamp). Saat bot.msg null: bot.reply otomatis jadi kirim-ke-grup, dan bot.msg.delete()/bot.msg.deleteQuoted()/bot.msg.download() dan bot.react() melempar error. bot.send, bot.group.kick, bot.session, bot.store, bot.config tetap jalan. Event handler tidak dijalankan untuk aksi yang dilakukan bot sendiri.

// welcome member baru
if (bot.event.type !== "group_participant" || bot.event.action !== "join") return
const p = bot.event.participants
bot.send({ text: p.map(j => "@" + j.split("@")[0]).join(" ") + " selamat datang!", mentions: p })

Batasan: maks 5 script ber-event handler aktif per bot, timeout 30 detik per eksekusi event, dan event-run tidak menghabiskan limit/cooldown/XP (pasif), serta tidak jalan untuk pesan bot sendiri.

Contoh event handler tipe "message" - anti-link (selalu-on, tanpa command pemicu):

// Event handler anti-link: jalan tiap pesan grup; hapus link + tegur pengirim.
if (bot.event.type !== "message") return       // group_participant/dll diabaikan
if (!bot.msg.isGroup) return
if (!/(chat\.whatsapp\.com|https?:\/\/)/i.test(bot.msg.text || "")) return
try { bot.msg.delete() } catch (e) {}          // butuh bot admin
bot.reply({ text: "🚫 Dilarang kirim link.", mentions: [bot.msg.sender] })
bot.handled()                                  // stop: command lain tak ikut jalan

Game seperti tebakgambar/tebakartis TIDAK pakai event handler. Cukup command + bot.session, host menjalankan ulang Kode otomatis tiap pesan selama sesi aktif di chat itu. Lebih hemat (tak jalan di chat tanpa game) dan tak memakai slot event handler.

bot.user - data user (read-only) + update terbatas
Properti	Keterangan
level	level user
limit	sisa/penghitung limit
limitMax	batas limit (cap); sisa = limitMax - limit
xp	XP
role	role user (mis. "premium"/"standart")
isPremium	boolean - premium aktif (sudah memperhitungkan masa berlaku/expire)
balance	saldo (string)
banned	boolean
name	nama tampilan

role vs isPremium. role hanya kolom mentah; isPremium adalah hasil cek lengkap (role premium dan belum kedaluwarsa). Untuk gating premium di script, pakai bot.user.isPremium, bukan role === "premium".

bot.user.update({ ... })

Cuma field whitelist yang bisa diubah: level, limit, balance, xp. Field lain diabaikan. Nilai di-clamp otomatis ke rentang kolom database (balance maks ±9.999.999.999). Perubahan berlaku untuk pengirim command.

Untuk mengubah role (premium/standar) atau expire, gunakan bot.owner.addPremium/delPremium, bukan bot.user.update.

bot.user.update({ level: bot.user.level + 1 })   // naik level
bot.user.update({ limit: 0 })                    // reset limit
bot.user.update({ xp: bot.user.xp + 100 })
bot.user.update({ balance: 5000 })
Sistem limit (PENTING, terbalik)
bot.user.limit adalah penghitung PEMAKAIAN, bukan sisa kuota. Tiap command sukses menambah limit, dan bot menolak command saat limit >= limitMax.
Sisa kuota = bot.user.limitMax - bot.user.limit.
Memberi kuota ke user: kurangi limit (mis. limit - 5).
Reset kuota penuh: set limit: 0.
Premium / sewa / owner tidak terkena limit.
const sisa = bot.user.limitMax - bot.user.limit
bot.user.update({ limit: bot.user.limit - 5 })  // beri 5 pemakaian lagi
bot.user.update({ limit: 0 })                    // reset (kuota penuh)
bot.group - data grup (read-only)

null di chat pribadi. Pada message run cek bot.msg.isGroup dulu; pada event group_participant bot.msg bernilai null tapi bot.group tetap tersedia (grup dari bot.event.group), jadi jangan jadikan bot.msg.isGroup syarat di sana.

Properti	Keterangan
id	ID grup
sewa	boolean - kolom sewa mentah (TIDAK memperhitungkan expire)
isSewa	boolean - sewa aktif (sudah memperhitungkan masa berlaku/expire)

Untuk cek "grup ini masih sewa aktif?", pakai bot.group.isSewa (expiry-aware), bukan bot.group.sewa yang hanya kolom mentah.

// pada command/message run (untuk group_participant pakai bot.event.group)
if (bot.msg && bot.msg.isGroup) {
  bot.reply("ID grup ini: " + bot.group.id)
}
bot.group.metadata - metadata grup WhatsApp

Read-only (null kalau bukan grup):

Field	Keterangan
subject	nama grup
owner	JID pembuat grup
desc	deskripsi grup
creation	waktu dibuat (unix detik)
size	jumlah anggota
participants	array { id, admin, superadmin }
// pada command/message run (untuk group_participant pakai bot.event.group)
if (bot.msg && bot.msg.isGroup) {
  const m = bot.group.metadata
  bot.reply(m.subject + " punya " + m.size + " anggota")
}

bot.group.update({...}) tersedia tapi belum punya field yang bisa diubah (v1).

bot.html - parsing HTML (Go-side)

Parse HTML string dan jalankan CSS selector di sisi host (Go), hasilnya dikembalikan ke script sebagai objek JS. Tidak ada library JS tambahan di sandbox, parsing dilakukan oleh goquery di Go. Berguna untuk scraping setelah bot.http.get.

Fungsi	Hasil
bot.html.select(html, selector)	Array { text, html, attrs } - semua elemen yang cocok (maks 200). text = teks ter-trim, html = innerHTML (maks 32 KB), attrs = { key: val }.
bot.html.attr(html, selector, attr)	String - nilai atribut attr pada elemen pertama yang cocok, atau "".
bot.html.text(html, selector)	String - teks semua elemen yang cocok, digabung dengan "\n".

Batas: input HTML maks 1 MB, maks 200 elemen per query, innerHTML per elemen dipotong di 32 KB.

// Scraping halaman berita
const res = await bot.http.get("https://contoh.com/berita")
const html = res.text()

// ambil semua judul
const judul = bot.html.text(html, "h2.article-title")
bot.reply(judul)

// ambil URL gambar pertama
const imgUrl = bot.html.attr(html, "img.hero", "src")
if (imgUrl) await bot.reply({ url: imgUrl, caption: "Foto utama" })
// Ambil list artikel lengkap dengan link
const res = await bot.http.get("https://contoh.com/artikel")
const items = bot.html.select(res.text(), "article.card")

if (items.length === 0) { bot.reply("Tidak ada artikel."); return }

const out = items.slice(0, 5).map(function(el) {
  const link = el.attrs.href || bot.html.attr(el.html, "a", "href") || "-"
  return "- " + el.text + "\n  " + link
}).join("\n\n")

bot.reply(out)
// Ambil meta og:title dan og:image dari halaman
const res = await bot.http.get("https://contoh.com/produk/123")
const html = res.text()

const title = bot.html.attr(html, "meta[property='og:title']", "content")
const image = bot.html.attr(html, "meta[property='og:image']", "content")

if (image) {
  await bot.reply({ url: image, caption: title || "Produk" })
} else {
  bot.reply(title || "Tidak ditemukan")
}
bot.owner - manajemen premium & sewa (owner-only)

Tersedia di semua script, namun setiap method melempar error jika pengirim bukan owner device. Bungkus dengan try/catch untuk penanganan yang graceful.

Fungsi	Keterangan
addPremium(jid, durationMs)	Tambah/perpanjang premium user. jid = JID lengkap (mis. "628xx@s.whatsapp.net"). durationMs = durasi dalam milidetik; 0 = permanent.
delPremium(jid)	Hapus status premium user. Error kalau JID tidak terdaftar premium.
addSewa(groupId, durationMs)	Tambah/perpanjang sewa grup. groupId = ID grup (mis. "120363xx@g.us"). durationMs = 0 = permanent.
delSewa(groupId)	Hapus status sewa grup. Error kalau ID grup tidak terdaftar sewa.
isPremium(jid)	Boolean - cek apakah user mana pun (bukan cuma pengirim) sedang premium aktif (expiry-aware).
isSewa(groupId)	Boolean - cek apakah grup mana pun sedang sewa aktif (expiry-aware).

Cek konteks saat ini vs arbitrary. Untuk pengirim/grup tempat script jalan, cukup pakai bot.user.isPremium/bot.group.isSewa (tersedia untuk semua script, tanpa gate owner). bot.owner.isPremium(jid)/bot.owner.isSewa(groupId) dipakai saat ingin mengecek user/grup lain berdasarkan JID/ID, dan ini owner-only seperti method bot.owner lainnya.

Durasi ditumpuk. Jika user/grup sudah punya sisa waktu, durationMs ditambahkan di atas sisa tersebut, bukan menggantikan. Untuk mengatur ulang dari sekarang, hapus dulu (delPremium/delSewa) lalu tambah kembali.

// Tambah premium 30 hari ke pengirim
if (!bot.msg.isOwner) { bot.reply("Hanya owner."); return }
bot.owner.addPremium(bot.msg.sender, 30 * 24 * 60 * 60 * 1000)
bot.reply("Premium 30 hari berhasil ditambahkan.")
// Bot payment sederhana: owner kirim nomor + hari, lalu bot addpremium
// Contoh: #bayar 62812xxxxx 7
if (!bot.msg.isOwner) { bot.reply(bot.mess.OnlyOwner); return }
const jid = bot.msg.args[0] + "@s.whatsapp.net"
const hari = parseInt(bot.msg.args[1]) || 30
try {
  bot.owner.addPremium(jid, hari * 24 * 60 * 60 * 1000)
  bot.reply("Premium " + hari + " hari berhasil untuk " + bot.msg.args[0])
} catch (e) {
  bot.reply("Gagal: " + e.message)
}
// Cek status: pengirim sendiri (tanpa owner) + user/grup lain (owner-only)
// Konteks saat ini - tersedia untuk semua script:
bot.reply("Premium kamu: " + (bot.user.isPremium ? "aktif" : "tidak"))
if (bot.msg.isGroup) {
  bot.reply("Sewa grup ini: " + (bot.group.isSewa ? "aktif" : "tidak"))
}

// User lain berdasarkan nomor - owner-only:
if (bot.msg.isOwner && bot.msg.args[0]) {
  const jid = bot.msg.args[0] + "@s.whatsapp.net"
  bot.reply(jid + " premium: " + (bot.owner.isPremium(jid) ? "ya" : "tidak"))
}
bot.config - config bot (read-only)

Snapshot setting bot saat ini (read-only). Field yang tersedia:

prefix, prefixMode, name, packname, authorname, footerText, game, autoread, antidelete, anticall, onlyGroup, onlyIndo, onlyPrem, levelling, self, buttonMode, limit, balancePerLimit, joinToUse.

if (bot.config.antidelete) { /* ... */ }
bot.reply("Prefix: " + bot.config.prefix)
bot.mess - template pesan bot (read-only)

Template pesan bot yang di-custom owner lewat dashboard, supaya balasan script ikut gaya bahasa bot yang sama. Objek read-only; key mengikuti nama field Mess (key yang tak di-set = undefined). Beberapa key umum: wait, error, invLink, OnlyGrup, OnlyPM, GrupAdmin, BotAdmin, OnlyOwner, OnlyPrem, OnlySewa, limit, cooldown, timeout, level.

bot.reply(bot.mess.wait)   // pakai template "tunggu" milik bot

const res = await bot.http.get("https://api.cuaca.com/now?kota=" + bot.msg.arg)
if (res.status !== 200) {
  bot.reply(bot.mess.error)   // pesan error standar bot
  return
}
console - logging (debug)

console.log/warn/error(...) masuk ke log sistem (Grafana/Loki), di-tag per bot & nama script, bukan ke chat user. Argumen objek otomatis di-JSON.stringify, dan error script yang tak tertangkap juga tercatat otomatis. Untuk menampilkan sesuatu ke user tetap pakai bot.reply.

console.log("debug:", { arg: bot.msg.arg, sender: bot.msg.sender })
Batasan & aturan
Kode maks 100 KB
Eksekusi maks 100 detik
Memori ~200 MB
Timeout HTTP 30 detik
Respons HTTP maks 25 MB
Download media maks 8 MB
Biner di JS maks 8 KB/nilai
Store 100 key / 16 KB

Tidak tersedia (demi keamanan): require/import, akses file (fs), process, database/sistem internal bot, dan koneksi ke alamat internal/privat. Script benar-benar terisolasi, satu-satunya cara berinteraksi adalah lewat bot.* di atas.

Kalau script error (exception) atau lewat waktu, eksekusi dihentikan dan user lihat pesan error umum. Pakai try/catch untuk menangani sendiri:

try {
  const res = await bot.http.get("https://api.contoh.com/data")
  bot.reply(res.json().hasil)
} catch (e) {
  bot.reply("Gagal ambil data: " + e.message)
}
Contoh lengkap
// Script "cek" - ambil data API, simpan hit count, balas user.
if (!bot.msg.arg) {
  bot.reply("Format: " + bot.msg.prefix + bot.msg.command + " <kota>")
  return
}

try {
  const res = await bot.http.get("https://api.cuaca.com/now?kota=" + encodeURIComponent(bot.msg.arg))
  if (res.status !== 200) {
    bot.reply("Kota tidak ditemukan.")
    return
  }
  const data = res.json()

  const c = bot.store.get("hits")
  const hits = (c.exists ? parseInt(c.value) : 0) + 1
  bot.store.set("hits", String(hits))

  bot.reply("Cuaca " + bot.msg.arg + ": " + data.temp + " C (dipakai " + hits + "x)")
} catch (e) {
  console.error("cek error:", e.message)
  bot.reply("Terjadi kesalahan, coba lagi nanti.")
}
Migrasi dari plugin gaya lama

Kalau punya script gaya plugin lama (require, conn, m, module.exports, handler.command), itu tidak berlaku di sini. Sandbox terisolasi, jadi semua diganti API bot.*. Padanannya:

Plugin lama	Custom script (bot.*)
require('axios') + axios.get()	await bot.http.get(url) lalu res.json()
text	bot.msg.arg
usedPrefix, command	bot.msg.prefix, bot.msg.command
m.reply(x)	bot.reply(x)
conn.sendFile(m.chat, url, name, caption, m)	bot.reply({ url, caption })
conn.sendMessage(from, { image: { url }, caption }, { quoted })	bot.reply({ url, caption })
react: "🐶" (auto-react di properti command)	bot.react("🐶") di dalam kode
throw "pesan" (validasi)	bot.reply("pesan"); return
m.chat, m.sender	bot.msg (mis. bot.msg.sender)
handler.command, handler.help, handler.tags	diatur di dashboard (kolom name, aliases, helper, category), bukan di kode
Contoh konversi: script "reseps"

Di dashboard set: name = reseps, aliases = ["resep"], category = search. Perhatikan pakai bot.mess.wait & bot.mess.error biar ikut gaya bahasa bot.

// Cari resep masakan dari API publik.
if (!bot.msg.arg) {
  bot.reply("Masukkan nama masakan! Contoh: " + bot.msg.prefix + bot.msg.command + " ayam goreng")
  return
}

bot.reply(bot.mess.wait)   // template "tunggu" milik bot

function text(v) {
  return v == null ? "-" : String(v)
}

try {
  const url = "https://api.siputzx.my.id/api/s/resep?query=" + encodeURIComponent(bot.msg.arg)
  const res = await bot.http.get(url)
  if (res.status !== 200) {
    bot.reply(bot.mess.error)
    return
  }
  const body = res.json()
  const list = Array.isArray(body.data) ? body.data : []
  if (list.length === 0) {
    bot.reply("Tidak ada resep untuk: " + bot.msg.arg)
    return
  }
  const r = list[0]
  const caption =
    "*Resep: " + text(r.judul) + "*\n\n" +
    "Bahan:\n" + text(r.bahan) + "\n\n" +
    "Cara membuat:\n" + text(r.langkah_langkah)
  if (r.thumb) {
    await bot.reply({ url: r.thumb, caption: caption })
  } else {
    bot.reply(caption)
  }
} catch (e) {
  console.error("reseps error:", e)
  bot.reply(bot.mess.error)
}
Contoh konversi: script "dog"

Versi lama pakai cmd({...}) + axios + conn.sendMessage; di sini cukup bot.http + bot.reply({ url, caption }). Di dashboard set: name = dog, category = fun.

// Kirim gambar anjing random dari API publik (dog.ceo).
bot.react("🐶")

try {
  const res = await bot.http.get("https://dog.ceo/api/breeds/image/random")
  if (res.status !== 200) {
    bot.reply("Gagal mengambil gambar (status " + res.status + ").")
    return
  }

  const data = res.json()   // { message: "<url gambar>", status: "success" }
  if (!data.message) {
    bot.reply("Gambar tidak ditemukan, coba lagi.")
    return
  }

  await bot.reply({ url: data.message, caption: "🐶 Random dog" })
} catch (e) {
  console.error("dog error:", e.message)
  bot.reply("Gagal mengambil gambar anjing: " + e.message)
}
Riwayat versi

Versi API custom script memakai semver sendiri (independen dari versi rilis bot, tapi tiap entri mencatat di rilis bot mana fitur itu tersedia).

v1.0.0 - bot v4.9.0 (26 Juni 2026)

Baseline: mulai versi ini riwayat API dicatat. Penambahan pada rilis ini:

bot.owner.addPremium/delPremium/addSewa/delSewa - kelola premium user & sewa grup (owner-only).
bot.owner.isPremium/isSewa - cek status premium/sewa user atau grup mana pun (owner-only).
bot.user.isPremium/bot.group.isSewa - status premium/sewa untuk konteks saat ini (sudah memperhitungkan masa berlaku).
bot.html.select/attr/text - parsing HTML hasil bot.http dengan CSS selector (diproses di sisi server).

Fitur dasar yang sudah ada sebelum pencatatan ini dimulai (tidak diberi nomor versi historis): bot.msg/reply/send/react, moderasi (delete/kick), media (download/upload/createSticker/convertSticker), bot.http/fetch, bot.store, bot.session, bot.secret, bot.user/group/config/mess, bot.handled, serta event-script & event grup.