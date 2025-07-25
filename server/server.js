import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function getJobOfferts(pagesToScrape = 5) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const allJobs = [];

  for (let i = 1; i <= pagesToScrape; i++) {
    console.log(`Scraping page ${i}...`);
    await page.goto(
      `https://bulldogjob.pl/companies/jobs/s/order,published,desc/page,${i}`,
      {
        waitUntil: "networkidle2",
      }
    );

    await page.waitForSelector(".JobListItem_item__fYh8y");

    const jobs = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".JobListItem_item__fYh8y")
      ).map((el) => ({
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
        img: el.querySelector(".JobListItem_item__logo__Jnbqn img")?.src || "",
        link: el?.href,
      }));
    });

    allJobs.push(...jobs);
  }

  await browser.close();
  return allJobs;
}

export async function getEmployers(pagesToScrape = 5) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const allEmployers = [];

  for (let i = 1; i <= pagesToScrape; i++) {
    const url =
      i === 1
        ? "https://bulldogjob.pl/companies/profiles"
        : `https://bulldogjob.pl/companies/profiles/s/page,${i}`;

    console.log(`Scraping page ${i}: ${url}`);

    await page.goto(url, { waitUntil: "domcontentloaded" });

    try {
      await page.waitForSelector(".container", {
        timeout: 10000,
      });
      await page.screenshot({ path: "snapshot.png" });
      const employers = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".container div:not(.mb-10) a")
        )
          .filter((el) => el.querySelector("h3") != null)
          .map((el) => ({
            companyName: el.querySelector("h3")?.textContent,
            technologies: Array.from(el.querySelectorAll(".gap-3 span")).map(
              (tag) => tag.textContent.trim()
            ),
            localization: Array.from(
              el.querySelectorAll(".rounded-t-lg span")
            ).map((tag) => tag.textContent.trim()),
            img: el.querySelector("img")?.src,
            link: el?.href,
          }));
      });

      allEmployers.push(...employers);
    } catch (err) {
      console.error(`Błąd ładowania zawartości strony ${i}:`, err.message);
    }
  }

  await browser.close();
  return allEmployers;
}

app.get("/api/get-job-offerts", async (req, res) => {
  try {
    const pages = parseInt(req.query.pages) || 1;
    const offers = await getJobOfferts(pages);
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

app.listen(PORT, () => console.log(`Scraper API działa`));
