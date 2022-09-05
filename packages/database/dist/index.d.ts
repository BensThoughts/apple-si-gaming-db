import * as _prisma_client from '.prisma/client';
import { PrismaClient, SteamApp, SteamDemo, SteamPriceOverview, SteamPackageGroup, SteamPackageGroupSub, SteamCategory, SteamGenre, SteamScreenshot, SteamMovie, SteamAchievement, SteamUser } from '@prisma/client';
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

declare function searchSteamAppsByName(name: PrismaSteamApp['name']): Promise<{
    name: string;
    steamAppId: number;
    headerImage: string | null;
}[]>;
declare function getSteamAppByAppId(steamAppId: PrismaSteamApp['steamAppId']): Promise<(_prisma_client.SteamApp & {
    categories: _prisma_client.SteamCategory[];
    genres: _prisma_client.SteamGenre[];
    performancePosts: {
        steamUser: _prisma_client.SteamUser;
        id: string;
        postText: string;
    }[];
}) | null>;
declare function updateSteamAppDownloadAttempted(steamAppId: PrismaSteamApp['steamAppId']): Promise<void>;
declare function updateSteamApp(steamAppId: PrismaSteamApp['steamAppId'], prismaSteamAppData: PrismaSteamApp): Promise<void>;

export { PrismaSteamAchievement, PrismaSteamApp, PrismaSteamCategory, PrismaSteamDemo, PrismaSteamGenre, PrismaSteamMovie, PrismaSteamPackageGroup, PrismaSteamPackageGroupSub, PrismaSteamPriceOverview, PrismaSteamScreenshot, PrismaSteamUser, convertSteamApiDataToPrisma, extractSteamApiDemos, getSteamAppByAppId, prisma, searchSteamAppsByName, updateSteamApp, updateSteamAppDownloadAttempted };
