import alt, { AbstractActions } from '../alt';
import * as request from 'xhr-request';

interface IFilterActions {
  filterChanged(filterId: string, selectedValues: string[]): any;
}

class FilterActions extends AbstractActions implements IFilterActions {
  constructor(alt: AltJS.Alt) {
    super(alt);
  }

  filterChanged(filterId: string, selectedValues: string[]): any {
    return {filterId , selectedValues};
  }
}

const filterActions = alt.createActions<IFilterActions>(FilterActions);

export default filterActions;
