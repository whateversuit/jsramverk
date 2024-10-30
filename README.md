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
* ändrat i package.json
  "scripts": {
    "start": "node app.mjs",
    "dev": "nodemon app.mjs"
 ```
Kör npm nodemon app.mjs istället för node app.mjs.

* Skapade mappen routes/ för nya expressroutes som returnerar JSON-data istället för vyer. Gamla vyer finns fortfarande kvar medans vi utvecklar.

http://localhost:1337/ Visar nu alla dokument i databasen i JSON-format.
http://localhost:1337/:id Visar nu ett specifikt dokument i databasen i JSON-format. Ersätt id med nummer.

# Byta databas från SQLite till MongoDB

Följ stegen nedan för att byta till MongoDB-databas i vårat projekt.

## 1. Installera MongoDBs officiella Node.js driver
För att interagera med MongoDB från node.js, installera den officiella drivrutinen med följande kommando:
```bash
npm install mongodb
```

## 2. Skapa anslutning till MongoDB-server
Skapa en anslutning till MongoDB-server genom att använda funktionen openDb(), som returnerar en referens till den collection vi vill arbeta med (motsvarande tabell i SQL). Koden för anslutningen finns i filen db/database.mjs

## 3. Anpassa API-koden för CRUD-operationer
Uppdatera API-koden för att använda MongoDB för våra CRUD-operationer.

## 4. Uppdatera databasens struktur
MongoDB använder dokument istället för rader och kolumne som i SQL. Därför behöver vi inte skapa några tabeller eller definiera scheman som i SQL (om inte Mongoose används).

## 5. Kontrollera databasanslutning
Kör servern som vanligt och använd mongosh för att kontrollera att dokument sparas och hämtas korrekt från databasen.

## 6. Skapa en MongoDB-databas och collections
För att skapa en databas och collections, följ dessa steg:
1. Öppna MongoDB Compass.
2. Anslut till lokal MongoDB-server genom att klicka på "Connect".
3. Skapa ny databas: Välj "Create Database", ange databasnamn och collectionsnamn.
4. Lägg manuellt till dokument (poster), eller i terminalen genom db.documents.insertOne({}).

## 7. Använd MongoDB Shell
Starta MongoDB Shell med kommandot:
```bash
mongosh
```
Byt databas med:
```bash
use docsforjsramverk
```
Skapa en collection med:
```bash
db.documents.insertOne({ title: "My First Document", content: "This is a test document." })
```
Verifiera att collection är skapad med:
```bash
db.documents.find().pretty()
```

## 8. Testa API-funktionaliteten
Skapa en lokal datakatalog för att lagra MongoDB-data:
```bash
mkdir -p ~/jsramverk/db/mongodb-data
```
Konfigurera MongoDb att använda denna katalog som databasväg. Starta MongoDB med följande kommando:
```bash
mongod --dbpath ~/jsramverk/db/mongodb-data
```
Detta kommando säkerställer att MongoDB använder den angivna katalogen för datalagring.

Adderade paket dotenv med kommandot
```bash
npm install --save dotenv
```
Vi har Lagt till .env fil med username och password.

Vi har installerat Azure i vscode enligt instruktionerna och skapat en webapp på Microsoft Azure för deployment.

URL för backend-applikationen är https://jsramverk-emlx23-d5hyekcpbdcxdjch.swedencentral-01.azurewebsites.net/

# Implementera graphQL

## 1. Vad vi gjorde

1. Installerade graphQL
2. skapade en root.js för graphQL objekten med felhantering
3. kommenterade bort kod för gamla express routes
4. uppdaterade app.mjs för att använda graphQL routes och importera schema från root.js


Varför graphQL?

Färre requests till databasen vilket leder till mindre trafik och en lättare applikation.
"Mutations" ersätter PUT, DELETE och UPDATE i ett REST-api.

