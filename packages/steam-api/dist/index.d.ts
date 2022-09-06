interface SteamApiAppDetailsResponse {
    success: boolean;
    data?: SteamApiAppData;
}
interface SteamApiAppData {
    type?: string;
    name: string;
    steam_appid: number;
    required_age?: string | number;
    is_free?: boolean;
    controller_support?: string;
    dlc?: number[];
    detailed_description?: string;
    about_the_game?: string;
    short_description?: string;
    supported_languages?: string;
    reviews?: string;
    header_image?: string;
    website?: string;
    pc_requirements?: {
        minimum?: string;
        recommended?: string;
    };
    mac_requirements?: {
        minimum?: string;
        recommended?: string;
    };
    linux_requirements?: {
        minimum?: string;
        recommended?: string;
    };
    legal_notice?: string;
    developers?: string[];
    publishers?: string[];
    demos: SteamApiDemo[];
    price_overview?: SteamApiPriceOverview;
    packages?: number[];
    package_groups?: SteamApiPackageGroup[];
    platforms?: {
        windows?: boolean;
        mac?: boolean;
        linux?: boolean;
    };
    metacritic?: {
        score?: number;
        url?: string;
    };
    categories?: SteamApiCategory[];
    genres?: SteamApiGenre[];
    screenshots?: SteamApiScreenshotData[];
    movies?: SteamApiMovieData[];
    recommendations?: {
        total?: number;
    };
    achievements?: {
        total?: number;
        highlighted?: SteamApiAchievement[];
    };
    release_date?: {
        coming_soon: boolean;
        date: string;
    };
    support_info?: {
        url: string;
        email: string;
    };
    background: string;
    background_raw: string;
    content_descriptors?: {
        ids?: [];
        notes?: string | null;
    };
}
interface SteamApiDemo {
    appid: number;
    description?: string;
}
interface SteamApiPriceOverview {
    currency?: string;
    initial?: number;
    final?: number;
    discount_percent?: number;
    initial_formatted?: string;
    final_formatted?: string;
}
interface SteamApiPackageGroup {
    name: string;
    title?: string;
    description?: string;
    selection_text?: string;
    save_text?: string;
    display_type?: number | string;
    is_recurring_subscription?: string;
    subs?: SteamApiPackageGroupSub[];
}
interface SteamApiPackageGroupSub {
    packageid: number;
    percent_savings_text?: string;
    percent_savings?: number;
    option_text?: string;
    option_description?: string;
    can_get_free_license?: string;
    is_free_license?: boolean;
    price_in_cents_with_discount?: number;
}
interface SteamApiCategory {
    id: number;
    description?: string;
}
interface SteamApiGenre {
    id: string;
    description?: string;
}
interface SteamApiScreenshotData {
    id: number;
    path_thumbnail?: string;
    path_full?: string;
}
interface SteamApiMovieData {
    id: number;
    name?: string;
    thumbnail?: string;
    webm?: {
        '480'?: string;
        max?: string;
    };
    mp4?: {
        '480'?: string;
        max?: string;
    };
    highlight?: boolean;
}
interface SteamApiAchievement {
    name: string;
    path?: string;
}
interface SteamApiGetOwnedGamesResponse {
    response: {
        game_count: number;
        games: {
            appid: number;
            playtime_2weeks: number;
            playtime_forever: number;
            playtime_windows_forever: number;
            playtime_mac_forever: number;
            playtime_linux_forever: number;
            rtime_last_played: number;
        }[];
    };
}

declare function getSteamAppDetailsRequest(steamAppId: number): Promise<SteamApiAppDetailsResponse>;
declare function getSteamPlayerOwnedGamesRequest(steamUserId: string): Promise<SteamApiGetOwnedGamesResponse['response']>;
interface SteamApiAppListResponse {
    applist: {
        apps: {
            name: string;
            appid: number;
        }[];
    };
}
declare function getSteamAppListRequest(): Promise<SteamApiAppListResponse>;

export { SteamApiAchievement, SteamApiAppData, SteamApiAppDetailsResponse, SteamApiCategory, SteamApiDemo, SteamApiGenre, SteamApiGetOwnedGamesResponse, SteamApiMovieData, SteamApiPackageGroup, SteamApiPackageGroupSub, SteamApiPriceOverview, SteamApiScreenshotData, getSteamAppDetailsRequest, getSteamAppListRequest, getSteamPlayerOwnedGamesRequest };
