/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  // ignoredRouteFiles: ['**/.*'],
  // assetsBuildDirectory: './public/build',
  // serverBuildPath: './build/server.js',
  serverModuleFormat: 'cjs',
  sourcemaps: true,
  tailwind: true,
  future: {
    v2_normalizeFormMethod: true,
    // v2_meta: true,
    v2_routeConvention: true,
  },
  // serverDependenciesToBundle: ['axios']
  // serverDependenciesToBundle: [
  //   '@apple-si-gaming-db/steam-api',
  //   '@apple-si-gaming-db/database',
  //   '@apple-si-gaming-db/logger',
  // ]
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
