import * as React from 'react';
import * as _ from 'lodash';
import FontIcon from 'react-md/lib/FontIcons';
import Switch from 'react-md/lib/SelectionControls/Switch';

import BaseSettings from '../../common/BaseSettingsComponent';

interface IPieSettingsProps{
    settings: IElement,
    shouldSave: boolean
}
interface IPieSettingsState{ 
    stateSettings:IElement //we need to persist the changes in state until a save is requested
}

export default class PieSettings extends React.Component<IPieSettingsProps,IPieSettingsState>{
    constructor(props: IPieSettingsProps) {
        super(props);
        this.onShowLegendChange = this.onShowLegendChange.bind(this);
    }
    
    state:IPieSettingsState ={
        stateSettings:this.props.settings
    }
    
    
    onShowLegendChange(checked:boolean){
        var s = this.state.stateSettings;
        s.props.showLegend = checked;
        this.setState({stateSettings:s});
    }


    render(){
        var { id, dependencies, actions, props, title, subtitle, size, theme, type } = this.state.stateSettings;
        return(
          <BaseSettings fonticon={"pie_chart"} settings={this.props.settings} shouldSave={this.props.shouldSave} >
              <span className="md-cell md-cell--bottom  md-cell--6">
                  <div className="md-grid">
                      <span className="md-cell--1 md-cell--middle"><FontIcon>insert_chart</FontIcon></span>
                      <span className="md-cell--11 md-cell--bottom"><Switch id="props.showLegend" name="props.showLegend" label="Show legend" checked={props.showLegend} onChange={this.onShowLegendChange} /></span>
                  </div>
              </span>
          </BaseSettings>
            
        );
    }
}