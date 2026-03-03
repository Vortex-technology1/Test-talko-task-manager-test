// BUSINESS STRUCTURE - Module 65 (iframe)

function showBizStructureTab() {
    var c = document.getElementById("bizstructureTab");
    if (!c) return;
    if (!currentCompany) {
        c.innerHTML = "<p style=\"padding:20px;color:#888;\">Завантаження компанії...</p>";
        return;
    }
    var f = document.getElementById("bizIframe");
    var expectedSrc = "biz-structure.html?company=" + encodeURIComponent(currentCompany);
    if (!f) {
        f = document.createElement("iframe");
        f.id = "bizIframe";
        f.src = expectedSrc;
        f.style.width = "100%";
        f.style.height = "calc(100vh - 180px)";
        f.style.border = "none";
        c.innerHTML = "";
        c.appendChild(f);
    }
}
function hideBizStructureTab() {}
