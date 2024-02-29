import fs from "fs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import HelloWorld from "./lib/hello-world.js";

const html = ReactDOMServer.renderToString(React.createElement(HelloWorld));

const document = `<!DOCTYPE html>
<html>
<head>
    <title>Hello World</title>
</head>
<body>
    ${html}
</body>
</html>`;

const buildDir = "./build";
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

fs.writeFileSync(`${buildDir}/index.html`, document);

console.log('Build complete. Check the "build" directory for the output.');
