export type AppLoadContextSteamUser = {
  steamUserId: string;
  displayName?: string | null;
  communityVisibilityState?: number | null;
  profileState?: number | null;
  personaName?: string | null;
  commentPermission?: number | null;
  profileUrl?: string | null;
  avatar?: string | null;
  avatarMedium?: string | null;
  avatarFull?: string | null;
  avatarHash?: string | null;
  lastLogoff?: number | null;
  personaState?: number | null;
  realName?: string | null;
  primaryClanId?: string | null;
  timeCreated?: number | null;
  personaStateFlags?: number | null;
  locCountryCode?: string | null;
  locStateCode?: string | null;
  locCityId?: number | null;
}

export type ExtendedAppLoadContext = {
  'steamUser': AppLoadContextSteamUser | null;
}
