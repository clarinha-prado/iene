const cookies = require('../data/cookies.json');

async function loginf(page) {
    if (!Object.keys(cookies).length) {

        // acessa pagina de login 
        await page.goto("https://www.facebook.com/login", { waitUntil: "networkidle2" });

        // digita dados de login
        await page.type("#email", data.username, { delay: 30 })
        await page.type("#pass", data.password, { delay: 30 })
        await page.click("#loginbutton");
        //await page.waitForNavigation({ waitUntil: "networkidle0" });

        // espera entre 10 e 15 segundos
        waitTime = Math.random() * 5000 + 10000;
        console.log(waitTime);
        await page.waitForTimeout(waitTime);

        try {
            // verifica se a pagina inicial foi retornada
            await page.waitForSelector('[aria-label="Conta"]');
            console.log('\nLogin feito com sucesso!')
        } catch (err) {
            console.log("Erro no login com senha: " + err.message);
            process.exit(1);
        }

        let currentCookies = await page.cookies();
        fs.writeFileSync('./cookies.json', JSON.stringify(currentCookies));
    } else {
        //User Already Logged In
        console.log("Usuário já está logado, usa cookies para login.")
        await page.setCookie(...cookies);
        await page.goto("https://www.facebook.com/", { waitUntil: "networkidle2" });
    }
    console.log("Login feito com sucesso!\n");
}

module.exports.loginf = loginf;