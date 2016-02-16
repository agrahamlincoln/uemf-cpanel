# UEMF Control Panel

This project serves as the control panel for the [uemf.org](https://uemf.org) website. The control panel provides specific functionality as follows:
* Get src links for images and files (for linking and referencing)
* Upload/Rename/Delete files stored in the User Content directory
* Edit existing pages with a wysiwyg editor
* Manage your user account for the control panel and API

### Installing
> clone the project and install dependency packages with npm

```bash
# clone the repo
# --depth 1 can be omitted - it removes most of the git commit history
git clone --depth 1 <git url>

# change directory into the repo
cd uemf-cpanel

# install dependencies with npm
npm install
```

### Deployment
> Build the package and deploy it to a web server

```bash
# navigate to the directory that includes package.json
cd uemf-cpanel

# run the build command
npm run build

# upload the results which are found in the /dist directory to your web server
cd dist/
```

### Development
> Start the local web server

```bash
npm start
```

This will start a web server on your local host and will re-package the app as you made changes. Webpack will display information such as warnings and errors in your code as it compiles the packages. By default the link will be [localhost:3000](http://localhost:3000) but if you have other processes running on port 3000, then it will increment until it finds a free port.

# Important!
This package was started with [preboot](https://github.com/preboot)/[angular2-webpack](https://github.com/preboot/angular2-webpack). The most recent version of the starter may be different than the codebase this project has, but the source documentation may still be useful.
