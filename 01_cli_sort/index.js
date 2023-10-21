const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

app = () => {
    rl.question('Введіть слова або цифри використовуючи між ними пробіл ', (input) => {
        let data = input.split(' ');
    
        rl.question(`Як відсортувати?

        1. За алфавітом 
        2. Числа від меньшого до більшого 
        3. Числа від більшого к меньшому 
        4. По довжині слов 
        5. По унікальним словам 
        6. По унікальним значенням 
        
        Оберіть  дію (1-6) і натисніть Enter: `, (variant) => {
            switch (variant) {
                case '1':
                    data.sort();
                    break;
                case '2':
                    data.sort((a, b) => a - b);
                    break;
                case '3':
                    data.sort((a, b) => b - a);
                    break;
                case '4':
                    data.sort((a, b) => a.length - b.length );
                    break;
                case '5':
                    data = [...new Set(data)].filter(item => isNaN(item));
                    break;
                case '6':
                    data = [...new Set(data)];
                    break;
                default:
                    console.log('Немає такого варіанта!');
                    break;
            };

            console.log(data.join(' '));
      
            rl.question('Enter щоб продовжити або введіть "exit" для виходу ', (prompt) => {
                if (prompt === 'exit') {
                    rl.close();
                } else {
                    app();
                }
            });
        });
    });
}

app();

