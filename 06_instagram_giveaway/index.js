import { promises as fs } from 'fs'
import { join } from 'path'

const app = async () => {
    const start = new Date();
    const dir = './data'

    const readdirAndReadFiles = async (dir) => {
        const files = await fs.readdir(dir);
        const filesData = [];

        for (const file of files) {
            const data = await fs.readFile(join(dir, file), 'utf-8');
            const dataSet = new Set(data.split('\n'));
            filesData.push(dataSet);
        }

        return filesData;
    }

    const uniqueValues = async (dir) => {
        const filesData = await readdirAndReadFiles(dir)
        const uniqueUsernames = new Set()
        filesData.forEach(set => {
            set.forEach(username => uniqueUsernames.add(username))
        })

        console.log('how many unique usernames: ' + uniqueUsernames.size)
    }

    const existInAllFiles = async (dir) => {
        const filesData = await readdirAndReadFiles(dir);

        const hasInAll = new Map([...filesData[0]].map(username => [username, 1]));

        for (let i = 1; i < filesData.length; i++) {
            for (const username of filesData[i]) {
                if (hasInAll.has(username)) {
                    hasInAll.set(username, hasInAll.get(username) + 1);
                }
            }
        }

        const hasInAllArray = [...hasInAll.entries()];
        const hasInAllCounter = hasInAllArray.filter(([username, count]) => count === filesData.length);

        console.log('how many usernames occur in all 20 files: ' + hasInAllCounter.length);
    }

    const existInAtLeastTen = async (dir) => {
        const filesData = await readdirAndReadFiles(dir);
        const requiredCount = 10;

        const usernameCount = new Map();

        for (let i = 0; i < filesData.length; i++) {
            for (const username of filesData[i]) {
                if (!usernameCount.has(username)) {
                    usernameCount.set(username, 1);
                } else {
                    usernameCount.set(username, usernameCount.get(username) + 1);
                }
            }
        }

        const usernameRequiredCount = [...usernameCount.entries()].filter(([username, count]) => count >= requiredCount);

        console.log('how many usernames occur in at least 10 files: ' + usernameRequiredCount.length);
    }
    await uniqueValues(dir);
    await existInAllFiles(dir);
    await existInAtLeastTen(dir);
    
    const end = new Date();
    const executionTime = (end - start) / 1000;
    console.log('Execution time: ' + executionTime + 'sec')
}

app()