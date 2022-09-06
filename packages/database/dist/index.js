"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Prisma: () => import_client2.Prisma,
  convertSteamApiDataToPrisma: () => convertSteamApiDataToPrisma,
  createPerformancePost: () => createPerformancePost,
  createSteamUser: () => createSteamUser,
  deleteUserBySteamId: () => deleteUserBySteamId,
  extractSteamApiDemos: () => extractSteamApiDemos,
  findPerformancePostsByAppId: () => findPerformancePostsByAppId,
  findUserBySteamId: () => findUserBySteamId,
  prisma: () => prisma,
  updateSteamApp: () => updateSteamApp,
  updateSteamAppDownloadAttempted: () => updateSteamAppDownloadAttempted,
  updateUserOwnedApps: () => updateUserOwnedApps,
  upsertSteamUser: () => upsertSteamUser
});
module.exports = __toCommonJS(src_exports);

// src/client.ts
var import_client = require("@prisma/client");
var prisma = global.prisma || new import_client.PrismaClient();
if (process.env.NODE_ENV !== "production")
  global.prisma = prisma;

// src/interfaces/index.ts
var import_client2 = require("@prisma/client");

// src/utils/convert-steam-api-to-prisma.ts
function extractSteamApiDemos(steamAppId, demos) {
  return demos.map((demo) => {
    return {
      steamAppId,
      demoAppId: demo.appid,
      description: demo.description ? demo.description : null
    };
  });
}
function extractSteamApiPackageGroups(steamAppId, packageGroups) {
  return packageGroups.map((packageGroup) => {
    return {
      steamAppId,
      name: packageGroup.name,
      title: valueExistsOrNull(packageGroup.title),
      description: valueExistsOrNull(packageGroup.description),
      selectionText: valueExistsOrNull(packageGroup.selection_text),
      saveText: valueExistsOrNull(packageGroup.save_text),
      displayType: String(valueExistsOrNull(packageGroup.display_type)),
      isRecurringSubscription: valueExistsOrNull(packageGroup.is_recurring_subscription),
      subs: packageGroup.subs ? extractSteamApiPackageGroupSubs(steamAppId, packageGroup.name, packageGroup.subs) : null
    };
  });
}
function extractSteamApiPackageGroupSubs(steamAppId, packageGroupName, packageGroupSubs) {
  return packageGroupSubs.map((packageGroupSub) => {
    return {
      steamAppId,
      packageGroupName,
      packageId: packageGroupSub.packageid,
      percentSavingsText: valueExistsOrNull(packageGroupSub.percent_savings_text),
      percentSavings: valueExistsOrNull(packageGroupSub.percent_savings),
      optionText: valueExistsOrNull(packageGroupSub.option_text),
      optionDescription: valueExistsOrNull(packageGroupSub.option_description),
      canGetFreeLicense: valueExistsOrNull(packageGroupSub.can_get_free_license),
      isFreeLicense: valueExistsOrNull(packageGroupSub.is_free_license),
      priceInCentsWithDiscount: valueExistsOrNull(packageGroupSub.price_in_cents_with_discount)
    };
  });
}
function extractSteamApiCategories(categories) {
  return categories.map((category) => {
    return {
      categoryId: category.id,
      description: category.description ? category.description : ""
    };
  });
}
function extractSteamApiGenres(genres) {
  return genres.map((genre) => {
    return {
      genreId: genre.id,
      description: genre.description ? genre.description : ""
    };
  });
}
function extractSteamApiScreenshots(steamAppId, screenshots) {
  return screenshots.map((screenshot) => {
    return {
      steamAppId,
      screenshotId: screenshot.id,
      pathThumbnail: valueExistsOrNull(screenshot.path_thumbnail),
      pathFull: valueExistsOrNull(screenshot.path_full)
    };
  });
}
function extractSteamApiMovies(steamAppId, movies) {
  return movies.map((movie) => {
    var _a, _b, _c, _d;
    return {
      steamAppId,
      movieId: movie.id,
      name: valueExistsOrNull(movie.name),
      thumbnail: valueExistsOrNull(movie.thumbnail),
      webmFourEighty: ((_a = movie.webm) == null ? void 0 : _a["480"]) ? movie.webm["480"] : null,
      webmMax: ((_b = movie.webm) == null ? void 0 : _b.max) ? movie.webm.max : null,
      mp4FourEighty: ((_c = movie.mp4) == null ? void 0 : _c["480"]) ? movie.mp4["480"] : null,
      mp4Max: ((_d = movie.mp4) == null ? void 0 : _d.max) ? movie.mp4.max : null,
      highlight: movie.highlight ? movie.highlight : null
    };
  });
}
function extractSteamApiAchievements(steamAppId, achievements) {
  return achievements.map((achievement) => {
    return {
      steamAppId,
      name: achievement.name,
      path: valueExistsOrNull(achievement.path),
      highlighted: true
    };
  });
}
function valueExistsOrNull(v) {
  if (v === null || v === void 0) {
    return null;
  }
  return v;
}
function convertSteamApiDataToPrisma(app) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
  return {
    name: app.name,
    steamAppId: app.steam_appid,
    dataDownloadAttempted: true,
    dataDownloadAttemptedAt: new Date(),
    dataDownloaded: true,
    dataDownloadedAt: new Date(),
    type: valueExistsOrNull(app.type),
    requiredAge: valueExistsOrNull(app.required_age) ? String(app.required_age) : null,
    isFree: valueExistsOrNull(app.is_free),
    controllerSupport: valueExistsOrNull(app.controller_support),
    dlc: app.dlc ? app.dlc : [],
    detailedDescription: valueExistsOrNull(app.detailed_description),
    aboutTheGame: valueExistsOrNull(app.about_the_game),
    shortDescription: valueExistsOrNull(app.short_description),
    supportedLanguages: valueExistsOrNull(app.supported_languages),
    reviews: valueExistsOrNull(app.reviews),
    headerImage: valueExistsOrNull(app.header_image),
    website: valueExistsOrNull(app.website),
    pcRequirementsMinimum: valueExistsOrNull((_a = app.pc_requirements) == null ? void 0 : _a.minimum),
    pcRequirementsRecommended: valueExistsOrNull((_b = app.pc_requirements) == null ? void 0 : _b.recommended),
    macRequirementsMinimum: valueExistsOrNull((_c = app.mac_requirements) == null ? void 0 : _c.minimum),
    macRequirementsRecommended: valueExistsOrNull((_d = app.mac_requirements) == null ? void 0 : _d.recommended),
    linuxRequirementsMinimum: valueExistsOrNull((_e = app.linux_requirements) == null ? void 0 : _e.minimum),
    linuxRequirementsRecommended: valueExistsOrNull((_f = app.linux_requirements) == null ? void 0 : _f.recommended),
    legalNotice: valueExistsOrNull(app.legal_notice),
    developers: app.developers ? app.developers : [],
    publishers: app.publishers ? app.publishers : [],
    demos: app.demos ? extractSteamApiDemos(app.steam_appid, app.demos) : null,
    priceOverview: app.price_overview ? {
      steamAppId: app.steam_appid,
      currency: valueExistsOrNull(app.price_overview.currency),
      initial: valueExistsOrNull(app.price_overview.initial),
      final: valueExistsOrNull(app.price_overview.final),
      discountPercent: valueExistsOrNull(app.price_overview.discount_percent),
      initialFormatted: valueExistsOrNull(app.price_overview.initial_formatted),
      finalFormatted: valueExistsOrNull(app.price_overview.final_formatted)
    } : null,
    packages: app.packages ? app.packages : [],
    packageGroups: app.package_groups ? extractSteamApiPackageGroups(app.steam_appid, app.package_groups) : null,
    platformWindows: valueExistsOrNull((_g = app.platforms) == null ? void 0 : _g.windows),
    platformMac: valueExistsOrNull((_h = app.platforms) == null ? void 0 : _h.mac),
    platformLinux: valueExistsOrNull((_i = app.platforms) == null ? void 0 : _i.linux),
    metacriticScore: valueExistsOrNull((_j = app.metacritic) == null ? void 0 : _j.score),
    metacriticUrl: valueExistsOrNull((_k = app.metacritic) == null ? void 0 : _k.url),
    categories: app.categories ? extractSteamApiCategories(app.categories) : null,
    genres: app.genres ? extractSteamApiGenres(app.genres) : null,
    screenshots: app.screenshots ? extractSteamApiScreenshots(app.steam_appid, app.screenshots) : null,
    movies: app.movies ? extractSteamApiMovies(app.steam_appid, app.movies) : null,
    recommendationsTotal: valueExistsOrNull((_l = app.recommendations) == null ? void 0 : _l.total),
    achievementsTotal: valueExistsOrNull((_m = app.achievements) == null ? void 0 : _m.total),
    achievements: ((_n = app.achievements) == null ? void 0 : _n.highlighted) ? extractSteamApiAchievements(app.steam_appid, app.achievements.highlighted) : null,
    comingSoon: valueExistsOrNull((_o = app.release_date) == null ? void 0 : _o.coming_soon),
    releaseDate: valueExistsOrNull((_p = app.release_date) == null ? void 0 : _p.date),
    supportUrl: valueExistsOrNull((_q = app.support_info) == null ? void 0 : _q.url),
    supportEmail: valueExistsOrNull((_r = app.support_info) == null ? void 0 : _r.email),
    background: valueExistsOrNull(app.background),
    backgroundRaw: valueExistsOrNull(app.background_raw),
    contentDescriptorIds: ((_s = app.content_descriptors) == null ? void 0 : _s.ids) ? app.content_descriptors.ids : [],
    contentDescriptorNotes: valueExistsOrNull((_t = app.content_descriptors) == null ? void 0 : _t.notes)
  };
}

