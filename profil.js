(() => {
    const data = window.__profilData;

    if (!data) {
        console.log("Data profil tidak ditemukan.");
        return;
    }

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value ?? "";
    };

    const setImage = (id, src) => {
        const el = document.getElementById(id);
        if (el && src) el.src = src;
    };

    // PROFIL
    setText("displayName", data.displayName);
    setText("username", data.name);
    setText("bio", data.description || "Tidak ada bio");

    setImage("avatar", data.avatarHeadshotUrl || data.imageUrl);
    const banner = document.getElementById("banner");
    const back = document.getElementById("back");

    if (banner && data.imageUrl) {
        banner.onload = () => {
            if (back) {
            back.classList.remove("back1", "back2");
        }
    };

    banner.src = data.imageUrl;
    }
    // STATISTIK
    setText("friends", data.friendsCount);
    setText("followers", data.followersCount);
    setText("following", data.followingCount);

// VERIFIED
const certified = document.getElementById("certified");

if (certified) {
    if (data.hasVerifiedBadge === true) {
        certified.src = "/iconsvg/certified.svg";
        certified.style.display = "inline-block";
    } else {
        certified.style.display = "none";
    }
}
    // LINK PROFIL ROBLOX
    const robloxButton = document.getElementById("editAvatar");

    if (robloxButton && data.name) {
        robloxButton.onclick = () => {
            window.open(
            `https://www.roblox.com/users/${data.id}/profile`,
            "_blank"
        );
    };
}

// INFO LENGKAP
const menuButton = document.getElementById("menu");

if (menuButton) {
    menuButton.onclick = () => {

        const tanggalDibuat = new Date(data.created);

        const tanggal = tanggalDibuat.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        const waktu = tanggalDibuat.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        alert(
`Info Lengkap

Nama Tampilan
${data.displayName}

Username
@${data.name}

ID Pengguna
${data.id}

Dibuat
Tanggal : ${tanggal}
Waktu    : ${waktu}

Status
${data.isBanned ? "Diblokir" : "Aktif"}

Lencana Verifikasi
${data.hasVerifiedBadge ? "Terverifikasi" : "Tidak terverifikasi"}`
        );
    };
}

const tabTentang = document.getElementById("tabTentang");
const tabKreasi = document.getElementById("tabKreasi");

const tentang = document.getElementById("tentang");
const kreasi = document.getElementById("kreasi");

// Saat halaman pertama dibuka
tentang.hidden = false;
kreasi.hidden = true;

tabTentang.onclick = () => {
    tentang.hidden = false;
    kreasi.hidden = true;
};

tabKreasi.onclick = () => {
    tentang.hidden = true;
    kreasi.hidden = false;
};

// KREASI
const gameList = document.getElementById("gameList");

if (gameList) {
    gameList.innerHTML = "";

    (data.creations || []).forEach(game => {
        const item = document.createElement("div");
        item.className = "kreasi-item";

        item.innerHTML = `
            <img src="${game.imageUrl}" alt="${game.name}">

            <div class="kreasi-info">
                <strong>${game.name}</strong>

                <p>
                    ${game.description || "Tidak ada deskripsi"}
                </p>

                <div class="kreasi-stats">
                    👁 ${game.visits ?? 0} kunjungan
                </div>
            </div>
        `;

        gameList.appendChild(item);
    });
}

    // SAAT INI MEMAKAI
    const memakai = document.getElementById("memakai");

    if (memakai) {
        memakai.innerHTML = "";

        (data.currentlyWearing || []).forEach(item => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${item.imageUrl}" alt="">
                <p>${item.name}</p>
            `;

            memakai.appendChild(card);
        });
    }

    // FAVORIT
    const favorit = document.getElementById("favorit");

    if (favorit) {
        favorit.innerHTML = "";

        (data.favoriteGames || []).forEach(game => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${game.imageUrl}" alt="">
                <p>${game.name}</p>
            `;

            favorit.appendChild(card);
        });
    }

    // KOMUNITAS
    const komunitas = document.getElementById("komunitas");

    if (komunitas) {
        komunitas.innerHTML = "";

        (data.communities || []).forEach(group => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${group.imageUrl}" alt="">
                <p>${group.name}</p>
                <small>${group.role?.name || "Member"}</small>
            `;

            komunitas.appendChild(card);
        });
    }

    // JUDUL
    document.title =
        `${data.displayName || data.name} - Roblox Indonesia`;

    console.log("Profil berhasil dimuat:", data.name);
})();