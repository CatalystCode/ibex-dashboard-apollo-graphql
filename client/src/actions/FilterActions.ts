import alt, { AbstractActions } from '../alt';
import * as request from 'xhr-request';

interface IFilterActions {
  filterChanged(showLine: boolean): boolean;
}

class FilterActions extends AbstractActions implements IFilterActions {
  constructor(alt: AltJS.Alt) {
    super(alt);
  }

  filterChanged(showLine: boolean): boolean {
    return showLine;
  }
}

const filterActions = alt.createActions<IFilterActions>(FilterActions);

export default filterActions;
