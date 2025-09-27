import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export async function getJobOfferts() {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
    args: ["--window-size=1920,1080"],
  });
  const page = await browser.newPage();

  const allJobs = [];

  for (let i = 1; i <= 120; i++) {
    console.log(`Scraping bulldogjob.pl ${i}...`);
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
        type: "bulldogjob.pl",
      }));
    });
    allJobs.push(...jobs);
  }

  for (let i = 1; i <= 80; i++) {
    console.log(`Scraping theprotocol.it ${i}...`);
    await page.goto(`https://theprotocol.it/filtry/;c?pageNumber=${i}`, {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector("div.o1onjy6t");

    const jobs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a.a4pzt2q")).map((el) => ({
        title: el.querySelector("#offer-title")?.textContent?.trim(),
        companyName: el
          .querySelectorAll("div.l1c07yeh")[0]
          ?.textContent?.trim(),
        workingMode: [
          el.querySelectorAll("div.l1c07yeh")[2]?.textContent?.trim() ||
            "not available",
          [...el.querySelectorAll("div.p7zsgaa div.m13o6ws7 div")].map(
            (tag) => tag.textContent
          ),
        ],
        experience: "not available",
        technologies: [...el.querySelectorAll("div.c13r9id2 div")].map(
          (tag) => tag.textContent
        ),
        salary: "not available",
        img: el.querySelector("img")?.src,
        link: el?.href,
        type: "theprotocol.it",
      }));
    });
    allJobs.push(...jobs);
  }

  await browser.close();
  return allJobs;
}
