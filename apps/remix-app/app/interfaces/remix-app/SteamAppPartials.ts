export interface TrendingSteamApp {
  steamAppId: number;
  name: string;
  headerImage: string | null;
  _count: {
    performancePosts: number,
  }
}
