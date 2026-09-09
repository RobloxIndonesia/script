/* ========================================
   ELEMENT
======================================== */
const container = document.querySelector(".shorts");
const short = document.querySelector(".short");
const video = document.getElementById("video");
const title = document.getElementById("title");
const description = document.getElementById("description");
const button = document.getElementById("centerControl");
const loader = document.getElementById("loader");
const quality = document.getElementById("quality");
const qualityStatus = document.getElementById("qualityStatus");
const orderControl = document.getElementById("orderControl");

/* ========================================
   DATA
======================================== */
let shortsData = {};

/* ========================================
   BASE URL
======================================== */
const VIDEO_BASE = "https://robloxindonesia.github.io/video/";

/* ========================================
   KUALITAS
======================================== */
const qualityList = [2160, 1440, 1080, 720, 540, 480, 360, 240, 144];

/* ========================================
   STATE
======================================== */
let currentId = null;
let currentQuality = null;
let availableQualities = [];
let changingVideo = false;
let autoMode = true;
let randomMode = true;

/* ========================================
   ID CACHE
======================================== */
let videoIds = [];

/* ========================================
   QUALITY CACHE
======================================== */
/*
 * Contoh:
 * qualityCache[8] = [1080, 720, 480, 360, 240, 144]
 * Jadi video 8 tidak perlu dicek ulang.
 */
const qualityCache = Object.create(null);

/* ========================================
   HISTORY
======================================== */
let videoHistory = [];
let historyIndex = -1;

/* ========================================
   LOAD TOKEN
======================================== */
/*
 * Mencegah request video lama mengganggu video baru.
 */
let loadToken = 0;

/* ========================================
   AUTO QUALITY
======================================== */
let speedTesting = false;
let lastSpeedTest = 0;
const SPEED_TEST_INTERVAL = 30000;

/* ========================================
   LOAD JSON
======================================== */
async function loadData() {
    try {
        const response = await fetch("/script/shorts/shorts.json", { cache: "default" });
        if (!response.ok) throw new Error("shorts.json HTTP " + response.status);

        shortsData = await response.json();

        // Simpan ID sekali.
        videoIds = Object.keys(shortsData).map(Number).sort((a, b) => a - b);

        console.log("Data Shorts berhasil dimuat:", shortsData);
        return true;
    } catch (error) {
        console.error("Gagal memuat shorts.json:", error);
        title.textContent = "Gagal memuat data";
        description.textContent = "shorts.json tidak ditemukan.";
        return false;
    }
}

/* ========================================
   VIDEO URL
======================================== */
function getVideoUrl(id, qualityValue) {
    const data = shortsData[id];
    if (!data) return null;

    // encodeURIComponent membuat nama file dengan spasi, tanda kurung, dll tetap aman.
    const file = encodeURIComponent(data.file);
    return VIDEO_BASE + qualityValue + "p/" + file;
}

/* ========================================
   GET ID URL
======================================== */
function getId() {
    const params = new URLSearchParams(window.location.search);
    const requested = Number(params.get("id"));

    if (requested && shortsData[requested]) return requested;
    return videoIds[0] || null;
}

/* ========================================
   FIRST / LAST
======================================== */
function getFirstId() {
    return videoIds.length ? videoIds[0] : null;
}

function getLastId() {
    return videoIds.length ? videoIds[videoIds.length - 1] : null;
}

/* ========================================
   CHECK QUALITIES
======================================== */
async function checkQualities(id) {
    // Kalau sudah ada di cache, tidak perlu dihitung ulang.
    if (qualityCache[id]) return qualityCache[id];

    const data = shortsData[id];
    if (!data || !Array.isArray(data.qualities)) return [];

    // Kualitas berasal langsung dari shorts.json.
    const qualities = data.qualities
        .map(Number)
        .filter(q => qualityList.includes(q))
        .sort((a, b) => b - a);

    // Simpan ke cache.
    qualityCache[id] = qualities;
    return qualities;
}

