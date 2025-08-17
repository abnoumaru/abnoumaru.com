/** @type {import("prettier").Config} */
module.exports = {
  htmlWhitespaceSensitivity: "ignore",
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};