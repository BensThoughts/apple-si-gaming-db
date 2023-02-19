import type { PrismaSteamCategory, PrismaSteamGenre } from '../database';

export interface SteamAppBase {
  steamAppId: number;
  name: string;
}

export type TrendingSteamApp = SteamAppBase & {
  headerImage?: string | null;
  numPerformancePosts: number;
}

export type SteamAppSidebarData = SteamAppBase & {
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
  genres: PrismaSteamGenre[];
  categories: PrismaSteamCategory[];
}
