import auditSite from "./modules/audit/SiteAudit";
import {stopChrome, startChrome} from "./modules/audit/SiteAudit";
import {generateCsvReport} from "./modules/report/ReportGenerator";
import {getTransformer, OutputResult} from "./modules/transformer/DataTransformer";
import {generateListOfWebsiteUrls} from "./modules/crawler/crawler";
import {getKeywords, getLocations} from "./modules/config/config";

const generateAuditsForLocationAndKeyword = async (location: string, keyword: string, ): Promise<OutputResult[]> => {
  const auditedWebsites: OutputResult[] = [];
  const websites = await generateListOfWebsiteUrls(location, keyword);

  const transformer = getTransformer();
  for (const website of websites) {
    console.log('auditing site', website.url)
    auditedWebsites.push(transformer(website, await auditSite(website.url)))
  }

  return  auditedWebsites;
}

(async () => {
  await startChrome();
  const keywords = getKeywords();
  const locations = getLocations();

  let auditedWebsites: OutputResult[] = [];

  for (const location of locations) {
    for (const keyword of keywords) {
      auditedWebsites = auditedWebsites.concat(await generateAuditsForLocationAndKeyword(location, keyword));
    }
  }

  await stopChrome()
  await generateCsvReport(auditedWebsites, 'result')
})();


