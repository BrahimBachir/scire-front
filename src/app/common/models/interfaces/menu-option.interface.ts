export interface IMenuOption {
  title: string;
  icon: string;
  url?: string;
  role?: string
  type?: string // 'link' | 'button' | 'submenu' | 'component';
}
