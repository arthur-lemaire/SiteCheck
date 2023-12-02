const express = require("express");
const puppeteer = require("puppeteer");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;
const checkTimeout = 10;
let countDown = checkTimeout; // Temps en secondes (10 minutes)

// Fonction pour vérifier le statut des sites web
async function checkSitesStatus() {
  const sites = [
    "https://www.example.com",
    "https://www.example2.com",
    // Ajoutez autant de sites que nécessaire
  ];

  const browser = await puppeteer.launch();
  const results = [];

  for (const site of sites) {
    try {
      const page = await browser.newPage();
      const startTime = Date.now(); // Enregistrez le temps de début

      const response = await page.goto(site, { waitUntil: "domcontentloaded" });

      const endTime = Date.now(); // Enregistrez le temps de fin
      const responseTime = endTime - startTime;

      // Vérifiez si le statut de la réponse est 200 (OK)
      const status = response.status();
      results.push({ site, status, responseTime });

      await page.close();
    } catch (error) {
      console.error(
        `Erreur lors de la vérification de ${site}: ${error.message}`
      );
      results.push({ site, status: "Erreur", responseTime: null });
    }
  }

  await browser.close();

  // Mettez à jour le temps restant
  return results;
}

// Définir le moteur de modèle comme EJS
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Configurer la gestion des connexions WebSocket
io.on("connection", (socket) => {
  console.log("Nouveau client connecté");

  // Envoyer le temps restant à chaque nouveau client
  socket.emit("countdown", countDown);
});

// Route pour afficher les résultats et le compte à rebours
app.get("/", async (req, res) => {
  try {
    const results = await checkSitesStatus();
    res.render("index", { results, countdownTime: countDown });
  } catch (error) {
    console.error(
      `Une erreur s'est produite lors de la vérification des sites: ${error.message}`
    );
    res.status(500).send("Erreur interne du serveur");
  }
});

// Planifiez la vérification et la mise à jour du compte à rebours toutes les secondes (1000 ms)
setInterval(async () => {
  if (countDown === 0) {
    countDown = checkTimeout;
    try {
      const results = await checkSitesStatus();
      console.log("Vérification effectuée:", results);
      // Envoyez les résultats à tous les clients connectés
      await io.emit("update", results);
    } catch (error) {
      console.error(
        `Une erreur s'est produite lors de la vérification automatique: ${error.message}`
      );
    }
  } else {
    countDown = countDown - 1;
    await io.emit("countdown", countDown); // Envoyez le temps restant à tous les clients connectés

    console.log("Temps restant avant la prochaine execution : ", countDown);
  }
}, 1000);

// Lancez le serveur
server.listen(PORT, () => {
  console.log(
    `Serveur Express en cours d'exécution sur http://localhost:${PORT}`
  );
});
