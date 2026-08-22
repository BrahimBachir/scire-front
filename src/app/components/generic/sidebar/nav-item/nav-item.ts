import { Planes } from 'src/app/common/enums/planes.enum';
import { Roles } from 'src/app/common/enums/roles.enum';

export interface NavItem {
    displayName?: string;
    disabled?: boolean;
    external?: boolean;
    twoLines?: boolean;
    chip?: boolean;
    iconName?: string;
    navCap?: string;
    chipContent?: string;
    chipClass?: string;
    subtext?: string;
    route?: string;
    children?: NavItem[];
    ddType?: string;
    type?: string;
    requiresPlan?: Planes[];
    /** Roles allowed to see this item. Omit to show it to every role. */
    roles?: Roles[];
}