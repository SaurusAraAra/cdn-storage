/**
 * RIZKI TOOLS - CORE ENGINE (PURE VANILLA JS ES6+)
 * Developed for Bos Rizki
 */

'use strict';

// ==========================================
// 1. CONFIG & TOOL REGISTRY (22 TOOLS)
// ==========================================
const API_BASE_URL = 'https://api.cmnty.biz.id';
const API_KEY = 'cmnty-bbb66c2431878f83c738fecad51e7c3f';

const TOOLS = [
    {
        id: 'brat',
        name: 'Brat',
        desc: 'Generator teks gaya aesthetic hijau Brat khas Charli XCX.',
        category: 'brat',
        type: 'image',
        badge: 'Popular',
        endpoint: (params) => `${API_BASE_URL}/maker/brat?text=${encodeParam(params.text)}&apikey=${API_KEY}`,
        inputs: [{ id: 'text', label: 'Teks', type: 'text', placeholder: 'Masukkan teks...' }]
    },
    {
        id: 'bratvid',
        name: 'Bratvid',
        desc: 'Generator animasi video tulisan Brat berkedip.',
        category: 'brat',
        type: 'video',
        badge: 'Video',
        endpoint: (params) => `${API_BASE_URL}/maker/bratvid?text=${encodeParam(params.text)}&apikey=${API_KEY}`,
        inputs: [{ id: 'text', label: 'Teks Video', type: 'text', placeholder: 'Masukkan teks...' }]
    },
    {
        id: 'bratprabowo',
        name: 'Brat Prabowo',
        desc: 'Meme generator Brat dengan latar Prabowo.',
        category: 'brat',
        type: 'image',
        badge: 'Meme',
        endpoint: (params) => `${API_BASE_URL}/maker/bratwowo?text=${encodeParam(params.text)}&apikey=${API_KEY}`,
        inputs: [{ id: 'text', label: 'Teks', type: 'text', placeholder: 'Tulis sesuatu...' }]
    },
    {
        id: 'bratbahlil',
        name: 'Brat Bahlil',
        desc: 'Generator gambar Brat edisi Bahlil.',
        category: 'brat',
        type: 'image',
        badge: 'Meme',
        endpoint: (params) => `${API_BASE_URL}/maker/bratbahlil?text=${encodeParam(params.text)}&apikey=${API_KEY}`,
        inputs: [{ id: 'text', label: 'Teks', type: 'text', placeholder: 'Tulis pesan...' }]
    },
    {
        id: 'bratmegawati',
        name: 'Brat Megawati',
        desc: 'Generator meme Brat edisi Megawati.',
        category: 'brat',
        type: 'image',
        badge: 'Meme',
        endpoint: (params) => `${API_BASE_URL}/maker/bratmegawati?text=${encodeParam(params.text)}&apikey=${API_KEY}`,
        inputs: [{ id: 'text', label: 'Teks', type: 'text', placeholder: 'Tulis kata-kata...' }]
    },
    {
        id: 'bratsinchan',
        name: 'Brat Sinchan',
        desc: 'Meme Brat dengan karakter Sinchan.',
        category: 'brat',
        type: 'image',
        badge: 'Anime',
        endpoint: (params) => `${API_BASE_URL}/maker/bratsinchan?text=${encodeParam(params.text)}&apikey=${API_KEY}`,
        inputs: [{ id: 'text', label: 'Teks', type: 'text', placeholder: 'Teks Sinchan...' }]
    },
    {
        id: 'brathellokitty',
        name: 'Brat Hello Kitty',
        desc: 'Desain aesthetic Brat Hello Kitty.',
        category: 'brat',
        type: 'image',
        badge: 'Cute',
        endpoint: (params) => `${API_BASE_URL}/maker/brathellokitty?text=${encodeParam(params.text)}&apikey=${API_KEY}`,
        inputs: [{ id: 'text', label: 'Teks', type: 'text', placeholder: 'Teks Hello Kitty...' }]
    },
    {
        id: 'bratdoraemon',
        name: 'Brat Doraemon',
        desc: 'Generator Brat bertema Doraemon.',
        category: 'brat',
        type: 'image',
        badge: 'Anime',
        endpoint: (params) => `${API_BASE_URL}/maker/bratdoraemon?text=${encodeParam(params.text)}&apikey=${API_KEY}`,
        inputs: [{ id: 'text', label: 'Teks', type: 'text', placeholder: 'Teks Doraemon...' }]
    },
    {
        id: 'bratbearnad',
        name: 'Brat Bearnad',
        desc: 'Meme Brat bertema Bernard Bear.',
        category: 'brat',
        type: 'image',
        badge: 'Meme',
        endpoint: (params) => `${API_BASE_URL}/maker/bratbearnad?text=${encodeParam(params.text)}&apikey=${API_KEY}`,
        inputs: [{ id: 'text', label: 'Teks', type: 'text', placeholder: 'Teks Bernard...' }]
    },
    {
        id: 'notifwa',
        name: 'Fake Notifikasi WA',
        desc: 'Buat tiruan notifikasi pesan WhatsApp.',
        category: 'social',
        type: 'image',
        badge: 'Prank',
        endpoint: (params) => `${API_BASE_URL}/canvas/notifwa?name=${encodeParam(params.nama)}&message=${encodeParam(params.pesan)}&apikey=${API_KEY}`,
        inputs: [
            { id: 'nama', label: 'Nama Pengirim', type: 'text', placeholder: 'Contoh: Ayang' },
            { id: 'pesan', label: 'Isi Pesan', type: 'textarea', placeholder: 'Isi notifikasi...' }
        ]
    },
    {
        id: 'notifwav2',
        name: 'Fake Notifikasi WA V2',
        desc: 'Notifikasi WA lengkap dengan Foto Profil.',
        category: 'social',
        type: 'image',
        badge: 'Prank V2',
        endpoint: (params) => `${API_BASE_URL}/canvas/notifwav2?avatar=${encodeParam(params.avatar)}&name=${encodeParam(params.nama)}&message=${encodeParam(params.pesan)}&apikey=${API_KEY}`,
        inputs: [
            { id: 'avatar', label: 'URL Avatar / Foto', type: 'url', placeholder: 'https://example.com/foto.jpg' },
            { id: 'nama', label: 'Nama Pengirim', type: 'text', placeholder: 'Nama...' },
            { id: 'pesan', label: 'Isi Pesan', type: 'textarea', placeholder: 'Pesan...' }
        ]
    },
    {
        id: 'tiktokcomment',
        name: 'Fake Komentar TikTok',
        desc: 'Tiruan tampilan komentar aplikasi TikTok.',
        category: 'social',
        type: 'image',
        badge: 'TikTok',
        endpoint: (params) => `${API_BASE_URL}/canvas/tiktok-comment?avatar=${encodeParam(params.avatar)}&comment=${encodeParam(params.comment)}&apikey=${API_KEY}`,
        inputs: [
            { id: 'avatar', label: 'URL Foto Profil', type: 'url', placeholder: 'https://...' },
            { id: 'comment', label: 'Komentar', type: 'textarea', placeholder: 'Tulis komentar...' }
        ]
    },
    {
        id: 'tiktokquote',
        name: 'Kutipan TikTok',
        desc: 'Buat quote keren bertema frame TikTok.',
        category: 'social',
        type: 'image',
        badge: 'Quotes',
        endpoint: (params) => `${API_BASE_URL}/canvas/tiktok-quotes?avatar=${encodeParam(params.avatar)}&quote=${encodeParam(params.quote)}&apikey=${API_KEY}`,
        inputs: [
            { id: 'avatar', label: 'URL Foto Profil', type: 'url', placeholder: 'https://...' },
            { id: 'quote', label: 'Isi Kutipan', type: 'textarea', placeholder: 'Tulis quote...' }
        ]
    },
    {
        id: 'wmp',
        name: 'WMP Meme Generator',
        desc: 'Meme generator klasik Watermark Plus.',
        category: 'meme',
        type: 'image',
        badge: 'Meme',
        endpoint: (params) => `https://apii.nexadev.my.id/wmp1?text=${encodeParam(params.text)}`,
        inputs: [{ id: 'text', label: 'Teks Meme', type: 'text', placeholder: 'Teks...' }]
    },
    {
        id: 'ustadz',
        name: 'Pak Ustadz Meme',
        desc: 'Buat meme nasihat bergambar Pak Ustadz.',
        category: 'meme',
        type: 'image',
        badge: 'Lucu',
        endpoint: (params) => `${API_BASE_URL}/canvas/ustadz?text=${encodeParam(params.text)}&apikey=${API_KEY}`,
        inputs: [{ id: 'text', label: 'Nasihat Ustadz', type: 'textarea', placeholder: 'Tulis nasihat...' }]
    },
    {
        id: 'naruto',
        name: 'Teks Naruto',
        desc: 'Ubah teks dengan font gaya anime Naruto.',
        category: 'meme',
        type: 'image',
        badge: 'Font',
        endpoint: (params) => `${API_BASE_URL}/maker/naruto?text=${encodeParam(params.text)}&apikey=${API_KEY}`,
        inputs: [{ id: 'text', label: 'Teks', type: 'text', placeholder: 'Nama/Teks...' }]
    },
    {
        id: 'twowordlogo',
        name: 'Teks Style Black & Orange',
        desc: 'Generator logo bergaya dua kata hitam & oranye.',
        category: 'meme',
        type: 'image',
        badge: 'Logo Style',
        endpoint: (params) => `${API_BASE_URL}/canvas/pornhub?text1=${encodeParam(params.text1)}&text2=${encodeParam(params.text2)}&apikey=${API_KEY}`,
        inputs: [
            { id: 'text1', label: 'Kata Pertama (Hitam)', type: 'text', placeholder: 'Rizki' },
            { id: 'text2', label: 'Kata Kedua (Oranye)', type: 'text', placeholder: 'Tools' }
        ]
    },
    {
        id: 'removebg',
        name: 'Hapus Background',
        desc: 'Hapus latar belakang gambar secara otomatis.',
        category: 'tools',
        type: 'image',
        badge: 'AI Tool',
        endpoint: (params) => `${API_BASE_URL}/tools/removebg?url=${encodeParam(params.url)}&apikey=${API_KEY}`,
        inputs: [{ id: 'url', label: 'URL Gambar Target', type: 'url', placeholder: 'https://...' }]
    },
    {
        id: 'blurface',
        name: 'Wajah Buram',
        desc: 'Sensorkan/samarkan wajah pada foto.',
        category: 'tools',
        type: 'image',
        badge: 'Privacy',
        endpoint: (params) => `${API_BASE_URL}/tools/blurface?url=${encodeParam(params.url)}&apikey=${API_KEY}`,
        inputs: [{ id: 'url', label: 'URL Foto', type: 'url', placeholder: 'https://...' }]
    },
    {
        id: 'lobiml',
        name: 'Lobi ML',
        desc: 'Simulasi tampilan lobi profil Mobile Legends.',
        category: 'social',
        type: 'image',
        badge: 'Game',
        endpoint: (params) => `${API_BASE_URL}/maker/fake-ml?usr=${encodeParam(params.nama)}&rank=${params.rank}&border=random&lobby_type=indo&avatar=${encodeParam(params.avatar)}&apikey=${API_KEY}`,
        inputs: [
            { id: 'nama', label: 'Nickname ML', type: 'text', placeholder: 'Contoh: RizkiGamer' },
            { id: 'avatar', label: 'URL Avatar', type: 'url', placeholder: 'https://...' },
            {
                id: 'rank', label: 'Tingkat Rank', type: 'select',
                options: [
                    { val: 'warrior', txt: 'Warrior' }, { val: 'elite', txt: 'Elite' },
                    { val: 'master', txt: 'Master' }, { val: 'gmaster', txt: 'Grandmaster' },
                    { val: 'epic', txt: 'Epic' }, { val: 'legend', txt: 'Legend' },
                    { val: 'mythic', txt: 'Mythic' }, { val: 'honor', txt: 'Mythic Honor' },
                    { val: 'glory', txt: 'Mythic Glory' }, { val: 'imo', txt: 'Immortal' }
                ]
            }
        ]
    },
    {
        id: 'lobiff',
        name: 'Lobi FF',
        desc: 'Simulasi tampilan lobi game Free Fire.',
        category: 'social',
        type: 'image',
        badge: 'Game',
        endpoint: (params) => `${API_BASE_URL}/maker/fake-ff?usr=${encodeParam(params.nama)}&apikey=${API_KEY}`,
        inputs: [{ id: 'nama', label: 'Nickname FF', type: 'text', placeholder: 'Nickname...' }]
    },
    {
        id: 'buatktp',
        name: 'Buat KTP (Canvas)',
        desc: 'Generator template kartu identitas KTP.',
        category: 'tools',
        type: 'image',
        badge: 'Canvas',
        endpoint: (params) => `${API_BASE_URL}/canvas/ektp?provinsi=${encodeParam(params.provinsi)}&kota=${encodeParam(params.kota)}&nik=${encodeParam(params.nik)}&nama=${encodeParam(params.nama)}&ttl=${encodeParam(params.ttl)}&jenis_kelamin=${encodeParam(params.jk)}&golongan_darah=${encodeParam(params.goldar)}&alamat=${encodeParam(params.alamat)}&rt%2Frw=${encodeParam(params.rtrw)}&kel%2Fdesa=${encodeParam(params.kelurahan)}&kecamatan=${encodeParam(params.kecamatan)}&agama=${encodeParam(params.agama)}&status=${encodeParam(params.status)}&pekerjaan=${encodeParam(params.pekerjaan)}&kewarganegaraan=WNI&masa_berlaku=Seumur+Hidup&terbuat=${encodeParam(params.tanggal)}&pas_photo=${encodeParam(params.foto)}&apikey=${API_KEY}`,
        inputs: [
            { id: 'provinsi', label: 'Provinsi', type: 'text', placeholder: 'JAWA BARAT' },
            { id: 'kota', label: 'Kota/Kabupaten', type: 'text', placeholder: 'CIREBON' },
            { id: 'nik', label: 'NIK', type: 'text', placeholder: '3209...' },
            { id: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'RIZKI' },
            { id: 'ttl', label: 'Tempat/Tgl Lahir', type: 'text', placeholder: 'CIREBON, 01-01-2000' },
            { id: 'jk', label: 'Jenis Kelamin', type: 'text', placeholder: 'LAKI-LAKI' },
            { id: 'goldar', label: 'Golongan Darah', type: 'text', placeholder: 'O' },
            { id: 'alamat', label: 'Alamat', type: 'text', placeholder: 'JL. MERDEKA' },
            { id: 'rtrw', label: 'RT/RW', type: 'text', placeholder: '001/002' },
            { id: 'kelurahan', label: 'Kel/Desa', type: 'text', placeholder: 'KEBONMANIS' },
            { id: 'kecamatan', label: 'Kecamatan', type: 'text', placeholder: 'HARJAMUKTI' },
            { id: 'agama', label: 'Agama', type: 'text', placeholder: 'ISLAM' },
            { id: 'status', label: 'Status perkawinan', type: 'text', placeholder: 'BELUM KAWIN' },
            { id: 'pekerjaan', label: 'Pekerjaan', type: 'text', placeholder: 'ENGINEER' },
            { id: 'tanggal', label: 'Tanggal Buat', type: 'text', placeholder: '01-01-2024' },
            { id: 'foto', label: 'URL Pas Foto', type: 'url', placeholder: 'https://...' }
        ]
    }
];

