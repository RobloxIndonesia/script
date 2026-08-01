// Data teks
const textData = [
    { id: "text1", teks: "©2026 By RobloxIndonesia_old" },
    { id: "text2", teks: "Versi Website 2.1v" }
];

textData.forEach(item => {
    document.getElementById(item.id).textContent = item.teks;
});

// Data link
const linkData = [
    { id: "link1", href: "/home", text: "Home" },
    { id: "link2", href: "/games-tren", text: "Game Tren" },
    { id: "link3", href: "/berita", text: "Berita" },
    { id: "link4", href: "/sejarah", text: "Sejarah" },

    { id: "link5", href: "#", text: "Tentang Kami" },
    { id: "link6", href: "#", text: "Bantuan" },
    { id: "link7", href: "#", text: "Privasi" },
    { id: "link8", href: "#", text: "Situs Peta" },

    { id: "link9", href: "/robloxshorts", text: "Roblox Shorts" },
    { id: "link10", href: "#", text: "Keadaan Koneksi Server Roblox" },
    { id: "link11", href: "#", text: "Kode² Di Game Roblox" },
    { id: "link12", href: "#", text: "Tutorial Di Roblox" },
    { id: "link13", href: "#", text: "Karakter Terkenal Di Roblox" },
    { id: "link14", href: "/foto-roblox", text: "Foto Roblox" },
    { id: "link15", href: "/users", text: "Username" },
    { id: "link16", href: "mailto:robloxindonesia.github.io@gmail.com?subject=Halo%20RobloxIndonesia_old&body=ada%20butuh%20bantuan/minta%20simpan%20halaman%20akun%20Roblox.", text: "Hubungi Kami" }
];
linkData.forEach(item => {
    const link = document.createElement("a");
    link.textContent = item.text;
    link.href = item.href;

    document.getElementById(item.id).appendChild(link);
});


// buka tap tiga
function openMenu(){
    document.getElementById("menuDropdown").style.width = "250px";
}

function closeMenu(){
    document.getElementById("menuDropdown").style.width = "0";
}


//profil robloxindonesia
// Link + Avatar
const link = document.createElement("a");
link.href = "/users/profil.html?user=robiox_lndo";

const profiles = document.createElement("img");
profiles.src = "https://RobloxIndonesia.github.io/img/30DAY-AvatarHeadshot-ED6E504DCD0989309333C3F87B84DC2E.png";
profiles.className = "profile";
profiles.alt = "Profile";

link.appendChild(profiles);
document.getElementById("profiles").appendChild(link);


// Banner & Background
const banner = document.getElementById("banner");
const back = document.getElementById("back");


// Logo 
const urlLogo = "https://robloxindonesia.github.io/img/logo.png";

const img1 = document.createElement("img");
img1.src = urlLogo;
img1.alt = "Logo";
img1.width = 100;
document.getElementById("logo1").appendChild(img1);

const img2 = document.createElement("img");
img2.src = urlLogo;
img2.alt = "Logo";
img2.width = 100;
document.getElementById("logo2").appendChild(img2);
