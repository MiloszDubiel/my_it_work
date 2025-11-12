import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { connection } from "../config/db.js";

puppeteer.use(StealthPlugin());

export async function insertOffer(db, job, details) {
  try {
    const [result] = await db.execute(
      `INSERT IGNORE INTO job_offers 
      (title, companyName, workingMode, contractType, experience, technologies, description, salary, is_active, link, img, type, source, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        job.title,
        job.companyName || null,
        JSON.stringify(job.workingMode || []),
        JSON.stringify(job.contractType || []),
        JSON.stringify(job.experience || []),
        JSON.stringify(job.technologies || []),
        details?.description || "",
        job.salary || "",
        1,
        job.link || "",
        job.img || "",
        job.type || "",
        "scraped",
      ]
    );

    const jobOfferId = result.insertId;

    await db.execute(
      `INSERT IGNORE job_details 
      (job_offer_id, description, requirements, responsibilities, benefits, extra_info, technologies, locations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jobOfferId,
        details?.description || "",
        details?.requirements || "",
        details?.responsibilities || "",
        details?.benefits || "",
        details?.extra_info || "",
        details?.technologies || "",
        details?.locations || "",
      ]
    );

    console.log(`✅ Zapisano ofertę ID ${jobOfferId}: ${job.title}`);
  } catch (err) {
    console.error("❌ Błąd przy zapisie oferty:", err.message);
  }
}

export async function scrapeAll() {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1920, height: 1080 },
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // ================================
  // BULLDOGJOB.PL
  // ================================
  for (let i = 1; i <= 10; i++) {
    // dla testów ogranicz
    console.log(`Scraping BulldogJob.pl — strona ${i}`);
    await page.goto(
      `https://bulldogjob.pl/companies/jobs/s/order,published,desc/page,${i}`,
      {
        waitUntil: "networkidle2",
      }
    );

    const jobs = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".JobListItem_item__fYh8y")
      ).map((el) => ({
        title:
          el
            .querySelector(".JobListItem_item__title__278xz h3")
            ?.textContent?.trim() || "",
        companyName:
          el
            .querySelector(".JobListItem_item__title__278xz div")
            ?.textContent?.trim() || "",
        workingMode: [
          el
            .querySelector(".JobListItem_item__details__sg4tk .relative span")
            ?.textContent?.trim() || "",
          Array.from(
            el.querySelectorAll(
              ".JobListItem_item__details__sg4tk .shadow-dropdown span"
            )
          ).map((t) => t.textContent),
        ],
        contractType: [
          el
            .querySelectorAll(
              ".JobListItem_item__details__sg4tk .items-start "
            )[0]
            ?.textContent?.trim() || "",
        ],
        experience: [
          el
            .querySelectorAll(
              ".JobListItem_item__details__sg4tk .items-start "
            )[1]
            ?.textContent?.trim() || "",
        ],
        technologies: Array.from(
          el.querySelectorAll(".JobListItem_item__tags__POZkk .flex span")
        ).map((tag) => tag.textContent.trim()),
        salary:
          el
            .querySelector(".JobListItem_item__salary__OIin6")
            ?.textContent?.trim() || "not available",
        img: el.querySelector(".JobListItem_item__logo__Jnbqn img")?.src || "",
        link: el.href,
        type: "bulldogjob.pl",
      }));
    });

    for (let job of jobs) {
      console.log(`→ Szczegóły ${job.title}`);
      const jobPage = await browser.newPage();
      await jobPage.goto(job.link, { waitUntil: "networkidle2" });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const details = await jobPage.evaluate(() => {
        return {
          description:
            document.querySelector("#accordionGroup ")?.innerHTML || "",
        };
      });
      await insertOffer(connection, job, details);
      await jobPage.close();
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // ================================
  // THEPROTOCOL.IT
  // ================================
  for (let i = 1; i <= 10; i++) {
    console.log(`Scraping TheProtocol.it — strona ${i}`);
    await page.goto(`https://theprotocol.it/filtry/;c?pageNumber=${i}`, {
      waitUntil: "networkidle2",
    });

    const jobs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a.a4pzt2q"))
        .map((el) => ({
          title: el.querySelector("#offer-title")?.textContent?.trim() || "",
          companyName: el
            .querySelectorAll("div.l1c07yeh")[0]
            ?.textContent?.trim(),
          workingMode: el
            .querySelectorAll("div.l1c07yeh")[2]
            ?.textContent?.trim(),
          experience: ["Junior", "Mid", "Senior"],
          contractType: ["B2B", "UoP"],
          technologies: [...el.querySelectorAll("div.c13r9id2 div")].map(
            (t) => t.textContent
          ),
          salary: "not available",
          img: el.querySelector("img")?.src,
          link: el.href,
          type: "theprotocol.it",
        }))
        .filter((el) => el.title);
    });

    for (let job of jobs) {
      console.log(`→ Szczegóły ${job.title}`);
      const jobPage = await browser.newPage();
      await jobPage.goto(job.link, { waitUntil: "networkidle2" });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const details = await jobPage.evaluate(() => {
        return {
          description: document.querySelector(".o1r47x2m .bptj5gp .p1eexex0")
            ?.innerHTML,
          requirements: document.querySelector(".o1r47x2m .bptj5gp ul")
            ?.innerHTML,
        };
      });

      await insertOffer(connection, job, details);
      await jobPage.close();
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // ================================
  // NOFLUFFJOBS.COM
  // ================================
  await page.goto(
    "https://nofluffjobs.com/pl/artificial-intelligence?criteria=category%3Dsys-administrator,business-analyst,architecture,backend,data,ux,devops,erp,embedded,frontend,fullstack,game-dev,mobile,project-manager,security,support,testing,other",
    { waitUntil: "networkidle2" }
  );

  for (let i = 0; i < 10; i++) {
    try {
      await page.evaluate(() => {
        const btn = document.querySelectorAll("div.tw-flex button.tw-btn")[6];
        btn?.click();
      });
      await new Promise((r) => setTimeout(r, 1500));
    } catch {}
  }

  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a.posting-list-item")).map(
      (el) => ({
        title: el.querySelector("h3")?.textContent?.trim() || "",
        companyName:
          el.querySelector("h4.company-name")?.textContent?.trim() || "",
        workingMode: [
          el.querySelector("footer div.tw-text-gray")?.textContent?.trim() ||
            "",
        ],
        experience: ["Junior", "Mid", "Senior"],
        technologies: Array.from(
          el.querySelectorAll("nfj-posting-item-tiles span")
        ).map((t) => t.textContent),
        contractType: ["B2B", "UoP"],
        salary:
          el.querySelector("nfj-posting-item-salary")?.textContent?.trim() ||
          "",
        img: el.querySelector("img")?.src || "",
        link: el.href,
        type: "nofluffjobs.com",
      })
    );
  });

  for (let job of jobs) {
    console.log(`→ Szczegóły ${job.title}`);
    const jobPage = await browser.newPage();
    await jobPage.goto(job.link, { waitUntil: "networkidle2" });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const details = await jobPage.evaluate(() => {
      return {
        description: document.querySelector("#posting-description").innerHTML,
        requirements: document.querySelector(
          "nfj-read-more .tw-overflow-hidden ul"
        ).innerHTML,
      };
    });

    await insertOffer(connection, job, details);
    await jobPage.close();
    await new Promise((r) => setTimeout(r, 1000));
  }

  await browser.close();

  console.log("✅ Wszystkie oferty zostały zapisane!");
}