// Helper: Encoding spasi menjadi '+' sesuai aturan spesifikasi
function encodeParam(str) {
    if (!str) return '';
    return encodeURIComponent(str).replace(/%20/g, '+');
}

// ==========================================
// 2. APP STATE MANAGEMENT
// ==========================================
const state = {
    activeTool: null,
    favorites: JSON.parse(localStorage.getItem('rizki_favs')) || [],
    history: JSON.parse(localStorage.getItem('rizki_history')) || [],
    currentFilter: 'all',
    searchQuery: '',
    currentResultUrl: null
};

// ==========================================
// 3. DOM ELEMENTS REFERENCE
// ==========================================
const DOM = {
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    menuToggleBtn: document.getElementById('menuToggleBtn'),
    closeSidebarBtn: document.getElementById('closeSidebarBtn'),
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    menuGrid: document.getElementById('menuGrid'),
    menuView: document.getElementById('menuView'),
    generatorView: document.getElementById('generatorView'),
    heroSection: document.getElementById('heroSection'),
    backToMenuBtn: document.getElementById('backToMenuBtn'),
    searchInputHeader: document.getElementById('searchInputHeader'),
    emptySearchState: document.getElementById('emptySearchState'),
    generatorForm: document.getElementById('generatorForm'),
    dynamicInputs: document.getElementById('dynamicInputs'),
    activeToolTitle: document.getElementById('activeToolTitle'),
    activeToolDesc: document.getElementById('activeToolDesc'),
    activeToolIcon: document.getElementById('activeToolIcon'),
    previewStage: document.getElementById('previewStage'),
    stagePlaceholder: document.getElementById('stagePlaceholder'),
    skeletonLoading: document.getElementById('skeletonLoading'),
    progressBar: document.getElementById('progressBar'),
    loadingText: document.getElementById('loadingText'),
    errorContainer: document.getElementById('errorContainer'),
    errorMessage: document.getElementById('errorMessage'),
    resultContainer: document.getElementById('resultContainer'),
    resultImage: document.getElementById('resultImage'),
    resultVideo: document.getElementById('resultVideo'),
    resultToolbar: document.getElementById('resultToolbar'),
    previewStatus: document.getElementById('previewStatus'),
    downloadBtn: document.getElementById('downloadBtn'),
    copyUrlBtn: document.getElementById('copyUrlBtn'),
    shareBtn: document.getElementById('shareBtn'),
    resetBtn: document.getElementById('resetBtn'),
    retryBtn: document.getElementById('retryBtn'),
    historyGrid: document.getElementById('historyGrid'),
    emptyHistoryMsg: document.getElementById('emptyHistoryMsg'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    clickSound: document.getElementById('clickSound'),
    toastContainer: document.getElementById('toastContainer')
};

// ==========================================
// 4. AUDIO & SOUND EFFECTS
// ==========================================
function playClickSound() {
    if (DOM.clickSound) {
        DOM.clickSound.currentTime = 0;
        DOM.clickSound.play().catch(() => {}); // Ignore interaction restriction
    }
}

// ==========================================
// 5. INITIALIZATION & EVEN LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderMenuCards();
    renderHistory();
    setupEventListeners();
    setupRippleEffect();
});

