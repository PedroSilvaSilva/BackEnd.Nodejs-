module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },

  extends: ["eslint:recommended", "airbnb"],
  parserOptions: {
    ecmaVersion: "latest",
  },

  rules: {
    "no-param-reassign": "off",
    camelcase: "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
    radix: "off",
  },
};
