const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "assets/style")],
  },
  env: {
    templateUrl: process.env.TEMPLATE_URL,
    apiUrl:
      process.env.NEXT_PUBLIC_TENANT === "ncc"
        ? process.env.NEXT_PUBLIC_NCC_API_URL
        : process.env.NEXT_PUBLIC_API_URL,
    tenant: process.env.NEXT_PUBLIC_TENANT,
  },
};