function setupEventListeners() {
    // Theme & Sidebar
    DOM.themeToggleBtn.addEventListener('click', toggleTheme);
    DOM.menuToggleBtn.addEventListener('click', toggleSidebar);
    DOM.closeSidebarBtn.addEventListener('click', toggleSidebar);
    DOM.sidebarOverlay.addEventListener('click', toggleSidebar);

    // Search & Filter
    DOM.searchInputHeader.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase();
        renderMenuCards();
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            playClickSound();
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.currentFilter = e.target.dataset.filter;
            renderMenuCards();
        });
    });

    // Navigation Back
    DOM.backToMenuBtn.addEventListener('click', () => {
        playClickSound();
        showMenuView();
    });

    // Form Submit
    DOM.generatorForm.addEventListener('submit', handleFormSubmit);
    DOM.resetBtn.addEventListener('click', resetForm);
    DOM.retryBtn.addEventListener('click', handleFormSubmit);

    // Toolbar Actions
    DOM.downloadBtn.addEventListener('click', handleDownload);
    DOM.copyUrlBtn.addEventListener('click', handleCopyUrl);
    DOM.shareBtn.addEventListener('click', handleShare);
    DOM.clearHistoryBtn.addEventListener('click', clearHistory);

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== DOM.searchInputHeader) {
            e.preventDefault();
            DOM.searchInputHeader.focus();
        }
        if (e.key === 'Escape' && !DOM.generatorView.classList.contains('hidden')) {
            showMenuView();
        }
    });

    // Network status monitoring
    window.addEventListener('offline', () => showToast('Koneksi internet terputus!', 'error'));
    window.addEventListener('online', () => showToast('Koneksi terhubung kembali.', 'success'));
}

