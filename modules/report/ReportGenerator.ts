import stringify from "csv-stringify";
import fs from 'fs';

export const generateCsvReport = (results: any, filename: string) => {
  return new Promise(((resolve, reject) => {
    stringify(results, {
      columns: Object.keys(results[0]),
      header: true
    }, (err, data) => {
      if (err || !data) return reject(err);
      fs.writeFile(`${filename}.csv`, data, (err) => {
        if (err) reject(err);
        console.log('Csv report successfully generated.');
        resolve()
      });
    })
  }))
}
