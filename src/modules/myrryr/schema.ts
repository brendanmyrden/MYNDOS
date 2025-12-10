export interface Campaign {
  id: string;
  title: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
}

export interface Creative {
  id: string;
  type: string;
  filePath: string;
  usedInCampaignId?: string;
}

export const myrryrSchema: {
  campaigns: Campaign[];
  creatives: Creative[];
} = {
  campaigns: [],
  creatives: [],
};
