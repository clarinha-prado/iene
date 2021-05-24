const puppeteer = require('puppeteer');
const login = require('./login');
const navigate = require('./navigate');
const post = require('./post');

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

    login.loginf(page).then(
        () => navigate.navigatef(page)
    ).then(
        () => post.postf(page)
    ).then(
        () => console.log("Publicação feita com sucesso!")
    ).catch(
        () => {
            console.log("Erro!");
            process.exit(1);
        });

    // espera entre 5 e 6 segundos
    // waitTime = Math.random() * 5000 + 5000;
    // await page.waitForTimeout(waitTime);

    // try {
    //     navigate.navigatef(page).then(async () => {
    //         
    //         post.postf(page)
    //     }, () => console.log("deu pau!"));
    // } catch (error) {
    //     console.log("Erro na navegação: ".error.message);
    //     process.exit(1);
    // }

    // espera entre 5 e 7 segundos

})();


