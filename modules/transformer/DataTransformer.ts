import {Website} from "../crawler/crawler";

export interface OutputResult extends Website {
  performance: number;
  pwa: number;
  'best-practices': number;
  accessibility: number;
  seo: number;
}

let auditKeys: string[] = ['performance', 'seo',  'best-practices', 'accessibility'];

export const getTransformer = () => {
  return (website: Website, results: any) => {
    const mappedResult: Partial<OutputResult> = { ...website }
    auditKeys.forEach((key: string) => mappedResult[key] = Math.round(results[key].score * 100))
    return <OutputResult>mappedResult;
  }
}