// ==========================================
// 6. THEME TOGGLE
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem('rizki_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    playClickSound();
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('rizki_theme', target);
    showToast(`Tema diubah ke ${target} mode`);
}

function toggleSidebar() {
    playClickSound();
    DOM.sidebar.classList.toggle('active');
    DOM.sidebarOverlay.classList.toggle('active');
}

// ==========================================
// 7. MENU CARD RENDERER
// ==========================================
function renderMenuCards() {
    DOM.menuGrid.innerHTML = '';
    
    const filtered = TOOLS.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(state.searchQuery) || tool.desc.toLowerCase().includes(state.searchQuery);
        let matchesCategory = true;
        if (state.currentFilter === 'favorite') {
            matchesCategory = state.favorites.includes(tool.id);
        } else if (state.currentFilter !== 'all') {
            matchesCategory = tool.category === state.currentFilter;
        }
        return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
        DOM.emptySearchState.classList.remove('hidden');
    } else {
        DOM.emptySearchState.classList.add('hidden');
        filtered.forEach(tool => {
            const isFav = state.favorites.includes(tool.id);
            const card = document.createElement('div');
            card.className = 'menu-card ripple';
            card.innerHTML = `
                <div class="card-top">
                    <div class="card-icon">
                        ${getToolSVG(tool.type)}
                    </div>
                    <button class="btn-fav ${isFav ? 'active' : ''}" data-id="${tool.id}" title="Favorit">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </button>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${tool.name}</h3>
                    <p class="card-desc">${tool.desc}</p>
                </div>
                <span class="card-badge">${tool.badge}</span>
            `;

            // Card click listener
            card.addEventListener('click', (e) => {
                if (e.target.closest('.btn-fav')) {
                    e.stopPropagation();
                    toggleFavorite(tool.id);
                    return;
                }
                playClickSound();
                openToolWorkspace(tool);
            });

            DOM.menuGrid.appendChild(card);
        });
    }
}

