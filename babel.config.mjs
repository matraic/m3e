export default {
  plugins: [
    [
      "template-html-minifier",
      {
        modules: {
          lit: ["html", "css"],
        },
        htmlMinifier: {
          collapseWhitespace: true,
          removeComments: true,
        },
        cssMinifier: {
          level: 1,
        },
      },
    ],
  ],
};
