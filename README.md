# tutor-js [![Build Status](https://travis-ci.org/openstax/tutor-js.svg?branch=master)](https://travis-ci.org/openstax/tutor-js) [![devDependency Status](https://david-dm.org/openstax/tutor-js/dev-status.svg)](https://david-dm.org/openstax/tutor-js#info=devDependencies)

The JavaScript client for openstax Tutor.

## Install

1. install [nodejs](http://nodejs.org) from the website or using <http://brew.sh> if you’re already using it
1. `npm install -g gulp bower` to install [gulp](http://gulpjs.com) and [bower](http://bower.io) globally
1. `git clone https://github.com/openstax/tutor-js` to the directory of your choice
  - If you don’t have `git` installed you can install homebrew and then `brew install git`
1. `cd tutor-js`
1. `npm install`
1. `bower install`
1. `gulp serve`
1. Point your browser to <http://localhost:8000> to use the mock data in `/api`


## Development

- `gulp test` runs unit tests
- `gulp prod` builds minified files for production
- `gulp serve` builds files and starts up a static webserver
- `gulp dev` watches and rebuilds CSS and JS files and starts webserver
- `gulp tdd` does what `dev` does plus reruns unit tests

Use `PORT=8000 gulp serve` to change the default webserver port.

After local updates are made:

1. stop `gulp serve`
1. `npm install`
1. if `bower.json` changed, `bower install`
1. restart `gulp serve`

### Pre-production

Before starting up vagrant, you can debug using a more production-like config by:

1. `gulp prod`
2. unzip `/dist/archive.tar.gz` into an `assets/` directory
3. serve the `assets/` directory via NGINX or something with CORS enabled
4. update the paths in `tutor-server/conf/secrets.yml` to point to `http://localhost:[NGINX-PORT]/assets/tutor.min-####.css` and `tutor.min-####.js` respectively
5. in `tutor-server` run `rails s`
6. go to <http://localhost:3001>
