import fs from 'fs/promises';

const vacationList = async () => {
    const dataFromJson = await fs.readFile('data.json', 'utf8');
    const vacationData = JSON.parse(dataFromJson);
    return vacationData;
}

const fixVacationList = async () => {
    const vacationData = await vacationList();

    const userVacations = {};

    vacationData.forEach(item => {
        const userId = item.user._id;
        const userName = item.user.name;

        const vacation = {
            startDate: item.startDate,
            endDate: item.endDate
        };

        if (userVacations[userId]) {
            userVacations[userId].vacations.push(vacation);
        } else {
            userVacations[userId] = {
                userId: userId,
                userName: userName,
                vacations: [vacation]
            };
        }
    });

    const finalList = JSON.stringify(Object.values(userVacations), null, 2);
    fs.writeFile('fixed.json', finalList)
}

fixVacationList();
