# SSR Editor

Starter project for DV1677 JSRamverk

> Detta projekt bygger på kursen jsramverk (JavaScript-baserad webbramverk) och görs av Emil Lindström samt Saga Eriksson. Genom kursens gång ska vi bygga vidare på en "real-time collaborative text-editor"-applikation. Vi kommer titta på hur detta samarbetet blir optimalt samt vilka verktyg och tekniker som finns för att vidareutveckla kod tillsammans.

Detta repo ska hädanefter innehålla backend-koden för vårat projekt. Frontend-koden kommer att hanteras i ett separat repo.

För att köra applikationen i dess nuvarande form:

### 1. Klona repot
För att klona repot, kör följande kommando:
```bash
git clone https://github.com/whateversuit/jsramverk.git
cd jsramverk
```

### 2. Installera nödvändiga paket
Installera npm
Installera methodOverride för att tillåta PUT-router
Installera node.js
Installera sqlite3

### 3. Skapa/konfigurera SQLite-databasen
För att återställa och konfigurera databasen, kör följande skript:
```bash
./db/reset_db.bash
```
Detta skript tömmer och skapar en ny databas och en tabell för dokument i docs.sqlite enligt det SQL-skript som finns i filen migrate.sql:
```bash
reset_db.bash:
$(> db/docs.sqlite)
cat db/migrate.sql | sqlite3 db/docs.sqlite

migrate.sql:
CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATE DEFAULT (datetime('now','localtime'))
);
```

### 4. Starta applikationen
För att starta applikationen, stå i mappen för git-repot:
```bash
node app.mjs
```
Servern kommer då starta på localhost:1337, besök webbläsaren för att se vår applikation: http://localhost:1337


### Våra steg för Specifikation-uppgiften
* Vi valde en port för applikationen som den skulle köras på (1337).
* Ett forumlär i index.ejs lades till för att kunna skapa ett nytt dokument.
* Formuläret i doc.ejs ändrades till en PUT-route.
* En ny POST-route för att skapa nya dokument lades till.
* En ny PUT-route för att uppdatera ett dokument lades till.
* Vi uppdaterade tabellen "documents" i migrate.sql så att varje dokument fick eget id.
* Vi skapade funktionen "updateOne" i docs.mjs för att uppdatera ett befintligt dokument (id, body).
* Vi adderade css-style för index-vyn, doc-vyn, footer, navbar och header.

### Val av fronted ramverk

Vi har valt React som frontend-ramverk i detta projekt för att hantera den dynamiska och interaktiva delen av användargränssnittet.
<br>
![image](https://github.com/user-attachments/assets/272a93bd-4e71-4827-b9cd-618fefdbe8bc)
<br>
Vi har ännu inte implementerat React i vårat projekt, men det planeras till nästa uppgift: Refaktorering.
React är ett komponentbaserat ramverk som gör det lätt att återanvända och organisera UI-kod. Med sin virtuella DOM är det effektivt att enbart uppdatera de delar av sidan som behöver detta.

### GitHub Flow
Vi har börjat använda oss av GitHub Flow för att hantera vår kodbas. Flödet ser ut såhär:
```bash
skapa ny branch
git switch -c <branch-name>

arbeta på branchen
git add .
git commit -m "meddelande"
git push origin <branch-name>

skapa pull request på GitHub för att få feedback
Merge till main-branchen när allt är godkänt
ta bort den gamla branchen när den blivit mergad:
git branch -d <branch-name>
git push origin --delete <branch-name>
```
# Refaktorering

### Våra steg refaktorerings-uppgiften

Installera nodemon för att kunna starta om servern vid varje ändring.
```bash
npm install -g nodemon
* ändrat i pagacke.json
  "scripts": {
    "start": "node app.mjs",
    "dev": "nodemon app.mjs"
 ```
Kör npm nodemon app.mjs istället för node app.mjs.

* Skapade mappen routes/ för nya expressroutes som returnerar JSON-data istället för vyer. Gamla vyer finns fortfarande kvar medans vi utvecklar.

http://localhost:1337/ Visar nu alla dokument i databasen i JSON-format.
http://localhost:1337/:id Visar nu ett specifikt dokument i databasen i JSON-format. Ersätt id med nummer.