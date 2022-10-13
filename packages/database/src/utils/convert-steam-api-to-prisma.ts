import type {
  SteamAchievementCreateManySteamAppInput,
  SteamAppCreateInput,
  SteamCategoryCreateManyInput,
  SteamDemoCreateManySteamAppInput,
  SteamGenreCreateManyInput,
  SteamMovieCreateManySteamAppInput,
  SteamPackageGroupCreateManySteamAppInput,
  SteamPackageGroupSubCreateWithoutSteamPackageGroupInput,
  SteamScreenshotCreateManySteamAppInput,
} from '../interfaces';

import type {
  SteamApiAppData,
  SteamApiDemo,
  SteamApiPackageGroup,
  SteamApiPackageGroupSub,
  SteamApiCategory,
  SteamApiGenre,
  SteamApiScreenshotData,
  SteamApiMovieData,
  SteamApiAchievement,
} from '@apple-si-gaming-db/steam-api';

export function extractSteamApiDemos(
    // steamAppId: number,
    demos: SteamApiDemo[],
): SteamDemoCreateManySteamAppInput[] {
  return demos.map((demo) => {
    return {
      // steamAppId,
      demoAppId: demo.appid,
      description: demo.description ? demo.description : null,
    };
  });
}

function extractSteamApiPackageGroups(
    // steamAppId: number,
    packageGroups: SteamApiPackageGroup[],
): SteamPackageGroupCreateManySteamAppInput[] {
  return packageGroups.map((packageGroup) => {
    return {
      // steamAppId,
      name: packageGroup.name,
      title: valueExistsOrNull(packageGroup.title),
      description: valueExistsOrNull(packageGroup.description),
      selectionText: valueExistsOrNull(packageGroup.selection_text),
      saveText: valueExistsOrNull(packageGroup.save_text),
      displayType: String(valueExistsOrNull(packageGroup.display_type)),
      isRecurringSubscription: valueExistsOrNull(packageGroup.is_recurring_subscription),
      subs: packageGroup.subs ? extractSteamApiPackageGroupSubs(packageGroup.name, packageGroup.subs) : undefined,
    };
  });
}

function extractSteamApiPackageGroupSubs(
    // steamAppId: number,
    packageGroupName: string,
    packageGroupSubs: SteamApiPackageGroupSub[],
): SteamPackageGroupSubCreateWithoutSteamPackageGroupInput[] {
  return packageGroupSubs.map((packageGroupSub) => {
    return {
      // steamAppId,
      packageGroupName,
      packageId: packageGroupSub.packageid,
      percentSavingsText: valueExistsOrNull(packageGroupSub.percent_savings_text),
      percentSavings: valueExistsOrNull(packageGroupSub.percent_savings),
      optionText: valueExistsOrNull(packageGroupSub.option_text),
      optionDescription: valueExistsOrNull(packageGroupSub.option_description),
      canGetFreeLicense: valueExistsOrNull(packageGroupSub.can_get_free_license),
      isFreeLicense: valueExistsOrNull(packageGroupSub.is_free_license),
      priceInCentsWithDiscount: valueExistsOrNull(packageGroupSub.price_in_cents_with_discount),
    };
  });
}

function extractSteamApiCategories(
    categories: SteamApiCategory[],
): SteamCategoryCreateManyInput[] {
  return categories.map((category) => {
    return {
      categoryId: category.id,
      description: category.description ? category.description : '',
    };
  });
}

function extractSteamApiGenres(
    genres: SteamApiGenre[],
): SteamGenreCreateManyInput[] {
  return genres.map((genre) => {
    return {
      genreId: genre.id,
      description: genre.description ? genre.description : '',
    };
  });
}

function extractSteamApiScreenshots(
    // steamAppId: number,
    screenshots: SteamApiScreenshotData[],
): SteamScreenshotCreateManySteamAppInput[] {
  return screenshots.map((screenshot) => {
    return {
      // steamAppId,
      screenshotId: screenshot.id,
      pathThumbnail: valueExistsOrNull(screenshot.path_thumbnail),
      pathFull: valueExistsOrNull(screenshot.path_full),
    };
  });
}


