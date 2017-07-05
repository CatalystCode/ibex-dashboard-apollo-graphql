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
  title: string;
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

  static defaultProps = {
    title: '',
    subtitle: 'Select filter',
    icon: 'more_vert',
    selectAll: 'Enable filters',
    selectNone: 'Clear filters'
  };

  state = {
    overlay: false,
    values: [],
    selectedValues: [],
    originalSelectedValues: []
  };

  constructor(props: any) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(newValue: any, checked: boolean, event: any) {
    // alert(this.props.id);
    // alert(newValue);

    FilterActions.filterChanged(this.state.overlay);
    // call react action -  state changed

    this.setState({/* selectedValues: newSelectedValues,*/ overlay: !this.state.overlay });
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
          primaryAction={
            (
              <Checkbox
                id={'drp' + i + item.id}
                name="lineItems"
                label={item.name}
                defaultChecked
                onChange={this.onChange}
              />
            )
          }
        />
      );
    }
    return (
      <div className="DropDownQueryRenderer">
        <Card title={'This should be a dropbox (someday)'} subtitle={'Yep'}>
          <div style={containerStyle} >
            <List visible={overlay}>
              {items}
            </List>
          </div>
        </Card>
      </div>
    );
  }
}