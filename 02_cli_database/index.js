import inquirer from 'inquirer';
import fs from 'fs';

const app = () => {
    let userInfo = {};
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'username',
                message: "Enter the user's name. To cancel press ENTER",
            }
        ])
        .then((answers) => {
            const username = '';
            if (answers.username !== username) {
                userInfo.name = answers.username;
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'gender',
                            message: 'Choose your gender',
                            choices: ['Male', 'Female']
                        },
                        {
                            type: 'input',
                            name: 'age',
                            message: "Enter your age"
                        },
                    ])
                    .then((answers) => {
                        userInfo.gender = answers.gender;
                        userInfo.age = answers.age;
                        const data = JSON.stringify(userInfo);
                        fs.appendFile('database.txt', JSON.stringify(userInfo), (error) => {
                            if (error) {
                                console.log('Failed to add data ', error);
                            } else {
                                console.log('User data added. Continue...');
                                app();
                            }
                        });
                    })
            } else {
                const findUser = () => {
                    inquirer
                        .prompt([
                            {
                                type: 'confirm',
                                name: 'search',
                                message: 'Want to find a user?'
                            }
                        ])
                        .then((searchAnswer) => {
                            if (searchAnswer.search) {
                                searchUser();
                            } else {
                                process.exit();
                            }
                        });
                };
                findUser();
            }
        });

    const searchUser = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'username',
                message: "Enter the name"
            }
        ])
        .then((answer) => {
            const data = fs.readFileSync('database.txt')
                .toString()
                .split(/(?={")/)
                .map(el => JSON.parse(el));
                console.log(data);
                const user = data.find((user) => user.name.toLowerCase() === answer.username.toLowerCase());
            if (user) {
                console.log(`${user.name} was found`)
                console.log(`${user.name} ${user.age} ${user.gender}`)
            } else {
                console.log('User not found.');
            }
        })
    }
}
app();
