type SteamGenre = {
  id: string;
  description: string;
}

type SteamCategory = {
  id: number;
  description: string;
}

export type TrendingSteamApp = {
  steamAppId: number;
  name: string;
  headerImage?: string | null;
  numPerformancePosts: number;
}


export type SteamApp = {
  steamAppId: number;
  name: string;
  headerImage: string | null;
  requiredAge: string | null;
  shortDescription: string | null;
  releaseDate: string | null;
  platformMac: boolean | null;
  platformLinux: boolean | null;
  platformWindows: boolean | null;
  pcRequirementsMinimum: string | null;
  macRequirementsMinimum: string | null;
  linuxRequirementsMinimum: string | null;
  genres: SteamGenre[];
  categories: SteamCategory[];
  dataNeedsRefresh: boolean;
}

export type SteamAppForSmallAppsGridLayout = {
  steamAppId: number;
  name: string;
  headerImage?: string | null;
  platformMac?: boolean | null;
  genres: {
    id: string;
    description: string;
  }[];
}

export type SteamAppForSearchPage = {
    steamAppId: number;
    name: string;
    headerImage: string | null;
    releaseDate: string | null;
}