/* ========================================
   UPDATE QUALITY OPTIONS
======================================== */
function updateQualityOptions() {
    for (const option of quality.options) {
        if (option.value === "auto") continue;

        const q = Number(option.value);

        if (availableQualities.includes(q)) {
            option.disabled = false;
            option.textContent = q + "p";
        } else {
            option.disabled = true;
            option.textContent = q + "p (tidak tersedia)";
        }
    }
}

/* ========================================
   CLOSEST QUALITY
======================================== */
function getClosestQuality(target) {
    if (!availableQualities.length) return null;
    if (!target) return availableQualities[0];

    let closest = availableQualities[0];

    for (const q of availableQualities) {
        if (Math.abs(q - target) < Math.abs(closest - target)) closest = q;
    }

    return closest;
}

/* ========================================
   LOAD SHORT
======================================== */
async function loadShort(id, autoplay = true) {
    const data = shortsData[id];
    if (!data) return;

    // Token baru.
    const token = ++loadToken;

    loader.classList.add("show");
    title.textContent = data.title;
    description.textContent = data.description;

    // Ambil kualitas. Kalau sudah cache, sangat cepat.
    const qualities = await checkQualities(id);

    // Request lama.
    if (token !== loadToken) return;

    availableQualities = qualities;
    updateQualityOptions();

    if (!availableQualities.length) {
        loader.classList.remove("show");
        title.textContent = "Video tidak tersedia";
        description.textContent = "Tidak ada kualitas video yang ditemukan.";
        return;
    }

    let selectedQuality;

    /* AUTO */
    if (autoMode) {
        selectedQuality = availableQualities[0];
    }
    /* MANUAL */
    else {
        selectedQuality = getClosestQuality(currentQuality);
    }

    currentId = id;
    currentQuality = selectedQuality;

    // UPDATE SELECT
    quality.value = autoMode ? "auto" : String(selectedQuality);
    qualityStatus.textContent = selectedQuality + "p";

    // VIDEO URL
    const src = getVideoUrl(id, selectedQuality);

    video.pause();
    video.onloadedmetadata = null;
    video.onerror = null;
    video.src = src;
    video.load();

    video.onloadedmetadata = () => {
        if (token !== loadToken) return;

        loader.classList.remove("show");
        if (autoplay) video.play().catch(() => {});
    };

    video.onerror = () => {
        if (token !== loadToken) return;

        loader.classList.remove("show");
        fallbackQuality(selectedQuality);
    };
}

/* ========================================
   CHANGE QUALITY
======================================== */
function changeQuality(newQuality) {
    if (!availableQualities.includes(newQuality)) return;
    if (currentQuality === newQuality) return;

    const currentTime = video.currentTime || 0;
    const wasPlaying = !video.paused;

    currentQuality = newQuality;
    qualityStatus.textContent = newQuality + "p";
    loader.classList.add("show");

    const token = ++loadToken;

    video.pause();
    video.onloadedmetadata = null;
    video.onerror = null;
    video.src = getVideoUrl(currentId, newQuality);
    video.load();

    video.onloadedmetadata = () => {
        if (token !== loadToken) return;

        try {
            if (Number.isFinite(video.duration)) {
                video.currentTime = Math.min(currentTime, video.duration);
            }
        } catch {}

        loader.classList.remove("show");
        if (wasPlaying) video.play().catch(() => {});
    };

    video.onerror = () => {
        if (token !== loadToken) return;

        loader.classList.remove("show");
        fallbackQuality(newQuality);
    };
}

/* ========================================
   FALLBACK
======================================== */
function fallbackQuality(failedQuality) {
    // Cari kualitas yang lebih rendah.
    const lower = availableQualities
        .filter(q => q < failedQuality)
        .sort((a, b) => b - a);

    if (lower.length) {
        changeQuality(lower[0]);
        return;
    }

    // Jika tidak ada, cari kualitas lain.
    const alternative = availableQualities.find(q => q !== failedQuality);

    if (alternative) {
        changeQuality(alternative);
    } else {
        qualityStatus.textContent = "Gagal memutar";
    }
}

