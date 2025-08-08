import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import connection from "./db.js";

puppeteer.use(StealthPlugin());
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function getJobOfferts() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const allJobs = [];

  for (let i = 1; i <= 120; i++) {
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
        workingMode: [
          el
            .querySelector(".JobListItem_item__details__sg4tk .relative span")
            ?.textContent?.trim(),
          Array.from(
            [
              ...el.querySelectorAll(
                ".JobListItem_item__details__sg4tk .shadow-dropdown span"
              ),
            ].map((tag) => {
              return tag.textContent;
            })
          ),
        ],
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

async function getEmployers() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const employers = [];

  for (let i = 1; i <= 120; i++) {
    console.log(`Scraping page ${i}...`);
    await page.goto(`https://bulldogjob.pl/companies/profiles/s/page,${i}`, {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector(".container a");

    const employer = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".container a"))
        .map((el) => ({
          companyName: el.querySelector(
            ".styles_cli__wrapper__OcwPn .justify-between .items-center"
          )?.textContent,
          technologies: [
            [
              ...el.querySelectorAll(
                ".styles_cli__wrapper__OcwPn .flex-wrap span"
              ),
            ].map((tag) => {
              return tag.textContent;
            }),
          ],
          locations: [
            el.querySelector(".text-sm")?.textContent,
            [
              [
                ...el.querySelectorAll(
                  ".styles_cli__wrapper__OcwPn  div.rounded-t-lg div.px-1 span"
                ),
              ].map((tag) => {
                return tag.textContent;
              }),
            ],
          ],
          link: el.href,
          img: el.querySelector(".w-full img")?.src,
        }))
        .filter((el) => el.companyName != undefined);
    });

    employers.push(...employer);
  }

  await browser.close();
  return employers;
}

function saveOffersToDb(offers) {
  const insertQuery = `
    INSERT IGNORE INTO job_offers 
      (title, companyName, workingMode, contractType, experience, technologies, salary, img, link) 
    VALUES ?`;

  const values = offers.map((offer) => [
    offer.title || null,
    offer.companyName || null,
    JSON.stringify(offer.workingMode || []),
    offer.contractType || null,
    offer.experience || null,
    JSON.stringify(offer.technologies || []),
    offer.salary || null,
    offer.img || null,
    offer.link || null,
  ]);

  return new Promise((resolve, reject) => {
    connection.query(insertQuery, [values], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

function saveEmployersToDb(employers) {
  const insertQuery = `
    INSERT IGNORE INTO companies
      (companyName, technologies, locations, link, img) 
    VALUES ?`;

  const values = employers.map((employer) => [
    employer.companyName || null,
    JSON.stringify(employer.technologies || []),
    JSON.stringify(employer.locations || []),
    employer.link || null,
    employer.img || null,
  ]);

  return new Promise((resolve, reject) => {
    connection.query(insertQuery, [values], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

app.get("/api/get-job-offerts", async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM job_offerts");
    res.json(rows);
  } catch (error) {
    console.error("Błąd scrapowania:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/get-job-employers", async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM companies");
    res.json(rows);
  } catch (error) {
    console.error("Błąd scrapowania:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/scrape-and-save-job-offerts", async (req, res) => {
  try {
    const offers = await getJobOfferts();
    const result = await saveOffersToDb(offers);

    res.json({
      message: `Zapisano ${result.affectedRows} ofert do bazy danych`,
      inserted: result.affectedRows,
    });
  } catch (error) {
    console.error("Błąd:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/scrape-and-save-employers", async (req, res) => {
  try {
    const offers = await getEmployers();
    const result = await saveEmployersToDb(offers);

    res.json({
      message: `Zapisano ${result.affectedRows} ofert do bazy danych`,
      inserted: result.affectedRows,
    });

    res.json(offers);
  } catch (error) {
    console.error("Błąd:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Serwer działa `));
