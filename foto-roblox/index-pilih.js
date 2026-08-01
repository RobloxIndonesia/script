// Daftar foto
const fotoList = [];

for (let i = 1; i <= 43; i++) {
    fotoList.push(`wallpaper-roblox/w${i}.png`);
}

const gallery = document.getElementById("gallery");

fotoList.forEach(src => {
    const item = document.createElement("div");
    item.className = "item";

    item.innerHTML = `
        <div class="check">✔</div>
        <img src="${src}">
    `;

    item.onclick = () => {
        item.classList.toggle("selected");
        updateJumlah();
    };

    gallery.appendChild(item);
});

function updateJumlah(){
    document.getElementById("jumlah").textContent =
        document.querySelectorAll(".item.selected").length + " Dipilih";
}

function downloadSemua(){
    const gambar = document.querySelectorAll(".item.selected img");

    if(gambar.length === 0){
        alert("Pilih foto terlebih dahulu.");
        return;
    }

    gambar.forEach((img, i) => {
        setTimeout(() => {
            const a = document.createElement("a");
            a.href = img.src;
            a.download = img.src.split("/").pop();
            a.click();
        }, i * 300);
    });
}
