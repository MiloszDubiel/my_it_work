import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import { BiMoney } from "react-icons/bi";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function scrapeProtocolOffers() {
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();
  await page.goto("https://theprotocol.it/praca?pageNumber=1", {
    waitUntil: "networkidle2",
  });
  await page.waitForSelector(".a4pzt2q "); // dostosuj selektor

  // Pobieranie danych ofert
  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".a4pzt2q ")).map((el) => ({
      title: el.querySelector(".t1sf8hf8")?.innerText.trim(),
      company: el.querySelector(".r4179ok")?.innerText.trim(),
      trybe: el.querySelectorAll(".l86y70m .l1wv8638")[1]?.innerText.trim(),
      cities: {
        city: el.querySelectorAll(".l86y70m .l1wv8638")[2]?.innerText.trim(),
        choises: el.querySelector(".c1apubow")?.innerText.trim(),
      },
      url: el.href,
      salery: {
        option1: el.querySelectorAll(".i1wqx14h")[0]?.innerText.trim(),
        option2: el.querySelectorAll(".i1wqx14h")[1]?.innerText.trim(),
      },
      image: el.querySelector("img")?.src,
    }));
  });

  await browser.close();
  return jobs;
}

app.get("/api/protocol-jobs", async (req, res) => {
  try {
    const offers = await scrapeProtocolOffers();
    res.json(offers);
  } catch (error) {
    console.error("Błąd scrapowania:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () =>
  console.log(
    `Scraper API działa na http://localhost:${PORT}/api/protocol-jobs`
  )
);