function toggleFavorite(id) {
    playClickSound();
    if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(favId => favId !== id);
        showToast('Dihapus dari favorit');
    } else {
        state.favorites.push(id);
        showToast('Ditambahkan ke favorit');
    }
    localStorage.setItem('rizki_favs', JSON.stringify(state.favorites));
    renderMenuCards();
}

// ==========================================
// 8. WORKSPACE & DYNAMIC FORM GENERATOR
// ==========================================
function openToolWorkspace(tool) {
    state.activeTool = tool;
    DOM.activeToolTitle.textContent = tool.name;
    DOM.activeToolDesc.textContent = tool.desc;
    DOM.activeToolIcon.innerHTML = getToolSVG(tool.type);

    // Build Form Inputs
    DOM.dynamicInputs.innerHTML = '';
    tool.inputs.forEach(input => {
        const group = document.createElement('div');
        group.className = 'form-group';
        
        let fieldHTML = '';
        if (input.type === 'textarea') {
            fieldHTML = `<textarea id="${input.id}" class="form-textarea" rows="3" placeholder="${input.placeholder}" required></textarea>`;
        } else if (input.type === 'select') {
            const options = input.options.map(o => `<option value="${o.val}">${o.txt}</option>`).join('');
            fieldHTML = `<select id="${input.id}" class="form-select">${options}</select>`;
        } else {
            fieldHTML = `<input type="${input.type}" id="${input.id}" class="form-input" placeholder="${input.placeholder}" required />`;
        }

        group.innerHTML = `<label for="${input.id}">${input.label}</label>${fieldHTML}`;
        DOM.dynamicInputs.appendChild(group);
    });

    // Reset Preview State
    resetPreviewState();

    // Toggle Views
    DOM.heroSection.classList.add('hidden');
    DOM.menuView.classList.add('hidden');
    DOM.generatorView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showMenuView() {
    DOM.generatorView.classList.add('hidden');
    DOM.heroSection.classList.remove('hidden');
    DOM.menuView.classList.remove('hidden');
    state.activeTool = null;
}

function resetPreviewState() {
    DOM.stagePlaceholder.classList.remove('hidden');
    DOM.skeletonLoading.classList.add('hidden');
    DOM.errorContainer.classList.add('hidden');
    DOM.resultContainer.classList.add('hidden');
    DOM.resultToolbar.classList.add('hidden');
    DOM.resultImage.classList.add('hidden');
    DOM.resultVideo.classList.add('hidden');
    DOM.previewStatus.textContent = 'Ready';
    DOM.previewStatus.style.borderColor = 'rgba(16, 185, 129, 0.2)';
    DOM.previewStatus.style.color = '#10b981';
}

function resetForm() {
    playClickSound();
    DOM.generatorForm.reset();
    resetPreviewState();
    showToast('Form berhasil di-reset');
}

// ==========================================
// 9. API REQUEST & MEDIA FETCH ENGINE
// ==========================================
async function handleFormSubmit(e) {
    if (e) e.preventDefault();
    if (!state.activeTool) return;

    // Collect Input Data
    const inputValues = {};
    let isValid = true;

    state.activeTool.inputs.forEach(input => {
        const el = document.getElementById(input.id);
        if (el) {
            inputValues[input.id] = el.value.trim();
            if (!el.value.trim() && el.hasAttribute('required')) {
                isValid = false;
            }
        }
    });

    if (!isValid) {
        showToast('Mohon isi semua field input!', 'error');
        return;
    }

    const apiUrl = state.activeTool.endpoint(inputValues);

    // Set UI to Loading
    DOM.stagePlaceholder.classList.add('hidden');
    DOM.errorContainer.classList.add('hidden');
    DOM.resultContainer.classList.add('hidden');
    DOM.resultToolbar.classList.add('hidden');
    DOM.skeletonLoading.classList.remove('hidden');
    DOM.previewStatus.textContent = 'Generating...';
    DOM.previewStatus.style.color = '#eab308';

    // Simulated Progress Bar
    let progress = 10;
    DOM.progressBar.style.width = '10%';
    const progressInterval = setInterval(() => {
        if (progress < 90) {
            progress += Math.floor(Math.random() * 15);
            DOM.progressBar.style.width = `${progress}%`;
        }
    }, 300);

    try {
        // Fetch API with timeout & retry
        const blob = await fetchWithRetry(apiUrl, { timeout: 20000, retries: 2 });
        const mediaBlobUrl = URL.createObjectURL(blob);
        state.currentResultUrl = mediaBlobUrl;

        clearInterval(progressInterval);
        DOM.progressBar.style.width = '100%';

        setTimeout(() => {
            DOM.skeletonLoading.classList.add('hidden');
            DOM.resultContainer.classList.remove('hidden');
            DOM.resultToolbar.classList.remove('hidden');

            if (state.activeTool.type === 'video') {
                DOM.resultVideo.src = mediaBlobUrl;
                DOM.resultVideo.classList.remove('hidden');
                DOM.resultImage.classList.add('hidden');
            } else {
                DOM.resultImage.src = mediaBlobUrl;
                DOM.resultImage.classList.remove('hidden');
                DOM.resultVideo.classList.add('hidden');
            }

            DOM.previewStatus.textContent = 'Success';
            DOM.previewStatus.style.color = '#10b981';

            // Add to History
            saveToHistory(state.activeTool.name, mediaBlobUrl, state.activeTool.type);
            showToast('Berhasil membuat media!', 'success');
        }, 300);

    } catch (err) {
        clearInterval(progressInterval);
        DOM.skeletonLoading.classList.add('hidden');
        DOM.errorContainer.classList.remove('hidden');
        DOM.errorMessage.textContent = err.message || 'Terjadi kesalahan saat menghubungi server API.';
        DOM.previewStatus.textContent = 'Failed';
        DOM.previewStatus.style.color = '#ef4444';
        showToast('Gagal memproses request API.', 'error');
    }
}

// Fetch helper with AbortController Timeout and Retry mechanism
async function fetchWithRetry(url, options = {}) {
    const { timeout = 15000, retries = 2 } = options;

    for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const blob = await response.blob();
            
            if (blob.size === 0) throw new Error('Response API kosong');
            return blob;

        } catch (error) {
            clearTimeout(timeoutId);
            if (attempt === retries) {
                if (error.name === 'AbortError') {
                    throw new Error('API Timeout: Server tidak merespon dalam waktu 20 detik.');
                }
                throw error;
            }
            // Wait 1 sec before retrying
            await new Promise(res => setTimeout(res, 1000));
        }
    }
}

