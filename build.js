import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const pagesDir = './lib';
const buildDir = './build';

// Ensure the build directory exists
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

fs.readdir(pagesDir, (err, files) => {
    if (err) {
        console.error('Could not list the directory.', err);
        process.exit(1);
    }

    files.forEach((file) => {
        if (path.extname(file) === '.js') {
            const pageName = path.basename(file, '.js');
            const componentPath = path.join(pagesDir, file);
            const modulePath = `file://${path.resolve(componentPath)}`;

            import(modulePath)
                .then((Component) => {
                    const html = ReactDOMServer.renderToString(
                        React.createElement(Component.default)
                    );
                    const document = `<!DOCTYPE html>
<html>
<head>
    <title>${pageName}</title>
</head>
<body>
    ${html}
</body>
</html>`;

                    // Determine the output path based on the page name
                    const outputPath =
                        pageName.toLowerCase() === 'index'
                            ? `${buildDir}/index.html` // Directly in build for the home page
                            : `${buildDir}/${pageName.toLowerCase()}/index.html`; // In a subdirectory for other pages

                    // Ensure the directory exists for non-index pages
                    if (pageName.toLowerCase() !== 'index') {
                        const dir = path.dirname(outputPath);
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir, { recursive: true });
                        }
                    }

                    // Write the document to the appropriate path
                    fs.writeFileSync(outputPath, document);
                    console.log(`${outputPath} built successfully.`);
                })
                .catch((err) => {
                    console.error(`Error rendering ${pageName}:`, err);
                });
        }
    });
});
