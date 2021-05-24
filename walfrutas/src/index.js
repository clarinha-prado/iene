const puppeteer = require('puppeteer');
const fs = require('fs');

const data = require('../data/credential.json');
const posts = require('../data/posts.json');
const lastPost = require('../data/lastPost.json');
const cookies = require('../data/cookies.json');

var waitTime = Math.random() * 5000 + 2000;

(async () => {
    console.log('Início da navegação');

    // abre o browser
    let browser = await puppeteer.launch({ headless: false });
    const context = browser.defaultBrowserContext();

    // evita pergunta sobre permissoes
    context.overridePermissions("https://www.facebook.com", []);

    // cria nova pagina
    let page = await browser.newPage();

    // configura timeout default e tam da tela
    page.setDefaultNavigationTimeout(100000);
    await page.setViewport({ width: 1200, height: 800 });

    // se este app nao tiver cookies
    if (!Object.keys(cookies).length) {

        // acessa pagina de login 
        await page.goto("https://www.facebook.com/login", { waitUntil: "networkidle2" });

        // digita dados de login
        await page.type("#email", data.username, { delay: 30 })
        await page.type("#pass", data.password, { delay: 30 })
        await page.click("#loginbutton");
        await page.waitForTimeout(waitTime);
        //await page.waitForNavigation({ waitUntil: "networkidle0" });

        try {
            // verifica se a pagina inicial foi retornada
            await page.waitForSelector('[aria-label="Conta"]');
            console.log('Login com email e senha')
        } catch (err) {
            console.log("Falha no login");
            process.exit(1);
        }

        let currentCookies = await page.cookies();
        fs.writeFileSync('../data/cookies.json', JSON.stringify(currentCookies));
    } else {
        //User Already Logged In
        console.log("Login com cookie")
        await page.setCookie(...cookies);
        await page.goto("https://www.facebook.com/", { waitUntil: "networkidle2" });
    }

    await page.waitForTimeout(waitTime);

    // clica na imagem do link Grupos
    await page.click('[href="https://www.facebook.com/groups/?ref=bookmarks"]')
        .then(
            async () => {
                console.log('Clicou em Grupos');
                await page.waitForTimeout(waitTime);
            }
        ).catch(
            () => {
                console.log('Não conseguiu clicar em grupos');
                process.exit(1);
            });
    // await page.mouse.click(104, 305);

    // clica em um grupo de brecho
    await page.mouse.move(104, 305);

    await page.mouse.wheel({ deltaY: 1000 });
    await page.waitForTimeout(waitTime);

    await page.mouse.wheel({ deltaY: 1000 });
    await page.waitForTimeout(waitTime);

    await page.click('[href="https://www.facebook.com/groups/brechoonlinecacapava/"]')
        .then(
            async () => {
                console.log('Clicou no grupo brechó');
                await page.waitForTimeout(waitTime);
            }
        ).catch(
            (err) => {
                console.log('Não conseguiu clicar no grupo brechó');
                console.log(err.message);
                process.exit(1);
            });
    await page.waitForTimeout(waitTime);
    // await page.goto("https://www.facebook.com/groups/925626047478339");
    // await page.goto("https://www.facebook.com/groups/925626047478339", { waitUntil: "networkidle2" });
    // await page.waitForSelector('[aria-label="Vender algo"]');

    // clica em "Discussao"
    await page.click('[href="/groups/brechoonlinecacapava/buy_sell_discussion/"]');
    console.log('Clicou em discussão');
    await page.waitForTimeout(waitTime);

    // clicar na caixa de texto
    await page.mouse.move(713, 1763);
    await page.mouse.wheel({ deltaY: 1000 });
    await page.waitForTimeout(waitTime);

    const [button2] = await page.$x("//span[contains(., 'No que voc')]");
    await button2.click()
        .then(async () => {
            console.log('Clicou na 1a. caixa de texto');
            await page.waitForTimeout(waitTime);
        }).catch((err) => {
            console.log('Não conseguiu clicar na caixa de texto');
            console.log(err.message);
            process.exit(1);
        });

    // texto do post
    //await page.mouse.click(558, 232);
    const [button] = await page.$x("//div[contains(., 'Escreva algo')]");
    button.click()
        .then(
            () => console.log("Clicou na 2a. caixa de texto")
        ).catch(
            (err) => {
                console.log("Não conseguiu clicar na caixa de texto");
                console.log(err.message);
                process.exit(1);
            }
        );

    // botão anexar img
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        await page.mouse.click(678, 480),
        console.log('Clicou no upload de imagem')
    ]);
    post = getNextPost();
    await fileChooser.accept([post.image])
        .then(() =>
            console.log("Leu arquivo de imagem")
        ).catch((err) => {
            console.log('Não conseguiu ler o arquivo de imagem');
            console.log(err.message);
            process.exit(1);
        });

    await page.keyboard.type(post.text.join('\n'), { delay: 25 });
    console.log('Digitou o texto');

    // clicar em publicar
    await page.mouse.click(558, 232);
    for (let i = 0; i < 9; i++) {
        await page.keyboard.press("Tab", { delay: 100 });
        await page.waitForTimeout(200);
    }
    await page.keyboard.press("Enter", { delay: 100 });
    console.log('Publicou');

    // Close Browser
    await browser.close();
})();

function getNextPost() {
    if (lastPost.type === "fruit") {
        lastPost.type = "detox";
        index = 1;
        nextFile = parseInt(lastPost.lastFileIndex[1].index) + 1 === posts[index].files.length ? 0 : parseInt(lastPost.lastFileIndex[1].index) + 1;
    } else {
        lastPost.type = "fruit";
        index = 0;
        nextFile = parseInt(lastPost.lastFileIndex[0].index) + 1 === posts[index].files.length ? 0 : parseInt(lastPost.lastFileIndex[0].index) + 1;
    }

    posts[index].image = posts[index].directory + posts[index].files[nextFile].fileName + ".jpg";

    lastPost.lastFileIndex[index].index = nextFile;
    fs.writeFileSync('../data/lastPost.json', JSON.stringify(lastPost, null, 4));

    return posts[index];
}