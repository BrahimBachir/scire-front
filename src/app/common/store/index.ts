/* import { ActionReducerMap } from '@ngrx/store';
import { LayoutState, layoutReducer } from './layouts/layout-reducers';
import {
  authenticationReducer,
  AuthenticationState,
} from './Authentication/authentication.reducer';
import { NotesState, NotesReducer } from './notes/notes.reducer';
import { InvoiceReducer, InvoiceState } from './invoice/invoice.reducer';
import { FileState, fileReducer } from './File-manager/fileManager.reducer';
import { TableState, tableReducer } from './File-table/fileTable.reducer';
import { SharedReducer, SharedState } from './File-shared/fileShared.reducer';
import { GridReducer, GridState } from './Grid-Table/gridjs.reducer';
import {
  CustomerState,
  customerReducer,
} from './customers/customers-list.reducer';
import {
  FollowersReducer,
  FollowersState,
} from './Customer-follower/customer-followers.reducer';
import {
  FollowingState,
  followingsReducer,
} from './Customer-following/customer-following.reducer';
import {
  GallaryReducer,
  GallaryState,
} from './Customer-gallary/customer-gallary.reducer';

import { ListState, ListReducer } from './List-Table/listjs.reducer';
import {
  MarketplaceReducer,
  MarketplaceState,
} from './Marketplace/marketplace.reducer';
import { WidgetReducer, WidgetState } from './Exchange/exchange.reducer';
import { ICOReducer, ICOState } from './Ico/ico.reducer';
import {
  TransactionsReducer,
  TransactionsState,
} from './Transactions/transactions.reducer';
import {
  OverviewReducer,
  OverviewState,
} from './Crypto_overview/overview.reducer';
import { CalendarState, calendarReducer } from './Calendar/calendar.reducer';
import { TodoReducer, TodoState } from './ToDo/todo.reducer';
import { ChatReducer, ChatState } from './Chat/chat.reducer';

export interface RootReducerState {
  authentication: AuthenticationState;
  layout: LayoutState;
  notes: NotesState;
  tableData: InvoiceState;
  storagecards: FileState;
  storagetable: TableState;
  Shared: SharedState;
  gridTable: GridState;
  SharedList: SharedState;
  customerList: CustomerState;
  followers: FollowersState;
  followings: FollowingState;
  gallariesData: GallaryState;
  listData: ListState;
  Marketplace: MarketplaceState;
  crypto: WidgetState;
  ICO: ICOState;
  Transactions: TransactionsState;
  cryptoOverview: OverviewState;
  Events: CalendarState;
  tododata: TodoState;
  chat: ChatState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
  authentication: authenticationReducer,
  layout: layoutReducer,
  notes: NotesReducer,
  tableData: InvoiceReducer,
  storagecards: fileReducer,
  storagetable: tableReducer,
  Shared: SharedReducer,
  gridTable: GridReducer,
  SharedList: SharedReducer,
  customerList: customerReducer,
  followers: FollowersReducer,
  followings: followingsReducer,
  gallariesData: GallaryReducer,
  listData: ListReducer,
  Marketplace: MarketplaceReducer,
  crypto: WidgetReducer,
  ICO: ICOReducer,
  Transactions: TransactionsReducer,
  cryptoOverview: OverviewReducer,
  Events: calendarReducer,
  tododata: TodoReducer,
  chat: ChatReducer,
};
 */