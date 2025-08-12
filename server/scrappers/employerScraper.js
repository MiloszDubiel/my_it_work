import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export async function getEmployers() {
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
