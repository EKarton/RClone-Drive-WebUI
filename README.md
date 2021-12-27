# RClone Drive Web UI

[![Netlify Status](https://api.netlify.com/api/v1/badges/e431cc05-9841-4b26-9092-78783424de4b/deploy-status)](https://app.netlify.com/sites/silly-mirzakhani-2a7996/deploys)

### Description:

The RClone Drive Web UI helps RClone users see and move their files between different cloud providers with an easy-to-use interface via a web browser. More particularly, it has the ability to:

- [x] Navigate through the directories and files
- [x] See images and files in detail
- [x] View all pictures recursively under a directory and a remote
- [ ] Search for files and images across remotes
- [x] Copy and move files to / from remotes
- [x] Delete files
- [x] Dark mode

The RClone Drive Web UI is a front-end project that interfaces with RClone's [Remote Control](https://rclone.org/rc/) http client. It is built using [React v17](https://reactjs.org/blog/2020/10/20/react-v17.html), [React Context](https://reactjs.org/docs/context.html) and [MUI Material](https://mui.com/).

### Walkthrough:

### Setup / Installation

1. Install dependencies by running `yarn install`
2. Start your RClone instance:

   1. If your RClone config is in its [default location](https://rclone.org/docs/#:~:text=The%20exact%20default%20is%20a%20bit%20complex%20to%20describe%2C%20due%20to%20changes%20introduced%20through%20different%20versions%20of%20rclone%20while%20preserving%20backwards%20compatibility%2C%20but%20in%20most%20cases%20it%20is%20as%20simple%20as%3A), run:

      ```
      rclone rcd --rc-allow-origin '*' --rc-user='local' --rc-pass="1234" --rc-serve
      ```

   2. Else, if it is in a different location, run:

      ```
      rclone rcd --rc-allow-origin '*' --rc-user='local' --rc-pass="1234" --rc-serve --config <Path to RClone config>
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
