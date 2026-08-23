export interface IOrganization {
  id?: number;
  code?: string;
  description?: string; // The organization's display name
  icon?: string;
  active?: boolean;
}

export interface IIncomingOrganizations {
  total: number;
  rows: IOrganization[];
}
