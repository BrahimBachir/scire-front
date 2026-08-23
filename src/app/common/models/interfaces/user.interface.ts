import { IPhone, IEmail, IAddress, IRole, IPermit, IGender, IUserPricingPlan, ICourse, IAnnouncement, ISocialMedia, IOrganization } from '.';

export interface IUser {
  id?: number;
  full_name?: string;
  image?: string;
  emails?: IEmail[];
  phones?: IPhone[];
  addresses?: IAddress[];
  role: IRole;
  gender: IGender;
  organizationId?: number;
  organization?: IOrganization;
  permits?: IPermit[];
  code?: string;
  title?: string;
  active?: boolean;
  name?: string;
  first_surname?: string;
  birth_date?: string;
  second_surname?: string;
  isSelected?: boolean;
  token?: string;
  user_plans?: IUserPricingPlan[]
  brief_description?: string;
  students?: IUser[]
  courses?: ICourse[];
  announcements?: IAnnouncement[];
  social_medias?: ISocialMedia[];
}
