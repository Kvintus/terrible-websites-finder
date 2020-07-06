import lighthouse from 'lighthouse'
import {launch, LaunchedChrome} from 'chrome-launcher';

let chrome: LaunchedChrome;
export const startChrome = async () => {
  chrome = await launch({chromeFlags: ['--headless']})
};

export const stopChrome = async () => {await chrome.kill()};

export default async (url: string) => {
  const options = {output: 'html', port: chrome.port};
  const runnerResult = await lighthouse(url, options);

  return runnerResult.lhr.categories;
};
