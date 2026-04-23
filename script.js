/**
 * 1. INISIALISASI STATE & DATA
 */
let currentGallery = [];
let currentIndex = 0;

const projects = [{
        id: 0,
        title: "E-Commerce App",
        tags: ["React", "Node"],
        desc: "Fullstack online store dengan payment gateway.",
        comments: [],
        images: ["https://picsum.photos/800/500?random=1", "https://picsum.photos/800/500?random=11", "https://picsum.photos/800/500?random=111"]
    },
    {
        id: 1,
        title: "Personal Portfolio",
        tags: ["HTML", "CSS", "JS"],
        desc: "Portfolio interaktif dengan dark mode.",
        comments: [],
        images: ["https://picsum.photos/800/500?random=2", "https://picsum.photos/800/500?random=22"]
    },
    {
        id: 2,
        title: "Task Manager",
        tags: ["Vue", "Firebase"],
        desc: "Aplikasi produktivitas tim realtime.",
        comments: [],
        images: ["https://picsum.photos/800/500?random=3"]
    },
    {
        id: 3,
        title: "Weather App",
        tags: ["API", "React"],
        desc: "Cek cuaca kota di seluruh dunia.",
        comments: [],
        images: ["https://picsum.photos/800/500?random=4"]
    },
    {
        id: 4,
        title: "Chat Realtime",
        tags: ["Socket.io", "Express"],
        desc: "Chatting aplikasi tanpa delay.",
        comments: [],
        images: ["https://picsum.photos/800/500?random=5"]
    },
    {
        id: 5,
        title: "Travel Blog",
        tags: ["PHP", "MySQL"],
        desc: "Sistem CMS sederhana untuk blog travel.",
        comments: [],
        images: ["https://picsum.photos/800/500?random=6"]
    }
];

/**
 * 2. CORE FUNCTIONS (RENDER)
 */
const projectGrid = document.getElementById('projectGrid');

function renderProjects(filter = "") {
    const savedComments = JSON.parse(localStorage.getItem('portfolio_comments')) || {};

    const filtered = projects.filter(p =>
        p.title.toLowerCase().includes(filter.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
    );

    projectGrid.innerHTML = filtered.map(p => {
        const displayComments = savedComments[p.id] || p.comments;
        return `
        <div class="project-card reveal">
            <div class="project-img-container" onclick="openGallery(${p.id})">
                <img src="${p.images[0]}" class="project-img-preview">
                <div class="img-overlay"><i class="fas fa-search-plus"></i> Lihat Gallery</div>
            </div>
            <h3 style="margin-bottom:10px;">${p.title}</h3>
            <div style="margin-bottom:10px;">
                ${p.tags.map(t => `<span class="tag-span">${t}</span>`).join('')}
            </div>
            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:15px;">${p.desc}</p>
            <div class="comment-section">
                <div id="list-${p.id}">
                    ${displayComments.map((c, index) => `
                        <div class="comment-item">
                            <span>${c}</span>
                        </div>
                    `).join('')}
                </div>
                <input type="text" placeholder="Komen & Enter..." onkeypress="addComment(event, ${p.id})" class="comment-input">
            </div>
        </div>
    `}).join('');

    // Trigger animasi muncul saat scroll
    setTimeout(() => window.dispatchEvent(new Event('scroll')), 100);
}

/**
 * 3. GALLERY LOGIC
 */
function openGallery(id) {
    const project = projects.find(p => p.id === id);
    if (!project || !project.images.length) return;
    currentGallery = project.images;
    currentIndex = 0;
    updateModalImg();
    document.getElementById('galleryModal').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Stop scroll saat modal buka
}

function closeGallery() {
    document.getElementById('galleryModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function changeImg(n) {
    currentIndex = (currentIndex + n + currentGallery.length) % currentGallery.length;
    updateModalImg();
}

function updateModalImg() {
    const modalImg = document.getElementById('modalImg');
    modalImg.src = currentGallery[currentIndex];
}

/**
 * 4. ADMIN & SECURITY
 */

/**
 * 5. COMMENT LOGIC
 */
function addComment(e, id) {
    if (e.key === 'Enter' && e.target.value.trim() !== "") {
        const text = e.target.value;
        let savedComments = JSON.parse(localStorage.getItem('portfolio_comments')) || {};
        if (!savedComments[id]) savedComments[id] = [];
        savedComments[id].push(text);
        localStorage.setItem('portfolio_comments', JSON.stringify(savedComments));
        renderProjects();
        e.target.value = "";
    }
}

/**
 * 6. FILTER LOGIC
 */
function filterProjects(tag, element) {
    // 1. Update UI Tombol Aktif
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    // 2. Logika Filtering
    if (tag === 'All') {
        renderProjects(""); // Tampilkan semua
    } else {
        renderProjects(tag);
    }
}

/**
 * 7. UTILITY & EVENT LISTENERS
 */

// Theme Toggle
const themeBtn = document.getElementById('theme-toggle');
themeBtn?.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
});

// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('toggle');
});

// Reveal on Scroll
window.addEventListener('scroll', () => {
    document.querySelectorAll('.reveal').forEach(reveal => {
        if (reveal.getBoundingClientRect().top < window.innerHeight - 50) {
            reveal.classList.add('active');
        }
    });
});

// Search Input
document.getElementById('projectSearch')?.addEventListener('input', (e) => renderProjects(e.target.value));

/**
 * 8. MOBILE GESTURES (SWIPE)
 */
let touchstartX = 0;
let touchendX = 0;
const modalArea = document.getElementById('galleryModal');

modalArea.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
});

modalArea.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleGesture();
});

function handleGesture() {
    if (touchstartX - touchendX > 50) {
        changeImg(1); // Swipe kiri -> Selanjutnya
    }
    if (touchendX - touchstartX > 50) {
        changeImg(-1); // Swipe kanan -> Sebelumnya
    }
}

// Fungsi untuk membuka Pop-up Skill
function openSkillPopup(title, techs) {
    const modal = document.getElementById('skillModal');
    const titleElement = document.getElementById('popupTitle');
    const container = document.getElementById('techContainer');

    titleElement.innerText = title;

    const techArray = techs.split(',');
    container.innerHTML = techArray.map(tech =>
        `<span class="tag-span" style="padding: 10px 20px; font-size: 0.9rem;">${tech.trim()}</span>`
    ).join('');

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeSkillModal() {
    document.getElementById('skillModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Menutup modal jika user klik di luar kotak putih
window.onclick = function(event) {
    const skillModal = document.getElementById('skillModal');
    const galleryModal = document.getElementById('galleryModal');
    if (event.target == skillModal) closeSkillModal();
    if (event.target == galleryModal) closeGallery();
}

/**
 * ANTI-TAMPER CREDIT PROTECTION
 */
function protectCredit() {
    const footer = document.querySelector('footer');
    const creditText = "Created with ❤️ by Sanemiya"; // Teks yang dilindungi

    // 1. Fungsi untuk mengecek apakah kredit masih ada
    const checkCredit = () => {
        if (!footer || !footer.innerText.includes("Sanemiya")) {
            // Jika kredit dihapus, munculkan pesan peringatan dan kembalikan elemen
            alert("Peringatan: Menghapus kredit melanggar ketentuan penggunaan!");
            location.reload(); // Refresh halaman otomatis jika dihapus
        }
    };

    // 2. Gunakan MutationObserver untuk memantau perubahan DOM
    const observer = new MutationObserver(() => {
        checkCredit();
    });

    if (footer) {
        observer.observe(footer, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // Interval tambahan sebagai cadangan
    setInterval(checkCredit, 3000);
}

// Jalankan fungsi proteksi
protectCredit();

// Jalankan render awal
renderProjects();

/**
 * FORMSPREE AJAX HANDLER
 */
const contactForm = document.getElementById("my-form");
const statusMsg = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    submitBtn.disabled = true;

    fetch(event.target.action, {
        method: contactForm.method,
        body: data,
        headers: { 'Accept': 'application/json' }
    }).then(response => {
        if (response.ok) {
            // Notifikasi Sukses Melayang
            Swal.fire({
                icon: 'success',
                title: 'Pesan Terkirim!',
                text: 'Terima kasih, saya akan segera menghubungi Anda.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000
            });
            contactForm.reset();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: 'Ada masalah saat mengirim pesan.',
                toast: true,
                position: 'top-end'
            });
        }
    }).catch(error => {
        Swal.fire({ icon: 'error', title: 'Kesalahan Jaringan!' });
    }).finally(() => {
        submitBtn.disabled = false;
    });
}

contactForm.addEventListener("submit", handleSubmit);