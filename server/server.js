import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function getJobOfferts(pagesToScrape = 5, maxPerPage = 50) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const allJobs = [];

  const safeMax = Math.min(maxPerPage, 50);

  for (let i = 1; i <= pagesToScrape; i++) {
    console.log(`Scraping page ${i}...`);
    await page.goto(
      `https://bulldogjob.pl/companies/jobs/s/order,published,desc/page,${i}`,
      {
        waitUntil: "networkidle2",
      }
    );

    await page.waitForSelector(".JobListItem_item__fYh8y");

    const jobs = await page.evaluate((safeMax) => {
      return Array.from(document.querySelectorAll(".JobListItem_item__fYh8y"))
        .slice(0, safeMax)
        .map((el) => ({
          title: el
            .querySelector(".JobListItem_item__title__278xz h3")
            ?.textContent?.trim(),
          companyName: el
            .querySelector(".JobListItem_item__title__278xz div")
            ?.textContent?.trim(),
          workingMode: el
            .querySelector(".JobListItem_item__details__sg4tk .relative ")
            ?.textContent?.trim(),
          contractType: el
            .querySelectorAll(
              ".JobListItem_item__details__sg4tk .items-start "
            )[0]
            ?.textContent?.trim(),
          experience: el
            .querySelectorAll(
              ".JobListItem_item__details__sg4tk .items-start "
            )[1]
            ?.textContent?.trim(),
          technologies: Array.from(
            el.querySelectorAll(".JobListItem_item__tags__POZkk .flex span")
          ).map((tag) => tag.textContent.trim()),
          salary:
            el
              .querySelector(".JobListItem_item__salary__OIin6 ")
              ?.textContent?.trim() || "not available",
          img:
            el.querySelector(".JobListItem_item__logo__Jnbqn img")?.src || "",
          link: el?.href,
        }));
    }, safeMax);

    allJobs.push(...jobs);
  }

  await browser.close();
  return allJobs;
}

export async function getEmployers(link) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const allEmployers = [];

  console.log(`Scraping page ${i}: ${link}`);

  await page.goto(url, { waitUntil: "domcontentloaded" });

  try {
    await page.waitForSelector(".jsx-4039385543", {
      timeout: 10000,
    });
    const employers = await page.evaluate(() => {
      return Array.from(document.querySelector(".jsx-4039385543")).map(
        (el) => ({
          willDo: Array.from(
            el.querySelectorAll("#1-panel .list--check ul li")
          ).map((tag) => tag?.textContent),
          offerts: el.querySelectorAll(".#2-panel .list--check ul li")
            ?.textContent,
        })
      );
    });

    allEmployers.push(...employers);
  } catch (err) {
    console.error(`Błąd ładowania zawartości strony ${i}:`, err.message);
  }

  await browser.close();
  return allEmployers;
}

export async function getOfertDetails(link) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`Scraping page: ${link}`);

  await page.goto(link, { waitUntil: "domcontentloaded" });

  try {
    await page.waitForSelector("main.jsx-1023221994 aside.jsx-1023221994", {
      timeout: 10000,
    });
    const details = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("main.jsx-1023221994 aside.jsx-1023221994")
      ).map((el) => ({
        money: el.querySelector(".mb-4 p.text-c22")?.textContent,
        type: el.querySelector(".mb-4 p.mt-1")?.textContent,
      }));
    });

    await browser.close();
    return details;
  } catch (err) {
    console.error(`Błąd ładowania zawartości strony:`, err.message);
  }

  await browser.close();
}

app.get("/api/get-job-offerts", async (req, res) => {
  try {
    const pages = parseInt(req.query.pages) || 1;
    const perPage = parseInt(req.query.perPage) || 50;

    const offers = await getJobOfferts(pages, perPage);
    res.json(offers);
  } catch (error) {
    console.error("Błąd scrapowania:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/get-employers", async (req, res) => {
  try {
    const pages = parseInt(req.query.pages) || 1;
    const offers = await getEmployers(pages);
    res.json(offers);
  } catch (error) {
    console.error("Błąd scrapowania:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/get-ofert-details", async (req, res) => {
  try {
    const { link } = req.body;
    const offersDetails = await getOfertDetails(link);
    res.json(offersDetails);
  } catch (error) {
    console.error("Błąd scrapowania:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Scraper API działa`));
