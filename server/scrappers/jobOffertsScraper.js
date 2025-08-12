import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export async function getJobOfferts() {
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
