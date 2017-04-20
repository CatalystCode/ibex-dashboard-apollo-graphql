import * as React from 'react';
import * as _ from 'lodash';
import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons/Button';
import { TabsContainer, Tab, Tabs } from 'react-md/lib/Tabs';

interface IScorecardConfProps {
  config: any;
  onChange: (id: string, newValue: any, oldValue: any, config: any) => void;
}

export default class ScorecardConfig extends React.Component<IScorecardConfProps, any> {

  constructor(props: any) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.getProperty = this.getProperty.bind(this);
    this.updateProperty = this.updateProperty.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.addNewCard = this.addNewCard.bind(this);
    this.updateNewCardValue = this.updateNewCardValue.bind(this);
    
    this.state = {
      configType: this.getProperty('configType') || 0,
      newCardValue: '',
      activeCardIndex: 0,
      cards: {},
      cardsInitialized: false
    };
  }

  getProperty (property: string, defaultValue: any = null): any {
    let arr = property.split('.');
    let obj = this.props.config;
    let parent = obj;
    while (arr.length && (obj = obj[arr.shift()])) { }
    if (typeof obj !== 'undefined') { return obj; }
    return defaultValue;
  }

  updateProperty (property: string, value: any) {
    let obj = this.props.config;
    let arr = property.split('.');
    let parent: any;
    let key: string;
    while (arr.length && (parent = obj) && (key = arr.shift()) && (obj = obj[key])) { }
    if (parent) {
      parent[key] = value;
    }
  }

  onChange(id: string, value: any) {
    let oldValue = this.getProperty(id);
    this.updateProperty(id, value);
    this.props.onChange(id, value, oldValue, this.props.config);

    if (id === 'configType') {
      this.setState({ configType: value });
    }
  }

  handleTabChange(activeCardIndex) {
    this.setState({ activeCardIndex });
  }

  updateNewCardValue(value) {
    this.setState({ newCardValue: value });
  }

  createNewCardData() {
    return {
      value: '',
      heading: '',
      color: '',
      icon: '',
      subvalue: '',
      subheading: '',
      className: '',
      onClick: '',
    };
  }

  addNewCard() {
    let { cards, newCardValue } = this.state;
    cards[newCardValue] = this.createNewCardData();

    this.setState({
      activeCardIndex: _.keys(cards).length - 1,
      cards, 
      newCardValue: ''
    })
  }

  componentDidMount() {
    if (!this.state.cardsInitialized && this.props.config) {

      let cards = {};
      _.keys(this.props.config.dependencies).forEach(
        (value, index) => {
          if (value.startsWith('card_')) {
            let keyParts = value.split('_');
            cards[keyParts[1]] = cards[keyParts[1]] || this.createNewCardData();
            cards[keyParts[1]][keyParts[2]] = this.props.config.dependencies[value];
          }
        }
      );

      this.setState({ 
        cardsInitialized: true,
        cards: cards
      });
    }
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  render() {

    let { configType } = this.state;
    if (!this.props.config) { return null; }

    let configTypes = [
      { 
        value: 0,
        title: 'Single Value'
      }, {
        value: 1,
        title: 'Value Array'
      }, {
        value: 2,
        title: 'Dynamic Cards' 
      }];

    let dependencyView = null;
    if (configType === 2) {

      // Dynamic View

      let { newCardValue, cards, activeCardIndex } = this.state;
      let cardTabs = 
        _.keys(cards).map(
          (cardName, cardIndex) => {

            let fields = _.keys(cards[cardName]).map(
              (key, index) => {
                 return (
                  <TextField
                    key={cardIndex * 100 + index}
                    id={cardName + '_' + key}
                    label={key}
                    defaultValue={cards[cardName][key]}
                    lineDirection="center"
                    onChange={this.onChange.bind(this, 'dependencies.card_' + cardName + '_' + key)}
                    className="md-cell"
                  />
                );
              }
            );

            return (
              <Tab key={cardIndex} label={cardName}>
                {fields}
              </Tab>
            );
          }
        );

      dependencyView = (
        <section className="md-grid">
          <TextField
            id="newCardValue"
            label="New Card Name"
            lineDirection="center"
            value={newCardValue}
            onChange={this.updateNewCardValue}
            className="md-cell md-cell--2"
          />
          <Button flat primary label="Add" className="md-cell--bottom" style={{ margin: 7 }} onClick={this.addNewCard}>add_circle_outline</Button>          
          <TabsContainer onTabChange={this.handleTabChange} activeTabIndex={activeCardIndex} panelClassName="md-grid" colored>
            <Tabs tabId="tab">
              {cardTabs}
            </Tabs>
          </TabsContainer>
        </section>
      );

    } else if (configType === 1) {

      // Multiple Values

      dependencyView = 
        [ 'values' ].map(
          (value, index) => {
            return (
              <TextField
                key={index}
                id={value}
                label={value}
                defaultValue={this.getProperty('dependencies.' + value, '')}
                lineDirection="center"
                onChange={this.onChange.bind(this, 'dependencies.' + value)}
                className="md-cell"
              />
            );
          }
        );

    } else {

      // Single Values

      dependencyView = 
        [ 'value', 'color', 'icon', 'subvalue', 'className' ].map(
          (value, index) => {
            return (
              <TextField
                key={index}
                id={value}
                label={value}
                defaultValue={this.getProperty('dependencies.' + value, '')}
                lineDirection="center"
                onChange={this.onChange.bind(this, 'dependencies.' + value)}
                className="md-cell"
              />
            );
          }
        );
    }

    return (
      <section className="md-grid">
        <TextField
          id="id"
          label="Id"
          defaultValue={this.getProperty('id')}
          lineDirection="center"
          placeholder="Fill in an id for the component"
          onChange={this.onChange.bind(this, 'id')}
          className="md-cell"
        />
        <SelectField
          id="width"
          label="Width"
          placeholder="0"
          defaultValue={this.getProperty('size.w', 4)}
          menuItems={[1, 2, 3, 4, 5, 6]}
          onChange={this.onChange.bind(this, 'size.w')}
          className="md-cell"
        />
        <SelectField
          id="height"
          label="Height"
          placeholder="0"
          defaultValue={this.getProperty('size.h', 3)}
          menuItems={[1, 2, 3, 4, 5, 6]}
          onChange={this.onChange.bind(this, 'size.h')}
          className="md-cell"
        />
        <br />
        <SelectField
          id="configType"
          label="Type"
          defaultValue={this.getProperty('configType', 0)}
          value={configType}
          menuItems={configTypes}
          itemLabel="title"
          itemValue="value"
          onChange={this.onChange.bind(this, 'configType')}
          className="md-cell"
        />
        <br />
        <section className="md-grid" style={{ clear: 'both' }}>
          {dependencyView}
        </section>
      </section>
    );
  }
}