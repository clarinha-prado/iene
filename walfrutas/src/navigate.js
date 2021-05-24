

async function navigatef(page) {

    // espera entre 5 e 6 segundos
    waitTime = Math.random() * 5000 + 1000;
    await page.waitForTimeout(waitTime);

    // clica na imagem do link Grupos
    await page.click('[href="https://www.facebook.com/groups/?ref=bookmarks"]');
    // await page.mouse.click(104, 305);
    console.log('\nnavegou até a página Grupos');

    // espera entre 5 a 7 segundos
    waitTime = Math.random() * 5000 + 1000;
    await page.waitForTimeout(waitTime);

    // clica em um grupo de brecho
    await page.mouse.move(104, 305);
    await page.mouse.wheel({ deltaY: 1000 });

    // espera entre 5 a 7 segundos
    waitTime = Math.random() * 5000 + 1000;
    await page.waitForTimeout(waitTime);
    await page.mouse.wheel({ deltaY: 1000 });

    // espera entre 5 a 7 segundos
    waitTime = Math.random() * 5000 + 1000;
    await page.waitForTimeout(waitTime);
    await page.click('[href="https://www.facebook.com/groups/brechoonlinecacapava/"]');
    // await page.goto("https://www.facebook.com/groups/925626047478339");
    // await page.goto("https://www.facebook.com/groups/925626047478339", { waitUntil: "networkidle2" });
    // await page.waitForSelector('[aria-label="Vender algo"]');

    // espera entre 5 a 7 segundos
    waitTime = Math.random() * 5000 + 1000;
    await page.waitForTimeout(waitTime);

    // clica em "Discussao"
    await page.click('[href="/groups/brechoonlinecacapava/buy_sell_discussion/"]');

    // espera entre 5 e 7 segundos
    waitTime = Math.random() * 5000 + 1000;
    await page.waitForTimeout(waitTime);

    // clicar na caixa de texto
    await page.mouse.move(713, 1763);
    await page.mouse.wheel({ deltaY: 1000 });

    // espera entre 5 a 7 segundos
    waitTime = Math.random() * 5000 + 1000;
    await page.waitForTimeout(waitTime);

    const [button2] = await page.$x("//span[contains(., 'No que voc')]");
    await button2.click();

    // espera entre 5 e 7 segundos
    waitTime = Math.random() * 5000 + 1000;
    await page.waitForTimeout(waitTime);
}

module.exports.navigatef = navigatef;

