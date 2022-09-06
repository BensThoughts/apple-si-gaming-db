import * as _prisma_client from '.prisma/client';
import { PrismaClient, SteamApp, SteamDemo, SteamPriceOverview, SteamPackageGroup, SteamPackageGroupSub, SteamCategory, SteamGenre, SteamScreenshot, SteamMovie, SteamAchievement, SteamUser, Prisma } from '@prisma/client';
export { Prisma } from '@prisma/client';
import { SteamApiDemo, SteamApiAppData } from '@apple-si-gaming-db/steam-api';

declare global {
    var prisma: PrismaClient | undefined;
}
declare const prisma: PrismaClient<_prisma_client.Prisma.PrismaClientOptions, never, _prisma_client.Prisma.RejectOnNotFound | _prisma_client.Prisma.RejectPerOperation | undefined>;

declare type PrismaSteamApp = Partial<Omit<SteamApp, 'updatedAt' | 'createdAt' | 'id'>> & Pick<SteamApp, 'steamAppId' | 'dataDownloaded' | 'dataDownloadAttempted' | 'name'> & {
    demos?: PrismaSteamDemo[] | null;
    priceOverview?: PrismaSteamPriceOverview | null;
    packageGroups?: PrismaSteamPackageGroup[] | null;
    categories?: PrismaSteamCategory[] | null;
    genres?: PrismaSteamGenre[] | null;
    screenshots?: PrismaSteamScreenshot[] | null;
    movies?: PrismaSteamMovie[] | null;
    achievements?: PrismaSteamAchievement[] | null;
};
declare type PrismaSteamDemo = Partial<Omit<SteamDemo, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> & Pick<SteamDemo, 'steamAppId' | 'demoAppId'>;
declare type PrismaSteamPriceOverview = Partial<Omit<SteamPriceOverview, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> & Pick<SteamPriceOverview, 'steamAppId'>;
declare type PrismaSteamPackageGroup = Partial<Omit<SteamPackageGroup, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> & Pick<SteamPackageGroup, 'steamAppId' | 'name'> & {
    subs?: PrismaSteamPackageGroupSub[] | null;
};
declare type PrismaSteamPackageGroupSub = Partial<Omit<SteamPackageGroupSub, 'id' | 'createdAt' | 'updatedAt' | 'steamPackageGroup'>> & Pick<SteamPackageGroupSub, 'steamAppId' | 'packageId' | 'packageGroupName'>;
declare type PrismaSteamCategory = Omit<SteamCategory, 'id' | 'createdAt' | 'updatedAt' | 'steamApps'>;
declare type PrismaSteamGenre = Omit<SteamGenre, 'id' | 'createdAt' | 'updatedAt' | 'steamApps'>;
declare type PrismaSteamScreenshot = Partial<Omit<SteamScreenshot, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> & Pick<SteamScreenshot, 'steamAppId' | 'screenshotId'>;
declare type PrismaSteamMovie = Partial<Omit<SteamMovie, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> & Pick<SteamMovie, 'steamAppId' | 'movieId'>;
declare type PrismaSteamAchievement = Partial<Omit<SteamAchievement, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> & Pick<SteamAchievement, 'steamAppId' | 'name'>;

declare type PrismaSteamUser = Partial<Omit<SteamUser, 'id' | 'createdAt' | 'updatedAt'>> & Pick<SteamUser, 'steamUserId'>;

declare function extractSteamApiDemos(steamAppId: number, demos: SteamApiDemo[]): PrismaSteamDemo[];
declare function convertSteamApiDataToPrisma(app: SteamApiAppData): PrismaSteamApp;

declare function updateSteamAppDownloadAttempted(steamAppId: PrismaSteamApp['steamAppId'], dataDownloadAttempted?: boolean): Promise<void>;
declare function updateSteamApp(prismaSteamAppData: PrismaSteamApp): Promise<void>;

declare function createPerformancePost({ steamUserId, steamAppId, postText, }: {
    steamUserId: string;
    steamAppId: number;
    postText: string;
}): Promise<_prisma_client.PerformancePost>;
declare function findPerformancePostsByAppId(steamAppId: PrismaSteamApp['steamAppId'], select?: Prisma.PerformancePostSelect): Promise<{}[]>;

declare function findUserBySteamId(steamUserId: PrismaSteamUser['steamUserId'], select?: Prisma.SteamUserSelect): Promise<{} | null>;
declare function createSteamUser(steamUser: PrismaSteamUser, select?: Prisma.SteamUserSelect): Promise<{}>;
declare function deleteUserBySteamId(steamUserId: PrismaSteamUser['steamUserId'], select?: Prisma.SteamUserSelect): Promise<{}>;
declare function updateUserOwnedApps(steamAppIds: PrismaSteamApp['steamAppId'][], steamUserId: PrismaSteamUser['steamUserId'], select?: Prisma.SteamUserSelect): Promise<{}>;
declare function upsertSteamUser(steamUser: PrismaSteamUser, select?: Prisma.SteamUserSelect): Promise<{}>;

export { PrismaSteamAchievement, PrismaSteamApp, PrismaSteamCategory, PrismaSteamDemo, PrismaSteamGenre, PrismaSteamMovie, PrismaSteamPackageGroup, PrismaSteamPackageGroupSub, PrismaSteamPriceOverview, PrismaSteamScreenshot, PrismaSteamUser, convertSteamApiDataToPrisma, createPerformancePost, createSteamUser, deleteUserBySteamId, extractSteamApiDemos, findPerformancePostsByAppId, findUserBySteamId, prisma, updateSteamApp, updateSteamAppDownloadAttempted, updateUserOwnedApps, upsertSteamUser };