/* ========================================
   SPEED TEST
======================================== */
async function measureDownloadSpeed(url) {
    if (speedTesting) return 0;
    speedTesting = true;

    try {
        const start = performance.now();
        const response = await fetch(url, { cache: "force-cache" });

        if (!response.ok || !response.body) return 0;

        const reader = response.body.getReader();
        let received = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            received += value.length;

            // 256 KB saja.
            if (received >= 256 * 1024) {
                reader.cancel();
                break;
            }
        }

        const seconds = (performance.now() - start) / 1000;
        if (seconds <= 0 || received <= 0) return 0;

        return (received * 8) / seconds / 1000000;
    } catch {
        return 0;
    } finally {
        speedTesting = false;
    }
}

/* ========================================
   SELECT AUTO QUALITY
======================================== */
function selectQuality(speed) {
    const preferred = [
        [2160, 16],
        [1440, 10],
        [1080, 8],
        [720, 5],
        [540, 3],
        [480, 2],
        [360, 1.5],
        [240, 0.8],
        [144, 0]
    ];

    for (const [q, required] of preferred) {
        if (speed >= required && availableQualities.includes(q)) return q;
    }

    return availableQualities[availableQualities.length - 1];
}

/* ========================================
   AUTO QUALITY
======================================== */
async function autoQuality(force = false) {
    if (!autoMode || !currentId || !availableQualities.length) return;

    const now = Date.now();

    // Jangan speed test terlalu sering.
    if (!force && now - lastSpeedTest < SPEED_TEST_INTERVAL) return;

    const idAtStart = currentId;
    const token = loadToken;
    lastSpeedTest = now;

    qualityStatus.textContent = "Mengukur...";

    const testQuality = availableQualities[0];
    const speed = await measureDownloadSpeed(getVideoUrl(currentId, testQuality));

    // User sudah pindah.
    if (idAtStart !== currentId || token !== loadToken) return;

    if (speed <= 0) {
        qualityStatus.textContent = currentQuality + "p";
        return;
    }

    const selected = selectQuality(speed);
    qualityStatus.textContent = speed.toFixed(2) + " Mbps • " + selected + "p";

    if (currentQuality !== selected) changeQuality(selected);
}

/* ========================================
   QUALITY SELECT
======================================== */
quality.addEventListener("change", () => {
    if (quality.value === "auto") {
        autoMode = true;
        autoQuality(true);
        return;
    }

    autoMode = false;
    changeQuality(Number(quality.value));
});

/* ========================================
   ACAK / URUTAN
======================================== */
if (orderControl) {
    orderControl.textContent = randomMode ? "Acak" : "Urutan";

    orderControl.addEventListener("click", () => {
        randomMode = !randomMode;
        orderControl.textContent = randomMode ? "Acak" : "Urutan";
    });
}

/* ========================================
   RANDOM VIDEO
======================================== */
function getRandomNewVideo(current) {
    let candidates = videoIds.filter(id => id !== current);

    // Hindari history.
    const unused = candidates.filter(id => !videoHistory.includes(id));
    if (unused.length) candidates = unused;

    // Kalau semua sudah pernah dipakai, mulai siklus baru.
    if (!candidates.length) candidates = videoIds.filter(id => id !== current);
    if (!candidates.length) return current;

    return candidates[Math.floor(Math.random() * candidates.length)];
}

/* ========================================
   NEXT VIDEO
======================================== */
function getNextVideoId(current) {
    /* MODE URUTAN */
    if (!randomMode) {
        const index = videoIds.indexOf(current);
        if (index === -1 || index >= videoIds.length - 1) return current;
        return videoIds[index + 1];
    }

    /* HISTORY FORWARD */
    if (historyIndex < videoHistory.length - 1) {
        historyIndex++;
        return videoHistory[historyIndex];
    }

    /* RANDOM BARU */
    const nextId = getRandomNewVideo(current);

    if (nextId !== current) {
        videoHistory = videoHistory.slice(0, historyIndex + 1);
        videoHistory.push(nextId);
        historyIndex = videoHistory.length - 1;
    }

    return nextId;
}