// TODO: Left out valueExistsOrNull because of potential complications with .['480]
function extractSteamApiMovies(
    // steamAppId: number,
    movies: SteamApiMovieData[],
): SteamMovieCreateManySteamAppInput[] {
  return movies.map((movie) => {
    return {
      // steamAppId,
      movieId: movie.id,
      name: valueExistsOrNull(movie.name),
      thumbnail: valueExistsOrNull(movie.thumbnail),
      webmFourEighty: movie.webm?.['480'] ? movie.webm['480'] : null,
      webmMax: movie.webm?.max ? movie.webm.max : null,
      mp4FourEighty: movie.mp4?.['480'] ? movie.mp4['480'] : null,
      mp4Max: movie.mp4?.max ? movie.mp4.max : null,
      highlight: movie.highlight ? movie.highlight : null,
    };
  });
}


function extractSteamApiAchievements(
    // steamAppId: number,
    achievements: SteamApiAchievement[],
): SteamAchievementCreateManySteamAppInput[] {
  return achievements.map((achievement) => {
    return {
      // steamAppId,
      name: achievement.name,
      path: valueExistsOrNull(achievement.path),
      highlighted: true,
    };
  });
}

function valueExistsOrNull<T>(v: T) {
  if (v === null || v === undefined) {
    return null;
  }
  return v;
}

export function convertSteamApiDataToPrisma(
    app: SteamApiAppData,
): SteamAppCreateInput {
  return {
    name: app.name,
    steamAppId: app.steam_appid,
    dataDownloadAttempted: true,
    dataDownloadAttemptedAt: new Date(),
    dataDownloaded: true,
    dataDownloadedAt: new Date(),
    type: valueExistsOrNull(app.type),
    requiredAge: valueExistsOrNull(app.required_age) ? String(app.required_age) : null, // TODO: Look at
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
    pcRequirementsMinimum: valueExistsOrNull(app.pc_requirements?.minimum),
    pcRequirementsRecommended: valueExistsOrNull(app.pc_requirements?.recommended),
    macRequirementsMinimum: valueExistsOrNull(app.mac_requirements?.minimum),
    macRequirementsRecommended: valueExistsOrNull(app.mac_requirements?.recommended),
    linuxRequirementsMinimum: valueExistsOrNull(app.linux_requirements?.minimum),
    linuxRequirementsRecommended: valueExistsOrNull(app.linux_requirements?.recommended),
    legalNotice: valueExistsOrNull(app.legal_notice),
    developers: app.developers ? app.developers : [],
    publishers: app.publishers ? app.publishers : [],
    demos: app.demos ? extractSteamApiDemos(app.demos) : null,
    priceOverview: app.price_overview ? {
      currency: valueExistsOrNull(app.price_overview.currency),
      initial: valueExistsOrNull(app.price_overview.initial),
      final: valueExistsOrNull(app.price_overview.final),
      discountPercent: valueExistsOrNull(app.price_overview.discount_percent),
      initialFormatted: valueExistsOrNull(app.price_overview.initial_formatted),
      finalFormatted: valueExistsOrNull(app.price_overview.final_formatted),
    } : null,
    packages: app.packages ? app.packages : [],
    packageGroups: app.package_groups ? extractSteamApiPackageGroups(app.package_groups) : [],
    platformWindows: valueExistsOrNull(app.platforms?.windows), // boolean
    platformMac: valueExistsOrNull(app.platforms?.mac), // boolean
    platformLinux: valueExistsOrNull(app.platforms?.linux), // boolean
    metacriticScore: valueExistsOrNull(app.metacritic?.score),
    metacriticUrl: valueExistsOrNull(app.metacritic?.url),
    categories: app.categories ? extractSteamApiCategories(app.categories) : [],
    genres: app.genres ? extractSteamApiGenres(app.genres) : [],
    screenshots: app.screenshots ? extractSteamApiScreenshots(app.screenshots) : [],
    movies: app.movies ? extractSteamApiMovies(app.movies) : [],
    recommendationsTotal: valueExistsOrNull(app.recommendations?.total),
    achievementsTotal: valueExistsOrNull(app.achievements?.total),
    achievements: app.achievements?.highlighted ? extractSteamApiAchievements(app.achievements.highlighted) : [],
    comingSoon: valueExistsOrNull(app.release_date?.coming_soon), // boolean
    releaseDate: valueExistsOrNull(app.release_date?.date),
    supportUrl: valueExistsOrNull(app.support_info?.url),
    supportEmail: valueExistsOrNull(app.support_info?.email),
    background: valueExistsOrNull(app.background),
    backgroundRaw: valueExistsOrNull(app.background_raw),
    contentDescriptorIds: app.content_descriptors?.ids ? app.content_descriptors.ids : [],
    contentDescriptorNotes: valueExistsOrNull(app.content_descriptors?.notes),
  };
}
