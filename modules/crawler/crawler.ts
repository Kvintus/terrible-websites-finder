import cheerio from 'cheerio'
import puppeteer from 'puppeteer'

export interface Website {
  url: string;
  keyword: string;
  location: string;
}

const getLinksFromGoogleSearchPage = (page: string) => {
  const $ = cheerio.load(page)
  const searchResults = $('#rso').children('.g');

  const links: string[] = []
  searchResults.each((_, searchResult) => {
    const link = $(searchResult).find(' div > div.r > a').attr('href');
    links.push(link)
  })

  return links;
}

const getHtmlOfPage = async (url: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const html = await page.evaluate(() => document.body.innerHTML);
  await browser.close();
  return html;
}

const generateGoogleSearchUrl = (keyword: string, pageNumber: number = 0) => {
  return `https://www.google.com/search?q=${keyword}&start=${pageNumber * 10}`
}

export const generateListOfWebsiteUrls =  async (keyword: string, location: string): Promise<Website[]> => {
  const numberOfPages = 1;
  let websites: Website[] = []

  for (let i = 0; i< numberOfPages; i++) {
    console.log(`Getting website links for a combination of ${keyword} and ${location} on page ${i+1} of google`)
    const url = generateGoogleSearchUrl(`${keyword} ${location}`, i);
    const page = await getHtmlOfPage(url)
    const links = getLinksFromGoogleSearchPage(page)
    websites = websites.concat(links.map(link => ({
      keyword,
      location,
      url: link
    })));
  }


  return websites;
}
