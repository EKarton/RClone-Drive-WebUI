# RClone Drive Web UI

[![Netlify Status](https://api.netlify.com/api/v1/badges/e431cc05-9841-4b26-9092-78783424de4b/deploy-status)](https://app.netlify.com/sites/silly-mirzakhani-2a7996/deploys)

### Description:

The RClone Drive Web UI helps RClone users see and move their files between different cloud providers with an easy-to-use interface via a web browser. More particularly, it has the ability to:

- [x] Navigate through the directories and files
- [x] See images and files in detail
- [x] View all pictures recursively under a directory and a remote
- [ ] Search for files and images across remotes
- [ ] Copy and move files to / from remotes
- [ ] Delete files

The RClone Drive Web UI is a front-end project that interfaces with RClone's [Remote Control](https://rclone.org/rc/) http client. It is built using [React](), [React Context]() and [MUI Material]().

### Walkthrough:

### Setup / Installation

1. Install dependencies by running `yarn install`
2. Start your RClone instance by running:

   ```
   rclone rcd --rc-allow-origin '*' --rc-user='local' --rc-pass="1234" --rc-serve
   ```

   More info is at the [RClone docs](https://rclone.org/commands/rclone_rcd/)

3. Run this app in development mode by running `yarn start-dev`. It should open a web browser on `localhost:3000`

### Useful Scripts:

1. `yarn test`

   Runs all test cases

2. `yarn build`

   Builds the app in production mode

### Usage:

Please note that this project is used for educational purposes and is not intended to be used commercially. We are not liable for any damages/changes/lost data done by this project.

### Credits:

Emilio Kartono, who made the entire project

### License:

This project is protected under the GNU licence. Please refer to the LICENSE.txt for more information.
