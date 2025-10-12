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

    try {
      await page.waitForSelector(".JobListItem_item__fYh8y");
    } catch (err) {
      console.log(err);
      break;
    }

    const jobs = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".JobListItem_item__fYh8y")
      ).map((el) => ({
        title:
          el
            .querySelector(".JobListItem_item__title__278xz h3")
            ?.textContent?.trim() || "",
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
        contractType: [
          el
            .querySelectorAll(
              ".JobListItem_item__details__sg4tk .items-start "
            )[0]
            ?.textContent?.trim(),
        ] || ["Umowa o pracę", "Kontrakt B2B", "Inna forma zatrudnienia"],
        experience: [
          el
            .querySelectorAll(
              ".JobListItem_item__details__sg4tk .items-start "
            )[1]
            ?.textContent?.trim(),
        ] || ["Intern", "Junior", "Mid/Regular", "Senior"],
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

    try {
      await page.waitForSelector("div.o1onjy6t");
    } catch (err) {
      console.log(err);
      break;
    }

    const jobs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a.a4pzt2q"))
        .map((el) => ({
          title: el.querySelector("#offer-title")?.textContent?.trim() || "",
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
          experience: ["Intern", "Junior", "Mid/Regular", "Senior"],
          contractType: [
            "Umowa o pracę",
            "Kontrakt B2B",
            "Inna forma zatrudnienia",
          ],
          technologies: [...el.querySelectorAll("div.c13r9id2 div")].map(
            (tag) => tag.textContent
          ),
          salary: "not available",
          img: el.querySelector("img")?.src,
          link: el?.href,
          type: "theprotocol.it",
        }))
        .filter((el) => el.title != "");
    });
    allJobs.push(...jobs);
  }

  await page.goto(
    "https://nofluffjobs.com/pl/artificial-intelligence?criteria=category%3Dsys-administrator,business-analyst,architecture,backend,data,ux,devops,erp,embedded,frontend,fullstack,game-dev,mobile,project-manager,security,support,testing,other",
    {
      waitUntil: "networkidle2",
    }
  );

  let loadMore = 1;

  while (loadMore <= 80) {
    try {
      await page.evaluate(() => {
        const btn = document.querySelectorAll("div.tw-flex button.tw-btn")[6];
        btn.click();
      });
      loadMore++;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (err) {
      console.log(err);
      loadMore = 101;
    }
  }

  const jobsIT = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll("div.list-container a.posting-list-item")
    ).map((el) => ({
      title: el.querySelector("h3")?.textContent?.trim().includes("NOWA")
        ? String(el.querySelector("h3")?.textContent?.trim())
            .substring(
              0,
              el.querySelector("h3").textContent.indexOf("NOWA") - 1
            )
            .trim()
        : el.querySelector("h3")?.textContent?.trim(),
      companyName: el.querySelector("h4.company-name")?.textContent?.trim(),
      workingMode: [
        el.querySelector("footer div.tw-text-gray")?.textContent?.trim() ||
          "not available",
      ],
      experience: ["Junior", "Mid/Regular", "Senior"],
      technologies: [...el.querySelectorAll("nfj-posting-item-tiles span")].map(
        (tag) => tag.textContent
      ),
      contractType: [
        "Umowa o pracę",
        "Kontrakt B2B",
        "Inna forma zatrudnienia",
      ],
      salary: el.querySelector("nfj-posting-item-salary").textContent,

      img: el.querySelector("img")?.src,
      link: el.href,
      type: "nofluffjobs.com",
    }));
  });

  allJobs.push(...jobsIT);

  await browser.close();
  return allJobs;
}

export async function getJobOffertDetail(link, type) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
    userDataDir: "./puppeteer_profile",
    args: ["--window-size=1920,1080"],
  });
  const page = await browser.newPage();

  await page.goto(link, {
    waitUntil: "networkidle2",
  });

  if (type === "bulldogjob.pl") {
    try {
      await page.waitForSelector(".JobListItem_item__fYh8y");
    } catch (err) {
      console.log(err);
      return "Błąd";
    }

    const details = await page.evaluate(() => {
      return {
        willDo: document.querySelectorAll("#accordionGroup")[0].innerHTML,
        offer: document.querySelectorAll("#accordionGroup")[1].innerHTML,
        expect: document.querySelectorAll("#accordionGroup")[2].innerHTML,
      };
    });

    browser.close();
    return details;
  } else if (type === "theprotocol.it") {
    try {
      await page.waitForSelector(".JobListItem_item__fYh8y");
    } catch (err) {
      console.log(err);
      return "Błąd";
    }

    const details = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".JobListItem_item__fYh8y")
      ).map((el) => ({}));
    });

    browser.close();
    return details;
  } else {
    try {
      await page.waitForSelector(".JobListItem_item__fYh8y");
    } catch (err) {
      console.log(err);
      return "Błąd";
    }

    const details = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".JobListItem_item__fYh8y")
      ).map((el) => ({}));
    });

    browser.close();
    return details;
  }
}
