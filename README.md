# 🧰 StackOverflow Lite


# API Docs
- https://documenter.getpostman.com/view/5081938/Tz5wVDqi
### Features

- Minimal
- TypeScript v4
- Testing with Jest
- Linting with Eslint and Prettier
- Pre-commit hooks with Husky
- VS Code debugger scripts
- Local development with Nodemon
- Sequelize
- Sequelize-cli typescript

## Application Set up
Enviroment variables are set in `.env` files and the examples can be seen in `env.examples`.

1. Create `.env` files in the root folder, and set the correct environment variables as stated in `env.examples`
2. Open terminal and navigate to the root folder.
3. Install all dependencies and also set up the `database` and `database migration` by running this command on the terminal

    ```
    - npm install
    - npm run migration
    - npm run seed
    ```

## Running the App (Development)
1. Open terminal and navigate to the root folder.
2. Run this command on terminal 
```
    npm run dev
```

### Scripts

#### `npm run start:dev`

Starts the application in development using `nodemon` and `ts-node` to do hot reloading.

#### `npm run start`

Starts the app in production by first building the project with `npm run build`, and then executing the compiled JavaScript at `build/index.js`.

#### `npm run build`

Builds the app at `build`, cleaning the folder first.

#### `npm run test`

Runs the `jest` tests once.

#### `npm run test:dev`

Run the `jest` tests in watch mode, waiting for file changes.

#### `npm run prettier-format`

Format your code.

#### `npm run prettier-watch`

Format your code in watch mode, waiting for file changes.

