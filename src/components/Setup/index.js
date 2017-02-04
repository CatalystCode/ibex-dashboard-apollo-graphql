import React, { Component } from 'react';
import classnames from 'classnames';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import TextField from 'material-ui/TextField';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

const style = {
  container: {
    display: 'inline-block',
    position: 'absolute',
    marginTop: -3
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
};

export default class Setup extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  
  state = {
    finished: false,
    stepIndex: 0,
    actionDone: false
  };

  handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
    
    if (stepIndex == 1) {
      setTimeout(() => {
        this.setState({
          actionDone: true
        });
      }, 5000);
    }

  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <span>Begin creating a dashboard</span>
          );
      case 1:
        return (
          <TextField 
              defaultValue="23a8a43d-c5c9-473a-9331-1bea526125f5"
              floatingLabelText="Copy this key into your bot's [Application Insights instrumentation key] field"
              floatingLabelFixed={true}
              fullWidth={true}
          />
        );
      case 2:
        return 'This is the bit I really care about!';
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  render() {
    const {finished, stepIndex, actionDone} = this.state;
    const contentStyle = {margin: '0 16px'};

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <h1>
          Create an analytics dashboard
        </h1>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Start</StepLabel>
          </Step>
          <Step>
            <StepLabel>Generate API key</StepLabel>
          </Step>
          <Step>
            <StepLabel>Done</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {finished ? (
            <p>
              <a href="/" >
                <span>Click here</span>
              </a> to see the dashboard.
            </p>
          ) : (
            <div>
              <p>{this.getStepContent(stepIndex)}</p>
              <div style={{marginTop: 12, width: '100%'}}>
                <FlatButton
                  label="Cancel"
                  disabled={stepIndex === 0 || stepIndex == 2}
                  onTouchTap={this.handlePrev}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  disabled={stepIndex === 2 && !actionDone}
                  label={stepIndex === 2 ? 'Finish' : 'Next'}
                  primary={true}
                  onTouchTap={this.handleNext}
                />
                <div style={style.container}>
                  <RefreshIndicator
                    size={40}
                    left={10}
                    top={0}
                    loadingColor="#FF9800"
                    status={stepIndex < 2  || actionDone ? "hide" : "loading"}
                    style={style.refresh}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}