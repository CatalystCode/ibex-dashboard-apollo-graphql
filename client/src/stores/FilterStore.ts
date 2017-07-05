import alt, { AbstractStoreModel } from '../alt';

import filterActions from '../actions/FilterActions';

interface IFilterStoreState {
  showLine: boolean;
}

class FilterStore extends AbstractStoreModel<IFilterStoreState> implements IFilterStoreState {

  showLine: boolean;

  constructor() {
    super();

    this.showLine = null;

    this.bindListeners({
      updateItems: filterActions.filterChanged
    });
  }
  
  updateItems(showline: boolean) {
    this.showLine = showline;
  }
}

const filterStore = alt.createStore<IFilterStoreState>(FilterStore, 'FilterStore');

export default filterStore;
