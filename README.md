# Tippmix webes felület — GitHub Excel mentéssel

## Mit csinál?
- A GitHub repository `tippmix.xlsx` fájlját olvassa be.
- A fogadások mentésekor frissíti a GitHubon lévő munkafüzetet, ha a GitHub-kapcsolat aktív.
- A heti/havi elemzést a weboldal számolja újra.

## GitHub Pages telepítés
1. Töltsd fel az `index.html` és `tippmix.xlsx` fájlokat a `Ogre3Dofficial/tippmix` repository `main` ágának gyökérkönyvtárába.
2. GitHub → Settings → Pages → Deploy from a branch → `main` → `/(root)`.
3. Nyisd meg: https://ogre3dofficial.github.io/tippmix/ .

## GitHub mentés engedélyezése
1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.
2. Resource owner: `Ogre3Dofficial`.
3. Repository access: Only select repositories → `tippmix`.
4. Repository permissions: **Contents: Read and write**. Más jogosultságot ne adj.
5. Hozd létre a tokent, másold ki, majd a weboldalon a „Mentés a GitHubon lévő Excelbe” panelen illeszd be, és kattints a Kapcsolódás gombra.
6. A token csak a böngésző memóriájában marad, nem tároljuk localStorage-ban, és az oldal frissítésekor újra be kell illeszteni. Ne illeszd be nyilvános vagy megosztott gépen.

## Fontos biztonsági és működési megjegyzések
- A webes felület módosításai jelszó nélkül elérhetők; a GitHub-token csak mentéshez szükséges.
- A repository nyilvános, ezért maga az Excel nyilvánosan letölthető.
- A tokent kizárólag erre az egy repositoryra és csak Contents: Read and write jogosultságra korlátozd.
A GitHub-token ettől függetlenül szükséges a GitHubra íráshoz.
- A mentés a `Tippmix napló` munkalap C:I oszlopait frissíti, a meccsnevet és tippet J:K oszlopba írja. A többi munkalapot a könyvtár megőrzi. Első használat előtt tarts biztonsági másolatot az Excelről.
- A GitHubon a változás commitként jelenik meg. Egyszerre csak egy eszközön szerkessz, mert a párhuzamos mentések felülírhatják egymást.
- Az ExcelJS/XLSX könyvtárak CDN-ről töltődnek, ezért internetkapcsolat kell.
