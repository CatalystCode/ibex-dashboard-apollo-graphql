import alt, { AbstractStoreModel } from '../alt';

import filterActions from '../actions/FilterActions';

interface IFilterState {
  filterId: string;
  values: string[];
}

interface IFilterStoreState {
  filterState: IFilterState[];
}

class FilterStore extends AbstractStoreModel<IFilterStoreState> implements IFilterStoreState {

  filterState: IFilterState[];

  constructor() {
    super();

    this.filterState = [];

    this.bindListeners({
      updateItems: filterActions.filterChanged
    });
  }
  
  updateItems(filter: any) {
    this.filterState[filter.filterId] = filter.selectedValues;
  }
}

const filterStore = alt.createStore<IFilterStoreState>(FilterStore, 'FilterStore');

export default filterStore;