/* ========================================
   PREVIOUS VIDEO
======================================== */
function getPreviousVideoId(current) {
    /* MODE URUTAN */
    if (!randomMode) {
        const index = videoIds.indexOf(current);
        if (index <= 0) return current;
        return videoIds[index - 1];
    }

    /* MODE ACAK */
    if (historyIndex > 0) {
        historyIndex--;
        return videoHistory[historyIndex];
    }

    return current;
}

/* ========================================
   CHANGE SHORT
======================================== */
async function changeShort(id, direction) {
    if (changingVideo) return;
    if (!shortsData[id]) return;
    if (id === currentId) return;

    // BATAS URUTAN
    if (!randomMode && direction === "next" && currentId >= getLastId()) return;
    if (!randomMode && direction === "previous" && currentId <= getFirstId()) return;

    changingVideo = true;
    video.pause();

    // Animasi.
    short.classList.remove("next", "previous");
    void short.offsetWidth;
    short.classList.add(direction === "next" ? "next" : "previous");

    // URL langsung.
    history.pushState({ id: id }, "", "?id=" + id);

    // Load video.
    await loadShort(id, true);

    // Auto quality tidak dipaksa. Hanya berjalan jika interval sudah lewat.
    if (autoMode) autoQuality(false);

    // Selesaikan animasi.
    setTimeout(() => {
        short.classList.remove("next", "previous");
        changingVideo = false;
    }, 300);
}

/* ========================================
   SWIPE
======================================== */
let startY = 0;
let startX = 0;

container.addEventListener("touchstart", event => {
    const touch = event.touches[0];
    startY = touch.clientY;
    startX = touch.clientX;
}, { passive: true });

container.addEventListener("touchend", event => {
    if (changingVideo) return;

    const touch = event.changedTouches[0];
    const distanceY = startY - touch.clientY;
    const distanceX = startX - touch.clientX;

    // Swipe horizontal.
    if (Math.abs(distanceX) > Math.abs(distanceY)) return;

    // Swipe terlalu pendek.
    if (Math.abs(distanceY) < 70) return;

    const current = currentId;

    /* SWIPE ATAS */
    if (distanceY > 0) {
        const nextId = getNextVideoId(current);
        if (nextId !== current) changeShort(nextId, "next");
        return;
    }

    /* SWIPE BAWAH */
    const previousId = getPreviousVideoId(current);
    if (previousId !== current) changeShort(previousId, "previous");
}, { passive: true });

/* ========================================
   PLAY / PAUSE
======================================== */
let hideTimer;

video.addEventListener("click", () => {
    if (video.paused) {
        video.play().catch(() => {});
    } else {
        video.pause();
    }

    button.classList.add("show");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
        button.classList.remove("show");
    }, 700);
});

video.addEventListener("play", () => {
    button.textContent = "❚❚";
});

video.addEventListener("pause", () => {
    button.textContent = "▶";
});

/* ========================================
   BACK / FORWARD
======================================== */
window.addEventListener("popstate", async () => {
    const id = getId();
    if (!shortsData[id]) return;

    await loadShort(id, true);
    if (autoMode) autoQuality(false);
});

/* ========================================
   START
======================================== */
(async function init() {
    const loaded = await loadData();
    if (!loaded) return;
    if (!videoIds.length) return;

    const params = new URLSearchParams(window.location.search);
    const requestedId = Number(params.get("id"));

    let id;

    // ?id=8 wajib video 8.
    if (requestedId && shortsData[requestedId]) {
        id = requestedId;
    } else {
        // Tidak ada ID.
        if (randomMode) {
            id = videoIds[Math.floor(Math.random() * videoIds.length)];
        } else {
            id = videoIds[0];
        }
    }

    // HISTORY AWAL
    videoHistory = [id];
    historyIndex = 0;

    // URL
    history.replaceState({ id: id }, "", "?id=" + id);
    currentId = id;

    // LOAD VIDEO
    await loadShort(id, true);

    // AUTO QUALITY
    if (autoMode) autoQuality(true);
})();

/* ========================================
   AUTO QUALITY 30 DETIK
======================================== */
setInterval(() => {
    if (autoMode && !changingVideo && currentId) {
        autoQuality(false);
    }
}, 30000);
