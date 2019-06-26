// This file is part of Indico.
// Copyright (C) 2002 - 2019 CERN
//
// Indico is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see the
// LICENSE file for more details.

'use strict';

const fs = require('fs');
const path = require('path');
const browserslist = require('browserslist');
const semver = require('semver');
const diff = require('diff');
const chalk = require('chalk');

const README_PATH = path.join(__dirname, '..', '..', 'README.md');

const productionQuery = browserslist
  .loadConfig({
    env: 'production',
    path: path.resolve('.'),
  })
  .join(', ');
const productionURL = `https://browserl.ist/?q=${encodeURIComponent(productionQuery)}`;

const template = browsers => `
| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /><br>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /><br>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /><br>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" /><br>Edge |
|:---------:|:---------:|:---------:|:---------:|
| ${browsers.firefox}+ | ${browsers.chrome}+ | ${browsers.safari}+ | ${browsers.edge}+ |

However, if you have an issue with a browser [on this list](${productionURL}), please feel free to open a bug report.`;

const browsers = browserslist(null, {
  env: 'supported',
}).reduce((accum, text) => {
  // get only the lowest version of a browser
  const parts = text.split(' ');
  const browser = parts[0];
  let version = parts[1];

  // version ranges - take the lowest
  if (version.includes('-')) {
    version = version.split('-')[0];
  }
  if (accum[browser]) {
    if (semver.gt(semver.coerce(version), semver.coerce(accum[browser]))) {
      // found a higher version, ignore it
      return accum;
    }
  }
  accum[browser] = version;
  return accum;
}, {});

// find and replace the text block within the README.md file
const fileData = fs.readFileSync(README_PATH).toString();
const newContent = template(browsers);

const m = fileData.match(
  /^([\s\S]*^<!-- BROWSERS .* -->)($[\s\S]+)([\n\r]+^<!-- ENDBROWSERS -->$[\s\S]*)$/m
);

const d = diff.diffWords(m[2], newContent);

d.forEach(part => {
  // green for additions, red for deletions
  // grey for common parts
  const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
  process.stderr.write(chalk[color](part.value));
});
console.log();

if (m[2] !== newContent) {
  fs.writeFileSync(README_PATH, m[1] + newContent + m[3]);
  console.log(chalk.green('README.md updated'));
} else {
  console.log(chalk.yellow('README.md not changed'));
}
