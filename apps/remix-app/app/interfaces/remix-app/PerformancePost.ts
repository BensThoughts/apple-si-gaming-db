import type {
  RatingTierRank,
  FrameRateTierRank,
  GamepadTierRank,
} from '~/interfaces';

//  type ExpandRecursively<T> = T extends object
//    ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
//    : T;

//  type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;


export type PerformancePost = {
  performancePostId: number;
  createdAt: Date;
  postText: string;
  rating: {
    ratingTierRank: RatingTierRank;
    frameRateTierRank?: FrameRateTierRank | null;
    frameRateStutters?: boolean | null;
    gamepadTierRank?: GamepadTierRank | null;
    gamepadMetadata?: {
      id: number;
      description: string;
    } | null;
  };
  userWhoCreated: {
    steamUserId64: string;
    displayName?: string | null;
    avatarMedium?: string | null;
    avatarFull?: string | null;
  };
  steamApp: {
    steamAppId: number;
    name: string;
    headerImage?: string | null;
  };
  postTags: {
    id: number;
    description: string;
  }[];
  systemSpec: {
    manufacturer?: string | null;
    model?: string | null;
    osVersion?: string | null;
    cpuBrand?: string | null;
    videoDriver?: string | null;
    videoDriverVersion?: string | null;
    videoPrimaryVRAM?: string | null;
    memoryRAM?: string | null;
    systemSpecId?: number | null;
  };
  numLikes: number;
}


export type PerformancePostForUserProfileDisplay = {
  performancePostId: number;
  createdAt: Date;
  postText: string;
  rating: {
    ratingTierRank: RatingTierRank;
    frameRateTierRank?: FrameRateTierRank | null;
    frameRateStutters?: boolean | null;
    gamepadTierRank?: GamepadTierRank | null;
    gamepadMetadata?: {
      description: string;
    } | null;
  }
  userWhoCreated: {
    steamUserId64: string;
  }
  steamApp: {
    steamAppId: number;
    name: string;
    headerImage?: string | null;
  };
  postTags: {
    id: number;
    description: string;
  }[];
  numLikes: number;
}

export type PerformancePostSystemSpecPopover = {
  systemSpec: {
    manufacturer?: string | null;
    model?: string | null;
    osVersion?: string | null;
    cpuBrand?: string | null;
    videoDriver?: string | null;
    videoDriverVersion?: string | null;
    videoPrimaryVRAM?: string | null;
    memoryRAM?: string | null;
    systemSpecId?: number | null;
  }
};

export type PerformancePostMetaBarData = {
  performancePostId: number;
  createdAt: Date;
  steamApp: {
    steamAppId: number;
  };
  userWhoCreated: {
    steamUserId64: string;
  };
  rating: {
    ratingTierRank: RatingTierRank;
    frameRateTierRank?: FrameRateTierRank | null;
    frameRateStutters?: boolean | null;
  };
  numLikes: number;
}

export type PerformancePostForNewPostsCard = {
  performancePostId: number;
  postText: string;
  userWhoCreated: {
    displayName?: string | null;
    avatarFull?: string | null;
  }
  steamApp: {
    steamAppId: number;
    name: string;
  }
}

export interface GamepadOption {
  id: number;
  description: string;
}

export interface PostTagOption {
  id: number;
  description: string;
}

export interface SystemSpecOption {
  id: number;
  systemName: string;
}
