import type {
  SteamAppCreateInput,
  SteamCategoryCreateManyInput,
  SteamGenreCreateManyInput,
} from '../interfaces';

import type {
  SteamApiAppData,
  SteamApiCategory,
  SteamApiGenre,
} from '@apple-si-gaming-db/steam-api';

function extractSteamApiCategories(
    categories: SteamApiCategory[],
): SteamCategoryCreateManyInput[] {
  return categories.map((category) => {
    return {
      id: category.id,
      description: category.description ? category.description : '',
    };
  });
}

function extractSteamApiGenres(
    genres: SteamApiGenre[],
): SteamGenreCreateManyInput[] {
  return genres.map((genre) => {
    return {
      id: genre.id,
      description: genre.description ? genre.description : '',
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
    platformWindows: valueExistsOrNull(app.platforms?.windows), // boolean
    platformMac: valueExistsOrNull(app.platforms?.mac), // boolean
    platformLinux: valueExistsOrNull(app.platforms?.linux), // boolean
    metacriticScore: valueExistsOrNull(app.metacritic?.score),
    metacriticUrl: valueExistsOrNull(app.metacritic?.url),
    categories: app.categories ? extractSteamApiCategories(app.categories) : [],
    genres: app.genres ? extractSteamApiGenres(app.genres) : [],
    recommendationsTotal: valueExistsOrNull(app.recommendations?.total),
    achievementsTotal: valueExistsOrNull(app.achievements?.total),
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
