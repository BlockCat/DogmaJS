const { FuseBox, JSONPlugin} = require('fuse-box');
const fuse = FuseBox.init({
    homeDir: "src",
    output: "dist/$name.js",
    plugins: [
        JSONPlugin(),
    ]
});



fuse.bundle('vendor').instructions('~ *.ts');
fuse.bundle("app").sourceMaps().instructions("!>[*.ts]");
fuse.run();