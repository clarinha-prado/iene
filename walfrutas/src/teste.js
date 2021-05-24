const fs = require('fs');


const posts = require('../data/posts.json');
//const lastPost = require('../data/lastPost.json');

function getNextPost() {
    lastPost = JSON.parse(fs.readFileSync('../data/lastPost.json'));

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

function main() {

    for (let index = 0; index < 20; index++) {
        post = getNextPost();
        console.log(post.text.toString().substring(20, 60) + "\n" + post.image + '\n\n');
    }
}

main();