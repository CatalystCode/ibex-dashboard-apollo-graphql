import * as React from 'react';
import Card from '../../components/Card';

import List from 'react-md/lib/Lists/List';
import ListItemControl from 'react-md/lib/Lists/ListItemControl';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import ListItem from 'react-md/lib/Lists/ListItem';

import FilterActions from '../../actions/FilterActions';

import colors from '../../components/colors';
var { ThemeColors } = colors;

export interface IDropDownQueryRendererProps {
  results: any;
  id: string;
}

const styles = {
  button: {
    userSelect: 'none',
  } as React.CSSProperties,
  container: {
    position: 'relative',
    float: 'left',
    zIndex: 17,
  } as React.CSSProperties,
  animateOpen: {
    transition: '.3s',
    transform: 'scale(1.0,1.0)',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  } as React.CSSProperties,
  animateClose: {
    transform: 'scale(1.0,0)',
    transition: '0s',
  } as React.CSSProperties,
  list: {
    position: 'absolute',
    top: '0px',
    left: '0px',
  } as React.CSSProperties
};

// using styles from the select field menu
const classNames = {
  menu: ['md-inline-block', 'md-menu-container', 'md-menu-container--menu-below', 'md-select-field-menu',
    'md-select-field-menu--stretch', 'md-select-field--toolbar', ''],
  label: ['md-floating-label', 'md-floating-label--floating', ''],
};

export default class DropDownQueryRenderer extends React.PureComponent<IDropDownQueryRendererProps, any> {
  /*static defaultProps = {
    title: '',
    subtitle: 'Select filter',
    icon: 'more_vert',
    selectAll: 'Enable filters',
    selectNone: 'Clear filters'
  };*/

  state = {
    overlay: false,
    values: [],
    selectedValues: [],
    originalSelectedValues: []
  };

  constructor(props: any) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.hideOverlay = this.hideOverlay.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.selectNone = this.selectNone.bind(this);
  }

  toggleOverlay() {
    const { overlay, selectedValues } = this.state;
    this.setState({ overlay: !overlay, originalSelectedValues: selectedValues });
    if (overlay) {
      this.triggerChanges();
    }
  }

  hideOverlay() {
    this.setState({ overlay: false });
    this.triggerChanges();
  }

  triggerChanges() {
    const { selectedValues } = this.state;
    if (!this.didSelectionChange()) {
      return;
    }
  }

  didSelectionChange(): boolean {
    const { selectedValues, originalSelectedValues } = this.state;
    if (!selectedValues || !originalSelectedValues) {
      return false;
    }
    if (selectedValues.length !== originalSelectedValues.length
      || selectedValues.slice(0).sort().join() !== originalSelectedValues.slice(0).sort().join()) {
      return true;
    }
    return false;
  }

  onChange(newValue: any, checked: boolean, event: any) {
    var { selectedValues } = this.state;
    let newSelectedValues = selectedValues.slice(0);
    const idx = selectedValues.findIndex((x) => x === newValue);
    if (idx === -1 && checked) {
      newSelectedValues.push(newValue);
    } else if (idx > -1 && !checked) {
      newSelectedValues.splice(idx, 1);
    } else {
      console.warn('Unexpected checked filter state:', newValue, checked);
    }

    FilterActions.filterChanged(this.props.id, newSelectedValues);

    this.setState({ selectedValues: newSelectedValues });
  }

  selectAll() {
    this.setState({ selectedValues: this.state.values });
  }

  selectNone() {
    this.setState({ selectedValues: [] });
  }

  render() {
    let { selectedValues, overlay } = this.state;
    overlay = true;
    const paperStyle = overlay ? classNames.menu.join(' ') + 'md-paper md-paper--1' : classNames.menu.join(' ');
    const labelStyle = overlay ? classNames.label.join(' ') + 'md-floating-label--active' : classNames.label.join(' ');

    const containerStyle = overlay ? { ...styles.container, ...styles.animateOpen }
      : { ...styles.container, ...styles.animateClose };

    let items = [];
    for (var i = 0; i < this.props.results.length; i++) {
      var item = this.props.results[i];
      items.push(
        <ListItemControl 
          key={'drp' + i + item.id}
          primaryAction={
            (
              <Checkbox
                id={'drp' + i + item.id}
                name={'drp' + i + item.id}
                label={item.name}
                defaultChecked
                onChange={this.onChange.bind(null, item.name)}
                checked={selectedValues.find((x) => x === item.name) !== undefined}
              />
            )
          }
        />
      );
    }
    return (
      <div className="DropDownQueryRenderer">
        <Card title={'Drop Box filters'} subtitle={'Yep'}>
          <div style={containerStyle} >
            <List>
              {items}
            </List>
          </div>
        </Card>
      </div>
    );
  }
}