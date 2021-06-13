const puppeteer = require('puppeteer');
const fs = require('fs');
//const dataDirectory = "../data";   // para debug
const dataDirectory = "../data";

const data = require(dataDirectory + '/credential.json');
const posts = require(dataDirectory + '/posts.json');
const lastPost = require(dataDirectory + '/lastPost.json');
const cookies = require(dataDirectory + '/cookies.json');

// create a custom timestamp format for log statements
const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath: './log/walfrutas.log',
        timestampFormat: 'DD-MM-YYYY HH:mm:ss'
    },
    log = SimpleNodeLogger.createSimpleLogger(opts);

var waitTime = Math.random() * 5000 + 2000;

(async () => {
    log.info('');
    log.info('Início da navegação');

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
            log.info('Login com email e senha')
        } catch (err) {
            log.error("Falha no login");
            process.exit(1);
        }

        let currentCookies = await page.cookies();
        fs.writeFileSync('../data/cookies.json', JSON.stringify(currentCookies));
    } else {
        //User Already Logged In
        log.info("Login com cookie")
        await page.setCookie(...cookies);
        await page.goto("https://www.facebook.com/", { waitUntil: "networkidle2" });
    }

    await page.waitForTimeout(waitTime);

    // acessa pagina do brechó
    await page.goto("https://www.facebook.com/groups/brechoonlinecacapava/", { waitUntil: "networkidle2" })
        .then(() => log.info('Acessou url do brechó')
        ).catch((err) => {
            log.error('Não conseguiu acessar a url do brechó');
            log.error(err.message);
        });

    // clica em "Discussao"
    await page.click('[href="/groups/brechoonlinecacapava/buy_sell_discussion/"]')
        .then(() => log.info('Clicou em discussão')
        ).catch((err) => {
            log.error('Não conseguiu clicar em discussão');
            log.error(err.message);
        });
    await page.waitForTimeout(waitTime);

    // clicar na caixa de texto
    await page.mouse.move(713, 1763);
    await page.mouse.wheel({ deltaY: 1000 });
    await page.waitForTimeout(waitTime);

    const [button2] = await page.$x("//span[contains(., 'No que voc')]");
    await button2.click()
        .then(async () => {
            log.info('Clicou na 1a. caixa de texto');
            await page.waitForTimeout(waitTime);
        }).catch((err) => {
            log.error('Não conseguiu clicar na caixa de texto');
            log.error(err.message);
            process.exit(1);
        });

    // texto do post
    //await page.mouse.click(558, 232);
    const [button] = await page.$x("//div[contains(., 'Escreva algo')]");
    button.click()
        .then(
            () => log.info("Clicou na 2a. caixa de texto")
        ).catch(
            (err) => {
                log.error("Não conseguiu clicar na caixa de texto");
                log.error(err.message);
                process.exit(1);
            }
        );

    // botão anexar img
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        await page.mouse.click(637, 480)
    ]);

    post = getNextPost();
    await fileChooser.accept([post.image])
        .then(() =>
            log.info("Leu arquivo de imagem")
        ).catch((err) => {
            log.error('Não conseguiu ler o arquivo de imagem');
            log.error(err.message);
            process.exit(1);
        });

    await page.keyboard.type(post.text.join('\n'), { delay: 20 });
    log.info('Digitou o texto');

    // clicar em publicar
    await page.mouse.click(558, 232);
    for (let i = 0; i < 9; i++) {
        await page.keyboard.press("Tab", { delay: 100 });
        await page.waitForTimeout(200);
    }
    await page.keyboard.press("Enter", { delay: 100 });
    log.info('Publicou');

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

    try {
        fs.writeFileSync(dataDirectory + '/lastPost.json', JSON.stringify(lastPost, null, 4));
    } catch (error) {
        log.error(error.message);
    }

    return posts[index];
}