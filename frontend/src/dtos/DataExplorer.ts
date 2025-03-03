export interface dataSet {
  dataset: {}[];
  series: {
    dataKey: string;
    label: string;
  }[];
}

export interface spend {
  overall_spend: {
    value: string[];
  };
  spend_per_account: dataSet;
  spend_per_date: {
    date: string[];
    value: number[];
  };
  spend_per_platform: dataSet;

  spend_per_platform_total: {
    platform_name: string[];
    value: number[];
  };

  overall_spend_per_account: {
    columns: string[];
    data: {
      name: string;
      spend: number;
    }[];
  };
}

export interface reactions {
  overall_reactions: {
    value: string[];
  };
  reactions_per_date: {
    date: string[];
    value: number[];
  };
  top_ad_group_reactions: {
    columns: string[];
    data: {
      name: string;
      reactions: number;
    }[];
  };
}

export interface impressions {
  impressions_per_platform: dataSet;

  top_ad_group_impressions: {
    columns: string[];
    data: {
      name: string;
      impressions: number;
    }[];
  };
}

export interface combinedMetrics {
  avg_spend_per_reaction: {
    value: number[];
  };
  spend_per_reactions: {
    date: string[];
    value: number[];
  };
  top_campaigns_spend_per_click: {
    columns: string[];
    data: {
      name: string;
      spend_per_click: number;
    }[];
  };

  overall_spend_impressions_per_platform: {
    columns: string[];
    data: {
      name: string;
      spend: number;
      impressions: number;
    }[];
  };
}

export interface webinarMetrics {
  overall_engagements: number;
  user_attended: number;
  user_registered: number;
  website_conversions: number;
  attendance: number;
}

export interface statusCounts {
  STATUS: string;
  UTM_SOURCE: string;
  COUNTS: number;
}

export interface customersOverview {
  avg_session_per_user: number;
  overall_users: number;
  overall_users_last_n_days: number;
  page_view_per_user: string;
  page_views: number;
  revenue_last_days: number;
  session_count: number;
  total_page_view: number[];
}

export interface geoGroup {
  GEO_COUNTRY: string;
  COUNTS: number;
}

export interface purchaseTime {
  EVENT_DATE: number;
  AVG_TIME_SPENT: number;
}
export interface deviceType {
  EVENT_DATE: number;
  TABLET: number;
  MOBILE: number;
  DESKTOP: number;
  SMART_TV: number;
}

export interface browserType {
  EVENT_DATE: number;
  CHROME: number;
  EDGE: number;
  SAFARI: number;
  FIREFOX: number;
}
