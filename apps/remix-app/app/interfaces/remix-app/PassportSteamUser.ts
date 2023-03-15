export interface PassportSteamUser {
  provider: 'steam',
  id: string;
  displayName: string;
  photos?: { value: string }[] | null;
  _json: {
    steamid: string; // same as steamId64
    communityvisibilitystate: number;
    profilestate: number;
    personaname: string;
    commentpermission: number;
    profileurl: string;
    avatar: string;
    avatarmedium: string,
    avatarfull: string;
    avatarhash: string;
    personastate: number;
    lastlogoff?: number | null;
    realname?: string | null;
    primaryclanid?: string | null;
    timecreated?: number | null;
    personastateflags?: number | null;
    loccountrycode?: string | null;
    locstatecode?: string | null;
    loccityid?: number | null;
  }
}
