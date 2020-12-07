import { makeAutoObservable, runInAction, toJS } from 'mobx';
import transactionAPI from 'apis/transaction';
import date from 'utils/date';
import { categoryType } from 'stores/Category';
import * as types from 'types';
import {
  calTotalPrices,
  calTotalPriceByDateAndType,
} from 'stores/Transaction/transactionStoreUtils';
import { testAccountDateList } from './testData';

export interface ITransactionStore {
  transactions: any;
  dates: {
    startDate: Date;
    endDate: Date;
  };
  filter: {
    methods: types.ICheckMethod[];
    categories: {
      income: types.IFilterCategory;
      expense: types.IFilterCategory;
    };
  };
}

const oneMonthDate = date.getOneMonthRange(
  String(new Date().getFullYear()),
  String(new Date().getMonth() + 1),
);
// const oneMonthDate = date.getOneMonthRange(
//   String(new Date().getFullYear()),
//   String(new Date().getMonth() + 1),
// );
console.log('oneMonthDate : ', oneMonthDate);

const initialState: ITransactionStore = {
  transactions: testAccountDateList,
  // dates: {
  //   startDate: oneMonthDate.startDate,
  //   endDate: oneMonthDate.endDate,
  // },
  dates: {
    startDate: new Date('2020-10-01'),
    endDate: new Date('2021-06-01'),
  },
  filter: {
    methods: [],
    categories: {
      income: {
        disabled: false,
        list: [],
      },
      expense: {
        disabled: false,
        list: [],
      },
    },
  },
};

export const state = {
  PENDING: 'PENDING',
  DONE: 'DONE',
  ERROR: 'ERROR',
};

const fetchDate = () => {
  const session = window.sessionStorage.getItem('filter');
  if (session) {
    const convert = JSON.parse(session);
    return {
      startDate: new Date(convert.dates.startDate),
      endDate: new Date(convert.dates.endDate),
    };
  }
  return initialState.dates;
};
const fetchFilter = () => {
  const session = window.sessionStorage.getItem('filter');
  if (session) {
    const convert = JSON.parse(session);
    return {
      categories: convert.categories,
      methods: convert.methods,
    };
  }
  return initialState.filter;
};
export const TransactionStore = makeAutoObservable({
  transactions: [] as any,
  dates: fetchDate(),
  filter: fetchFilter(),
  state: state.PENDING,
  accountObjId: '-1',
  setAccountObjId(objId: string) {
    this.accountObjId = objId;
    // sessionStorage.setItem('account', objId);
  },
  setFilter(
    startDate: Date,
    endDate: Date,
    filter?: ITransactionStore['filter'] | null,
  ) {
    this.dates = { startDate, endDate };
    if (filter) {
      this.filter = filter;
    }
  },
  resetFilter() {
    this.setFilter(
      initialState.dates.startDate,
      initialState.dates.endDate,
      initialState.filter,
    );
  },
  getFilter() {
    return toJS(this.filter);
  },
  getOriginDates() {
    return toJS(this.dates);
  },
  getDates() {
    return {
      startDate: date.dateFormatter(this.dates.startDate),
      endDate: date.dateFormatter(this.dates.endDate),
    };
  },
  get totalExpensePriceByDate() {
    return calTotalPriceByDateAndType(this.transactions, categoryType.EXPENSE);
  },
  get totalPrices() {
    if (this.state === state.PENDING) {
      // TODO PENDING 일 때 0,0을 보여주면 잠시 깜빡거림
      // 로딩관련 글씨를 보여주면 좋을 듯
      return { income: 0, expense: 0 };
    }
    return calTotalPrices(this.transactions);
  },
  async loadTransactions() {
    this.state = state.PENDING;
    try {
      const result = await transactionAPI.getTransactionList(
        this.accountObjId,
        this.getDates(),
      );
      runInAction(() => {
        this.transactions = result;
        this.state = state.DONE;
      });
    } catch (err) {
      runInAction(() => {
        this.state = state.ERROR;
      });
    }
  },
  getAccountId() {
    return toJS(this.accountObjId);
  },
});