// ==========================================
// 10. TOOLBAR ACTIONS (DOWNLOAD, COPY, SHARE)
// ==========================================
function handleDownload() {
    playClickSound();
    if (!state.currentResultUrl) return;

    const ext = state.activeTool.type === 'video' ? 'mp4' : 'png';
    const filename = `RizkiTools_${state.activeTool.id}_${Date.now()}.${ext}`;

    const a = document.createElement('a');
    a.href = state.currentResultUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Memulai download file...');
}

function handleCopyUrl() {
    playClickSound();
    if (!state.currentResultUrl) return;

    navigator.clipboard.writeText(state.currentResultUrl)
        .then(() => showToast('Link blob hasil berhasil disalin!'))
        .catch(() => showToast('Gagal menyalin link.', 'error'));
}

function handleShare() {
    playClickSound();
    if (navigator.share && state.currentResultUrl) {
        navigator.share({
            title: 'Rizki Tools Result',
            text: `Lihat hasil dari generator ${state.activeTool.name} di Rizki Tools!`,
            url: window.location.href
        }).catch(() => {});
    } else {
        handleCopyUrl();
    }
}

// ==========================================
// 11. HISTORY MANAGEMENT
// ==========================================
function saveToHistory(title, url, type) {
    const item = { id: Date.now(), title, url, type, time: new Date().toLocaleTimeString() };
    state.history.unshift(item);
    if (state.history.length > 12) state.history.pop();
    localStorage.setItem('rizki_history', JSON.stringify(state.history));
    renderHistory();
}

