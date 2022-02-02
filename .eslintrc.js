module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true
    },
    extends: ["airbnb-base", "prettier"],
    parserOptions: {
        ecmaVersion: "latest"
    },
    plugins: ["prettier"],
    root: true,
    rules: {
        "default-param-last": "off",
        "prettier/prettier": "error"
    },
    settings: {
        "import/core-modules": ["logger", "node_helper"]
    }
};
