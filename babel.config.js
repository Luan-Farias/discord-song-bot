module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    node: "current",
                },
            },
        ],
        "@babel/preset-typescript",
    ],
    plugins: [
        [
            "module-resolver",
            {
                alias: {
                    "@controllers": "./src/controllers",
                    "@database": "./src/database",
                    "@handlers": "./src/handlers",
                    "@config": "./src/config",
                },
            },
        ],
    ],
    ignore: ["**/*.spec.ts"],
};