function renderHistory() {
    DOM.historyGrid.innerHTML = '';
    if (state.history.length === 0) {
        DOM.emptyHistoryMsg.classList.remove('hidden');
        return;
    }

    DOM.emptyHistoryMsg.classList.add('hidden');
    state.history.forEach(item => {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.innerHTML = `
            ${item.type === 'video' 
                ? `<video src="${item.url}"></video>` 
                : `<img src="${item.url}" alt="${item.title}" />`}
            <span class="history-card-tag">${item.title}</span>
        `;
        card.addEventListener('click', () => {
            playClickSound();
            window.open(item.url, '_blank');
        });
        DOM.historyGrid.appendChild(card);
    });
}

function clearHistory() {
    playClickSound();
    state.history = [];
    localStorage.removeItem('rizki_history');
    renderHistory();
    showToast('Riwayat berhasil dibersihkan');
}

// ==========================================
// 12. UI HELPERS (SVG, RIPPLE, TOAST)
// ==========================================
function getToolSVG(type) {
    if (type === 'video') {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`;
    }
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        <span>${message}</span>
    `;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function setupRippleEffect() {
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.ripple');
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const circle = document.createElement('span');
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('ripple-effect');

        const ripple = target.getElementsByClassName('ripple-effect')[0];
        if (ripple) ripple.remove();

        target.appendChild(circle);
    });
}