# Social Todo
![Coverage lines](https://img.shields.io/badge/Coverage:lines-100-green.svg)
![Coverage functions](https://img.shields.io/badge/Coverage:functions-100-green.svg)
![Coverage branches](https://img.shields.io/badge/Coverage:branches-100-green.svg)
![Coverage statements](https://img.shields.io/badge/Coverage:statements-100-green.svg)

Requirements:

Mongodb connection URL (to be added in the .env)

Node version used: `16.15.0`

Npm version used: `8.5.5`

To build the project, run the below command:
```
npm run build
```

This would install all the dependencies and would also create a .env.

Fill the values in the .env.

There are two ways to run the project.

1. If you're using VS Code, you can go to the debugger tab (usually on the left side of the window) and play the "Launch" stack. This would start the project on your desired port (default: 4001).

2. If you do not wish to use the debugger in VS Code, you may run the `npm start` command in your terminal and the project would start on your desired port (default: 4001).

To run the tests, run this command:

```
npm test
```

Checkout the documentation of the project on postman before starting:
https://documenter.getpostman.com/view/18972104/2s93JnUmyj