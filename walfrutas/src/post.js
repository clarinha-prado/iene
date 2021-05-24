const posts = require('../data/posts.json');
const lastPost = require('../data/lastPost.json');

async function postf(page) {
    // botão anexar img
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        await page.mouse.click(678, 480),
    ]);
    post = getNextPost();
    await fileChooser.accept([post.image]);
    await page.mouse.click(678, 480);

    // espera entre 5 e 10 segundos
    waitTime = Math.random() * 5000 + 5000;
    await page.waitForTimeout(waitTime);

    // texto do post
    await page.mouse.click(558, 232);
    await page.keyboard.type(post.text.join('\n'), { delay: 25 });

    // clicar em publicar
    await page.mouse.click(558, 232);
    for (let i = 0; i < 9; i++) {
        await page.keyboard.press("Tab", { delay: 100 });
        await page.waitForTimeout(200);
    }
    await page.keyboard.press("Enter", { delay: 100 }).then(updateLastPost());
}

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

module.exports.postf = postf;
module.exports.getNextPost = getNextPost;