// src/models/steamApp.ts
var import_logger = __toESM(require("@apple-si-gaming-db/logger"));
function valueExistsOrNull2(v) {
  if (v === null || v === void 0) {
    return null;
  }
  return v;
}
async function updateSteamAppDownloadAttempted(steamAppId, dataDownloadAttempted = true) {
  try {
    await prisma.steamApp.update({
      where: {
        steamAppId
      },
      data: {
        dataDownloadAttempted,
        dataDownloadAttemptedAt: new Date()
      }
    });
  } catch (err) {
    if (err instanceof Error) {
      import_logger.default.error("Error in updateSteamAppDownloadAttempted");
      throw err;
    } else {
      throw err;
    }
  }
}
async function updateSteamApp(prismaSteamAppData) {
  const {
    steamAppId,
    demos,
    priceOverview,
    packageGroups,
    categories,
    genres,
    screenshots,
    movies,
    achievements,
    ...prismaSteamApp
  } = prismaSteamAppData;
  try {
    await prisma.steamApp.update({
      where: {
        steamAppId
      },
      data: {
        ...prismaSteamApp,
        demos: connectOrCreateDemos(steamAppId, demos),
        priceOverview: connectOrCreatePriceOverview(steamAppId, priceOverview),
        categories: connectOrCreateCategories(categories),
        genres: connectOrCreateGenres(genres),
        screenshots: connectOrCreateScreenshots(steamAppId, screenshots),
        movies: connectOrCreateMovies(steamAppId, movies),
        achievements: connectOrCreateAchievements(steamAppId, achievements)
      }
    });
  } catch (err) {
    if (err instanceof Error) {
      import_logger.default.error("Error at prisma.steamApp.update in updateSteamApp");
      throw err;
    } else {
      throw err;
    }
  }
  if (packageGroups) {
    for (let i = 0; i < packageGroups.length; i++) {
      const packageGroup = packageGroups[i];
      try {
        await prisma.steamPackageGroup.upsert({
          where: {
            steamAppId_name: {
              steamAppId,
              name: packageGroup.name
            }
          },
          create: {
            steamAppId,
            name: packageGroup.name,
            title: valueExistsOrNull2(packageGroup.title),
            description: valueExistsOrNull2(packageGroup.description),
            selectionText: valueExistsOrNull2(packageGroup.selectionText),
            saveText: valueExistsOrNull2(packageGroup.saveText),
            displayType: valueExistsOrNull2(packageGroup.displayType),
            isRecurringSubscription: valueExistsOrNull2(packageGroup.isRecurringSubscription),
            subs: connectOrCreatePackageGroupSubs(steamAppId, packageGroup.subs)
          },
          update: {
            steamAppId,
            name: packageGroup.name,
            title: valueExistsOrNull2(packageGroup.title),
            description: valueExistsOrNull2(packageGroup.description),
            selectionText: valueExistsOrNull2(packageGroup.selectionText),
            saveText: valueExistsOrNull2(packageGroup.saveText),
            displayType: valueExistsOrNull2(packageGroup.displayType),
            isRecurringSubscription: valueExistsOrNull2(packageGroup.isRecurringSubscription),
            subs: connectOrCreatePackageGroupSubs(steamAppId, packageGroup.subs)
          }
        });
      } catch (err) {
        if (err instanceof Error) {
          import_logger.default.error("Error at prisma.steamPackageGroup.upsert in updateSteamApp");
          throw err;
        } else {
          throw err;
        }
      }
    }
  }
}
function connectOrCreateDemos(steamAppId, demos) {
  return demos ? {
    connectOrCreate: demos.map((demo) => {
      return {
        where: {
          steamAppId_demoAppId: {
            steamAppId,
            demoAppId: demo.demoAppId
          }
        },
        create: {
          demoAppId: demo.demoAppId,
          description: valueExistsOrNull2(demo.description)
        }
      };
    })
  } : void 0;
}
function connectOrCreatePriceOverview(steamAppId, priceOverview) {
  return priceOverview ? {
    connectOrCreate: {
      where: {
        steamAppId
      },
      create: {
        currency: valueExistsOrNull2(priceOverview.currency),
        initial: valueExistsOrNull2(priceOverview.initial),
        final: valueExistsOrNull2(priceOverview.final),
        discountPercent: valueExistsOrNull2(priceOverview.discountPercent),
        initialFormatted: valueExistsOrNull2(priceOverview.initialFormatted),
        finalFormatted: valueExistsOrNull2(priceOverview.finalFormatted)
      }
    }
  } : void 0;
}
function connectOrCreatePackageGroupSubs(steamAppId, subs) {
  return subs ? {
    connectOrCreate: subs.map((sub) => {
      return {
        where: {
          steamAppId_packageGroupName_packageId: {
            steamAppId,
            packageGroupName: sub.packageGroupName,
            packageId: sub.packageId
          }
        },
        create: {
          packageId: sub.packageId,
          percentSavingsText: valueExistsOrNull2(sub.percentSavingsText),
          percentSavings: valueExistsOrNull2(sub.percentSavings),
          optionText: valueExistsOrNull2(sub.optionText),
          optionDescription: valueExistsOrNull2(sub.optionDescription),
          canGetFreeLicense: valueExistsOrNull2(sub.canGetFreeLicense),
          isFreeLicense: valueExistsOrNull2(sub.isFreeLicense),
          priceInCentsWithDiscount: valueExistsOrNull2(sub.priceInCentsWithDiscount)
        }
      };
    })
  } : void 0;
}
function connectOrCreateCategories(categories) {
  return categories ? {
    connectOrCreate: categories.map((category) => {
      return {
        where: {
          categoryId: category.categoryId
        },
        create: {
          categoryId: category.categoryId,
          description: category.description
        }
      };
    })
  } : void 0;
}
function connectOrCreateGenres(genres) {
  return genres ? {
    connectOrCreate: genres.map((genre) => {
      return {
        where: {
          genreId: genre.genreId
        },
        create: {
          genreId: genre.genreId,
          description: genre.description
        }
      };
    })
  } : void 0;
}
function connectOrCreateScreenshots(steamAppId, screenshots) {
  return screenshots ? {
    connectOrCreate: screenshots.map((screenshot) => {
      return {
        where: {
          steamAppId_screenshotId: {
            steamAppId,
            screenshotId: screenshot.screenshotId
          }
        },
        create: {
          screenshotId: screenshot.screenshotId,
          pathThumbnail: valueExistsOrNull2(screenshot.pathThumbnail),
          pathFull: valueExistsOrNull2(screenshot.pathFull)
        }
      };
    })
  } : void 0;
}
function connectOrCreateMovies(steamAppId, movies) {
  return movies ? {
    connectOrCreate: movies.map((movie) => {
      return {
        where: {
          steamAppId_movieId: {
            steamAppId,
            movieId: movie.movieId
          }
        },
        create: {
          movieId: movie.movieId,
          name: valueExistsOrNull2(movie.name),
          thumbnail: valueExistsOrNull2(movie.thumbnail),
          webmFourEighty: valueExistsOrNull2(movie.webmFourEighty),
          webmMax: valueExistsOrNull2(movie.webmMax),
          mp4FourEighty: valueExistsOrNull2(movie.mp4FourEighty),
          mp4Max: valueExistsOrNull2(movie.mp4Max),
          highlight: valueExistsOrNull2(movie.highlight)
        }
      };
    })
  } : void 0;
}
function connectOrCreateAchievements(steamAppId, achievements) {
  return achievements ? {
    connectOrCreate: achievements.map((achievement) => {
      return {
        where: {
          steamAppId_name: {
            steamAppId,
            name: achievement.name
          }
        },
        create: {
          name: achievement.name,
          path: valueExistsOrNull2(achievement.path),
          highlighted: valueExistsOrNull2(achievement.highlighted)
        }
      };
    })
  } : void 0;
}

