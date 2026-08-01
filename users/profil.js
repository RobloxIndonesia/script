document.getElementById("banner").src = profil.banner;
document.getElementById("avatar").src = profil.avatar;

document.getElementById("title").textContent = profil.title;
document.getElementById("displayName").textContent = profil.displayName;
document.getElementById("username").textContent = profil.username;

document.getElementById("certified").src = profil.certified;
document.getElementById("plus").src = profil.plus;

document.getElementById("friends").textContent = profil.teman;
document.getElementById("followers").textContent = profil.pengikut;
document.getElementById("following").textContent = profil.mengikuti;

document.getElementById("bio").textContent = profil.bio;

document.getElementById("editAvatar").onclick = () => {
    window.location.href = profil.urlRoblox;
};

document.getElementById("editProfil").onclick = () => {
    window.location.href = profil.urlYoutube;
};

document.getElementById("menu").onclick = () => {
    alert("Menu Lainnya");
};

document.getElementById("tabTentang").onclick = () => {
    document.getElementById("tentang").hidden = false;
    document.getElementById("kreasi").hidden = true;
};

document.getElementById("tabKreasi").onclick = () => {
    document.getElementById("tentang").hidden = true;
    document.getElementById("kreasi").hidden = false;
};

function tampilkan(data, id) {
    const box = document.getElementById(id);
    box.innerHTML = "";

    data.forEach(item => {
        box.innerHTML += `
            <div class="card">
                <img src="${item.gambar}" alt="${item.nama}">
                <p>${item.nama}</p>
            </div>
        `;
    });
}

tampilkan(memakai, "memakai");
tampilkan(favorit, "favorit");

// Gambar berhasil dimuat
banner.onload = () => {
    back.classList.remove("back", "back1", "back2");
};

// Gambar gagal dimuat
banner.onerror = () => {
    back.classList.add("back", "back1", "back2");
};
