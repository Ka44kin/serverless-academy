import axios from 'axios';
import { promises as fs } from 'fs';

const endpoints = [
    'https://jsonbase.com/sls-team/json-793',
    'https://jsonbase.com/sls-team/json-955',
    'https://jsonbase.com/sls-team/json-231',
    'https://jsonbase.com/sls-team/json-931',
    'https://jsonbase.com/sls-team/json-93',
    'https://jsonbase.com/sls-team/json-342',
    'https://jsonbase.com/sls-team/json-770',
    'https://jsonbase.com/sls-team/json-491',
    'https://jsonbase.com/sls-team/json-281',
    'https://jsonbase.com/sls-team/json-718',
    'https://jsonbase.com/sls-team/json-310',
    'https://jsonbase.com/sls-team/json-806',
    'https://jsonbase.com/sls-team/json-469',
    'https://jsonbase.com/sls-team/json-258',
    'https://jsonbase.com/sls-team/json-516',
    'https://jsonbase.com/sls-team/json-79',
    'https://jsonbase.com/sls-team/json-706',
    'https://jsonbase.com/sls-team/json-521',
    'https://jsonbase.com/sls-team/json-350',
    'https://jsonbase.com/sls-team/json-64'
];

let trueCount = 0;
let falseCount = 0;

const query = async (endpoint) => {
    let retrites = 3;
    while (retrites > 0) {
        try {
            const response = await axios.get(endpoint)
            if (response.data.isDone !== undefined){
                console.log(`[Success] ${endpoint}`)
                trueCount ++;
                return ;
            };
        } catch {
            retrites -- ;
            if( retrites === 0){
                console.log(`[Fail] ${endpoint}`);
                falseCount ++;
                return ;
            };
        };
    };
};

const main = async () => {
    for (const endpoint of endpoints) {
        await query(endpoint);
    }

    console.log('True Count:', trueCount);
    console.log('False Count:', falseCount);

};

main();

const findIsDone = (obj) => {

    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            const result = findIsDone(obj[key]);
            if (result !== undefined) {
                return result;
            };
        } else if (key === 'isDone') {
            return obj[key];
        };
    };
};

const dir = './data'

async function checkIsDone(fileName) {

        const filePath = `${dir}/${fileName}`;
        const fileData = await fs.readFile(filePath, 'utf8');
        const isDoneValue = await findIsDone(JSON.parse(fileData));

        if (isDoneValue !== undefined) {
            console.log(`In "${fileName}" isDone is ${isDoneValue}`);
        } else {
            console.log(`In "${fileName}" isDone is not defined`);
        }
}

async function chekingJson() {
        const jsonList = await fs.readdir(dir);

        for (const fileName of jsonList) {
            await checkIsDone(fileName);
        }
}
chekingJson();