// src/models/performancePost.ts
async function createPerformancePost({
  steamUserId,
  steamAppId,
  postText
}) {
  return prisma.performancePost.create({
    data: {
      postText,
      steamUserId,
      steamAppId
    }
  });
}
async function findPerformancePostsByAppId(steamAppId, select) {
  return prisma.performancePost.findMany({
    where: {
      steamAppId
    },
    select
  });
}

// src/models/steamUser.ts
async function findUserBySteamId(steamUserId, select) {
  return prisma.steamUser.findUnique({
    where: { steamUserId },
    select
  });
}
async function createSteamUser(steamUser, select) {
  return prisma.steamUser.create({
    data: {
      ...steamUser
    },
    select
  });
}
async function deleteUserBySteamId(steamUserId, select) {
  return prisma.steamUser.delete({
    where: { steamUserId },
    select
  });
}
async function updateUserOwnedApps(steamAppIds, steamUserId, select) {
  return prisma.steamUser.update({
    where: {
      steamUserId
    },
    data: {
      ownedApps: {
        connectOrCreate: steamAppIds.map((steamAppId) => ({
          where: {
            steamAppId
          },
          create: {
            steamAppId,
            name: "UNKNOWN_APP"
          }
        }))
      }
    },
    select
  });
}
async function upsertSteamUser(steamUser, select) {
  return prisma.steamUser.upsert({
    where: {
      steamUserId: steamUser.steamUserId
    },
    create: {
      ...steamUser
    },
    update: {
      ...steamUser
    },
    select
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Prisma,
  convertSteamApiDataToPrisma,
  createPerformancePost,
  createSteamUser,
  deleteUserBySteamId,
  extractSteamApiDemos,
  findPerformancePostsByAppId,
  findUserBySteamId,
  prisma,
  updateSteamApp,
  updateSteamAppDownloadAttempted,
  updateUserOwnedApps,
  upsertSteamUser
});
//# sourceMappingURL=index.js.map