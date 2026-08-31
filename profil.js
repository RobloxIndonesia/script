(() => {

    // ========================================
    // AMBIL DATA JSON
    // ========================================

    let data = window.__profilData || {};

    if (!data || Object.keys(data).length === 0) {
        console.log("Data profil tidak ditemukan.");
        return;
    }


    // ========================================
    // ELEMEN HTML
    // ========================================

    const displayName = document.getElementById("displayName");
    const username = document.getElementById("username");
    const description = document.getElementById("bio");

    const friends = document.getElementById("friends");
    const followers = document.getElementById("followers");
    const following = document.getElementById("following");

    const certified = document.getElementById("certified");
    const plus = document.getElementById("plus");

    const popup = document.getElementById("popupProfil");

    const banner = document.getElementById("banner");
    const back = document.getElementById("back");

    const robloxButton = document.getElementById("editAvatar");
    const menuButton = document.getElementById("menu");

    const tabTentang = document.getElementById("tabTentang");
    const tabKreasi = document.getElementById("tabKreasi");

    const tentang = document.getElementById("tentang");
    const kreasi = document.getElementById("kreasi");

    const gameList = document.getElementById("gameList");
    const memakai = document.getElementById("memakai");
    const favorit = document.getElementById("favorit");
    const komunitas = document.getElementById("komunitas");


    // ========================================
    // INPUT POPUP
    // ========================================

    const inputDisplay =
        document.getElementById("inputDisplay");

    const inputUsername =
        document.getElementById("inputUsername");

    const inputDescription =
        document.getElementById("inputDescription");

    const inputFriends =
        document.getElementById("inputFriends");

    const inputFollowers =
        document.getElementById("inputFollowers");

    const inputFollowing =
        document.getElementById("inputFollowing");

    const inputVerified =
        document.getElementById("inputVerified");

    const inputPlus =
        document.getElementById("inputPlus");


    // ========================================
    // HELPER
    // ========================================

    const setText = (el, value) => {

        if (el) {
            el.textContent = value ?? "";
        }

    };


    const setImage = (id, src) => {

        const el =
            document.getElementById(id);

        if (el && src) {
            el.src = src;
        }

    };


    // ========================================
    // TAMPILKAN DATA
    // ========================================

    function tampilkanDataJSON() {

        // PROFIL

        setText(
            displayName,
            data.displayName || "Displayname"
        );

        setText(
            username,
            data.name || data.username || "Username"
        );

        setText(
            description,
            data.description || "Tidak ada bio"
        );


        // STATISTIK

        setText(
            friends,
            data.friendsCount ?? data.friends ?? 0
        );

        setText(
            followers,
            data.followersCount ?? data.followers ?? 0
        );

        setText(
            following,
            data.followingCount ?? data.following ?? 0
        );


        // ====================================
        // AVATAR
        // ====================================

        setImage(
            "avatar",
            data.avatarHeadshotUrl ||
            data.imageUrl
        );


        // ====================================
        // BANNER
        // ====================================

        if (banner && data.imageUrl) {

            banner.onload = () => {

                if (back) {

                    back.classList.remove(
                        "back1",
                        "back2"
                    );

                }

            };

            banner.src =
                data.imageUrl;
        }


        // ====================================
        // VERIFIED
        // ====================================

        if (certified) {

            if (
                data.hasVerifiedBadge === true ||
                data.verified === true
            ) {
                certified.src =
                    "/iconsvg/certified.svg";
                certified.style.display =
                    "inline-block";
            } else {
                certified.style.display =
                    "none";
            }
        }


        // ====================================
        // PLUS
        // ====================================

        if (plus) {
            plus.src = "/iconsvg/plus.svg";
            plus.style.display =
                data.plus === true
                    ? "inline-block"
                    : "none";

        }


        // ====================================
        // JUDUL
        // ====================================

        document.title =
            `${data.displayName ||
            data.name ||
            "Profil"} - Roblox Indonesia`;

    }


    // ========================================
    // JALANKAN OTOMATIS
    // ========================================

    tampilkanDataJSON();


    // ========================================
    // PROFIL ROBLOX
    // ========================================

    if (robloxButton && data.id) {

        robloxButton.onclick = () => {

            window.open(
                `https://www.roblox.com/users/${data.id}/profile`,
                "_blank"
            );

        };

    }


    // ========================================
    // INFO LENGKAP
    // ========================================

    if (menuButton) {

        menuButton.onclick = () => {

            const tanggalDibuat =
                data.created
                    ? new Date(data.created)
                    : new Date();

            const tanggal =
                tanggalDibuat.toLocaleDateString(
                    "id-ID",
                    {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    }
                );

            const waktu =
                tanggalDibuat.toLocaleTimeString(
                    "id-ID",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    }
                );

            alert(
`Info Lengkap

Nama Tampilan
${data.displayName || ""}

Username
@${data.name || data.username || ""}

ID Pengguna
${data.id || "Tidak ada"}

Dibuat
Tanggal : ${tanggal}
Waktu   : ${waktu}

Status
${data.isBanned ? "Diblokir" : "Aktif"}

Lencana Verifikasi
${(
    data.hasVerifiedBadge ||
    data.verified
)
    ? "Terverifikasi"
    : "Tidak terverifikasi"}`
            );

        };

    }


    // ========================================
    // TAB
    // ========================================

    if (tentang && kreasi) {

        tentang.hidden = false;
        kreasi.hidden = true;


        if (tabTentang) {

            tabTentang.onclick = () => {

                tentang.hidden = false;
                kreasi.hidden = true;

            };

        }


        if (tabKreasi) {

            tabKreasi.onclick = () => {

                tentang.hidden = true;
                kreasi.hidden = false;

            };

        }

    }


    // ========================================
    // KREASI
    // ========================================

    if (gameList) {

        gameList.innerHTML = "";

        (data.creations || []).forEach(game => {

            const item =
                document.createElement("div");

            item.className =
                "kreasi-item";

            item.innerHTML = `
                <img
                    src="${game.imageUrl || ""}"
                    alt="${game.name || ""}"
                >

                <div class="kreasi-info">

                    <strong>
                        ${game.name || ""}
                    </strong>

                    <p>
                        ${game.description ||
                        "Tidak ada deskripsi"}
                    </p>

                    <div class="kreasi-stats">
                        👁 ${game.visits ?? 0}
                        kunjungan
                    </div>

                </div>
            `;

            gameList.appendChild(item);

        });

    }


    // ========================================
    // SAAT INI MEMAKAI
    // ========================================

    if (memakai) {

        memakai.innerHTML = "";

        (data.currentlyWearing || [])
            .forEach(item => {

                const card =
                    document.createElement("div");

                card.className =
                    "card";

                card.innerHTML = `
                    <img
                        src="${item.imageUrl || ""}"
                        alt=""
                    >

                    <p>
                        ${item.name || ""}
                    </p>
                `;

                memakai.appendChild(card);

            });

    }


    // ========================================
    // FAVORIT
    // ========================================

    if (favorit) {

        favorit.innerHTML = "";

        (data.favoriteGames || [])
            .forEach(game => {

                const card =
                    document.createElement("div");

                card.className =
                    "card";

                card.innerHTML = `
                    <img
                        src="${game.imageUrl || ""}"
                        alt=""
                    >

                    <p>
                        ${game.name || ""}
                    </p>
                `;

                favorit.appendChild(card);

            });

    }


    // ========================================
    // KOMUNITAS
    // ========================================

    if (komunitas) {

        komunitas.innerHTML = "";

        (data.communities || [])
            .forEach(group => {

                const card =
                    document.createElement("div");

                card.className =
                    "card";

                card.innerHTML = `
                    <img
                        src="${group.imageUrl || ""}"
                        alt=""
                    >

                    <p>
                        ${group.name || ""}
                    </p>

                    <small>
                        ${group.role?.name || "Member"}
                    </small>
                `;

                komunitas.appendChild(card);

            });

    }


    // ========================================
    // EDIT PROFIL
    // ========================================

    const editProfilBtn =
        document.getElementById("editProfil");


    if (editProfilBtn && popup) {

        editProfilBtn.onclick = () => {

            popup.style.display =
                "flex";


            // Display Name

            if (inputDisplay) {

                inputDisplay.value =
                    data.displayName || "";

            }


            // Username

            if (inputUsername) {

                inputUsername.value =
                    data.name ||
                    data.username ||
                    "";

            }


            // Description

            if (inputDescription) {

                inputDescription.value =
                    data.description || "";

            }


            // Friends

            if (inputFriends) {

                inputFriends.value =
                    data.friendsCount ??
                    data.friends ??
                    0;

            }


            // Followers

            if (inputFollowers) {

                inputFollowers.value =
                    data.followersCount ??
                    data.followers ??
                    0;

            }


            // Following

            if (inputFollowing) {

                inputFollowing.value =
                    data.followingCount ??
                    data.following ??
                    0;

            }


            // Verified

            if (inputVerified) {

                inputVerified.checked =
                    data.hasVerifiedBadge === true ||
                    data.verified === true;

            }


            // Plus

            if (inputPlus) {

                inputPlus.checked =
                    data.plus === true;

            }

        };

    }


    // ========================================
    // TUTUP POPUP
    // ========================================

    const closeProfilBtn =
        document.getElementById("closeProfil");


    if (closeProfilBtn && popup) {

        closeProfilBtn.onclick = () => {

            popup.style.display =
                "none";

        };

    }


    // ========================================
    // SIMPAN PROFIL
    // ========================================

    const saveProfilBtn =
        document.getElementById("saveProfil");


    if (saveProfilBtn && popup) {

        saveProfilBtn.onclick = () => {


            // Display Name

            if (inputDisplay) {

                data.displayName =
                    inputDisplay.value;

            }


            // Username

            if (inputUsername) {

                data.name =
                    inputUsername.value;

                data.username =
                    inputUsername.value;

            }


            // Description

            if (inputDescription) {

                data.description =
                    inputDescription.value;

            }


            // Statistik

            if (inputFriends) {

                data.friendsCount =
                    Number(inputFriends.value) || 0;

            }


            if (inputFollowers) {

                data.followersCount =
                    Number(inputFollowers.value) || 0;

            }


            if (inputFollowing) {

                data.followingCount =
                    Number(inputFollowing.value) || 0;

            }


            // Verified

            if (inputVerified) {

                data.hasVerifiedBadge =
                    inputVerified.checked;

                data.verified =
                    inputVerified.checked;

            }


            // Plus

            if (inputPlus) {

                data.plus =
                    inputPlus.checked;

            }


            // =================================
            // UPDATE TAMPILAN
            // =================================

            tampilkanDataJSON();


            // =================================
            // SIMPAN LOCAL STORAGE
            // =================================

            const userIdKey =
                data.id ||
                data.name ||
                "default_user";

            localStorage.setItem(
                "profil_" + userIdKey,
                JSON.stringify(data)
            );


            // Tutup popup

            popup.style.display =
                "none";


            console.log(
                "Profil berhasil diperbarui:",
                data
            );

        };

    }


    // ========================================
    // KLIK DI LUAR POPUP
    // ========================================

    window.addEventListener(
        "click",
        (e) => {

            if (
                popup &&
                e.target === popup
            ) {

                popup.style.display =
                    "none";

            }

        }
    );


    // ========================================
    // SELESAI
    // ========================================

    console.log(
        "Profil berhasil dimuat:",
        data.name || data.username
    );

})();