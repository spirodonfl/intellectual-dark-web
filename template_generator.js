let fs = require('fs');

let html = {};
html.skeleton = fs.readFileSync('templates/skeleton.html', { encoding: 'utf8' });
fs.readdir('templates/pages', (err, pages) => {
    if (err) {
        console.log(err);
        process.exit();
    } else {
        for (let p in pages) {
            let skeleton = fs.readFileSync('templates/skeleton.html', { encoding: 'utf8' });
            let page = fs.readFileSync('templates/pages/' + pages[p], { encoding: 'utf8' });

            let findHeadBottom = page.match(/<% head-bottom %>[\s\S]*?(.*?)[\s\S]*?<% head-bottom %>/gmi);
            let headBottom = '';
            if (findHeadBottom && findHeadBottom.length > 0) {
                headBottom = findHeadBottom[0];
                headBottom = headBottom.replace(/<% head-bottom %>/g, '');
            }
            skeleton = skeleton.replace('<% head-bottom %>', headBottom);

            let findBody = page.match(/<% body %>[\s\S]*?(.*?)[\s\S]*?<% body %>/gmi);
            let body = '';
            if (findBody && findBody.length > 0) {
                body = findBody[0];
                body = body.replace(/<% body %>/g, '');
            } else {
                console.log('No body?', page[p]);
                process.exit();
            }
            skeleton = skeleton.replace('<% body %>', body);

            let head = fs.readFileSync('templates/head.html', { encoding: 'utf8' });
            skeleton = skeleton.replace('<% head %>', head);

            let bodyTop = fs.readFileSync('templates/body-top.html', { encoding: 'utf8' });
            skeleton = skeleton.replace('<% body-top %>', bodyTop);

            let bodyBottom = fs.readFileSync('templates/body-bottom.html', { encoding: 'utf8' });
            skeleton = skeleton.replace('<% body-bottom %>', bodyBottom);

            let bodyClasses = 'dark';
            skeleton = skeleton.replace('<% body-classes %>', bodyClasses);

            fs.writeFileSync(pages[p], skeleton, { encoding: 'utf8' });
            console.log(pages[p] + ' generated...');
        }
    }
});