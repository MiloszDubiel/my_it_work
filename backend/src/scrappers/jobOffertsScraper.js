import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { connection } from "../config/db.js";

puppeteer.use(StealthPlugin());

export async function insertOffer(db, job, details) {
  try {
    const [result] = await db.execute(
      `INSERT IGNORE INTO job_offers 
      (title, companyName, workingMode, contractType, experience, technologies, salary, is_active, link, img, type, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        job.title,
        job.companyName || null,
        JSON.stringify(job.workingMode || []),
        JSON.stringify(job.contractType || []),
        JSON.stringify(job.experience || []),
        JSON.stringify(job.technologies || []),
        job.salary || "",
        1,
        job.link || "",
        job.img || "",
        job.type || "",
        "scraped",
      ],
    );

    const jobOfferId = result.insertId;

    await db.execute(
      `INSERT IGNORE job_details 
      (job_offer_id, description, requirements, active_to)
      VALUES (?, ?, ?, ?)`,
      [
        jobOfferId,
        details?.description || "",
        details?.requirements || "",
        details?.active_to,
      ],
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
      },
    );

    const jobs = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".JobListItem_item__fYh8y"),
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
              ".JobListItem_item__details__sg4tk .shadow-dropdown span",
            ),
          ).map((t) => t.textContent),
        ],
        contractType: [
          el
            .querySelectorAll(
              ".JobListItem_item__details__sg4tk .items-start ",
            )[0]
            ?.textContent?.trim() || "",
        ],
        experience: [
          el
            .querySelectorAll(
              ".JobListItem_item__details__sg4tk .items-start ",
            )[1]
            ?.textContent?.trim() || "",
        ],
        technologies: Array.from(
          el.querySelectorAll(".JobListItem_item__tags__POZkk .flex span"),
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
          description: [
            ...document.querySelectorAll("div.bg-white.rounded-lg.px-6"),
          ]?.map((el) => el.innerHTML),
          active_to_raw:
            document.querySelector("aside.jsx-4039385543 div.flex p.leading-6")
              ?.textContent || null,
        };
      });

      if (details.active_to_raw) {
        const dateParts = details.active_to_raw.match(
          /(\d{2})\.(\d{2})\.(\d{4})/,
        );

        if (dateParts) {
          const [_, day, month, year] = dateParts;
          details.active_to = `${year}-${month}-${day}`;
        } else {
          details.active_to = getFutureDate(30);
        }
      } else {
        details.active_to = getFutureDate(30);
      }

      function getFutureDate(daysInFuture) {
        const date = new Date();
        date.setDate(date.getDate() + daysInFuture);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      }

      await insertOffer(connection, job, details);
      await jobPage.close();
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  //THEPROTOCOL.IT

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
            (t) => t.textContent,
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
        function convertEnglishDate(dateStr) {
          // Funkcja pomocnicza generująca datę +30 dni w formacie YYYY-MM-DD
          const getDefaultDate = () => {
            const future = new Date();
            future.setDate(future.getDate() + 30);
            const y = future.getFullYear();
            const m = String(future.getMonth() + 1).padStart(2, "0");
            const d = String(future.getDate()).padStart(2, "0");
            return `${y}-${m}-${d}`;
          };

          const months = {
            jan: "01",
            january: "01",
            feb: "02",
            february: "02",
            mar: "03",
            march: "03",
            apr: "04",
            april: "04",
            may: "05",
            jun: "06",
            june: "06",
            jul: "07",
            july: "07",
            aug: "08",
            august: "08",
            sep: "09",
            september: "09",
            oct: "10",
            october: "10",
            nov: "11",
            november: "11",
            dec: "12",
            december: "12",
          };

          if (!dateStr) return getDefaultDate();

          const parts = dateStr.toLowerCase().trim().split(/\s+/);

          if (parts.length < 3) return getDefaultDate();

          const day = parts[0].replace(/\D/g, "");
          const month = parts[1];
          const year = parts[2];

          const mm = months[month];

          if (!mm) return getDefaultDate();

          const dd = day.padStart(2, "0");

          if (!/^\d{4}$/.test(year)) return getDefaultDate();

          return `${year}-${mm}-${dd}`;
        }

        return {
          description: document.querySelector("#PROGRESS_AND_BENEFITS")
            ?.innerHTML,
          requirements: document.querySelector("#REQUIREMENTS")?.innerHTML,
          active_to:
            convertEnglishDate(
              document
                .querySelectorAll("span.t1638tgf")[1]
                ?.textContent.substring(4),
            ) || null,
        };
      });

      await insertOffer(connection, job, details);
      await jobPage.close();
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  //NOFLUFFJOBS.COM

  await page.goto(
    "https://nofluffjobs.com/pl/artificial-intelligence?criteria=category%3Dsys-administrator,business-analyst,architecture,backend,data,ux,devops,erp,embedded,frontend,fullstack,game-dev,mobile,project-manager,security,support,testing,other",
    { waitUntil: "networkidle2" },
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
          el.querySelectorAll("nfj-posting-item-tiles span"),
        ).map((t) => t.textContent),
        contractType: ["B2B", "UoP"],
        salary:
          el.querySelector("nfj-posting-item-salary")?.textContent?.trim() ||
          "",
        img: el.querySelector("img")?.src || "",
        link: el.href,
        type: "nofluffjobs.com",
      }),
    );
  });

  for (let job of jobs) {
    console.log(`→ Szczegóły ${job.title}`);
    const jobPage = await browser.newPage();
    await jobPage.goto(job.link, { waitUntil: "networkidle2" });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const details = await jobPage.evaluate(() => {
      function extractDate(text) {
        const getDefaultDate = () => {
          const future = new Date();
          future.setDate(future.getDate() + 30);
          const y = future.getFullYear();
          const m = String(future.getMonth() + 1).padStart(2, "0");
          const d = String(future.getDate()).padStart(2, "0");
          return `${y}-${m}-${d}`;
        };

        if (!text) return getDefaultDate();

        const regex = /\b(\d{2})\.(\d{2})\.(\d{4})\b/;
        const match = text.match(regex);

        if (match) {
          const day = match[1];
          const month = match[2];
          const year = match[3];

          return `${year}-${month}-${day}`;
        }

        return getDefaultDate();
      }

      return {
        description: document.querySelector("#posting-description")?.innerHTML,
        requirements: document.querySelector("#posting-specs")?.innerHTML,
        active_to:
          extractDate(
            document.querySelector("common-posting-time-info")?.textContent,
          ) || null,
      };
    });

    await insertOffer(connection, job, details);
    await jobPage.close();
    await new Promise((r) => setTimeout(r, 1000));
  }

  await browser.close();

  return { info: "Wszystkie oferty zostały zapisane!" };
}
