export const myrryrSchema = {
  campaigns: [] as {
    id: string;
    title: string;
    status: string;
    startDate?: Date;
    endDate?: Date;
  }[],
  creatives: [] as {
    id: string;
    type: string;
    filePath: string;
    usedInCampaignId?: string;
  }[],
};
