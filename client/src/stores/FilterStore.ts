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
    var newObj = {filterId: filter.filterId, values : filter.selectedValues};
    for (let i =0 ; i< this.filterState.length; i++){
      if (this.filterState[i].filterId ===  filter.filterId) {
        this.filterState[i] = newObj;
        return;
      }
    }
    this.filterState.push(newObj);
  }
}

const filterStore = alt.createStore<IFilterStoreState>(FilterStore, 'FilterStore');

export default filterStore;
