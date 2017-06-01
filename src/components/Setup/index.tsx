import * as React from 'react';
import Avatar from 'react-md/lib/Avatars';
import Chip from 'react-md/lib/Chips';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import Switch from 'react-md/lib/SelectionControls/Switch';

import InfoDrawer from '../common/InfoDrawer';
import { ToastActions } from '../Toast';

import SetupActions from '../../actions/SetupActions';
import SetupStore, { ISetupStoreState } from '../../stores/SetupStore';

interface ISetupState extends ISetupConfig {
  editedEmail?: string;
  validEmail?: boolean;
  loaded?: boolean;
}

export default class Setup extends React.Component<any, ISetupState> {

  state: ISetupState = {
    admins: null,
    stage: 'none',
    enableAuthentication: false,
    editedEmail: '',
    validEmail: true,
    allowHttp: false,
    redirectUrl: '',
    clientID: '',
    clientSecret: '',
    loaded: false,
    issuer: ''
  };

  constructor(props: any) {
    super(props);

    this.updateSetupState = this.updateSetupState.bind(this);
    this.checkEmailValue = this.checkEmailValue.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onRemoveAdmin = this.onRemoveAdmin.bind(this);
    this.onSwitchAllowHttp = this.onSwitchAllowHttp.bind(this);
    this.onSwitchAuthenticationEnables = this.onSwitchAuthenticationEnables.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.getAdminArray = this.getAdminArray.bind(this);
  }

  updateSetupState(state: ISetupStoreState) {
    this.setState(state);
  }

  componentDidMount() {

    this.updateSetupState(SetupStore.getState());

    SetupActions.load();
    SetupStore.listen(this.updateSetupState);
  }

  componentWillUnmount() {
    SetupStore.unlisten(this.updateSetupState);
  }

  validateEmail(email: string): boolean {
    // tslint:disable-next-line:max-line-length
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  checkEmailValue(e: any) {

    this.setState({ editedEmail: e.target.value });

    if (e.key === 'Enter') {

      let email = e.target.value;
      if (this.validateEmail(email)) {
        var admins = this.state.admins;
        admins.push(email);
        this.setState({ admins });
        e.target.value = '';
      } else {
        this.setState({ validEmail: false });
      }
      return false;
    }

    this.setState({ validEmail: true });
    return true;
  }

  fixRedirectUrl(redirectUrl: string): string {
    if (redirectUrl) { return redirectUrl; }

    let host = window.location.host;

    // On localhost, authentication requests go directly to port 4000
    if (host === 'localhost:3000') { host = 'localhost:4000'; }

    return window.location.protocol + '//' + host + '/auth/openid/return';
  }

  getAdminArray(): string[] {
    let admins = this.state.admins || [];
    if (this.state.editedEmail) {
      admins.push(this.state.editedEmail);
    }
    return admins;
  }

  onSave(): any {

    let admins = this.getAdminArray();
    let redirectUrl = this.fixRedirectUrl(this.state.redirectUrl);

    if (this.state.enableAuthentication) {
      if (!admins || !admins.length) { 
        return ToastActions.addToast({ text: 'Fill in at least one admin', action: null }); 
      }
      if (!redirectUrl) { 
        return ToastActions.addToast({ text: 'Fill in redirect url', action: null }); 
      }
      if (!this.state.issuer) { 
        return ToastActions.addToast({ text: 'Fill in issuer', action: null }); 
      }
      if (!this.state.clientID) { 
        return ToastActions.addToast({ text: 'Fill in client ID', action: null }); 
      }
      if (!this.state.clientSecret) { 
        return ToastActions.addToast({ text: 'Fill in client secret', action: null }); 
      }
      if (!this.state.allowHttp && redirectUrl.startsWith('http:')) { 
        return ToastActions.addToast(
          { 
            text: 'Redirect url should start with https or enable http redirects', 
            action: null 
          }); 
      }
    }
  
    var setupConfig = {
      admins: admins,
      stage: this.state.stage,
      enableAuthentication: this.state.enableAuthentication,
      allowHttp: this.state.allowHttp,
      redirectUrl: redirectUrl,
      clientID: this.state.clientID,
      clientSecret: this.state.clientSecret,
      issuer: this.state.issuer
    };
    SetupActions.save(setupConfig, () => { window.location.replace('/'); });
  }

  onCancel () {
    SetupActions.load();
  }

  onRemoveAdmin(admin: string) {
    var admins = this.state.admins;
    var adminIndex = admins.findIndex(adminName => adminName === admin);

    if (adminIndex >= 0) {
      admins.splice(adminIndex, 1);
      this.setState({ admins });
    }
  }

  onSwitchAuthenticationEnables(checked: boolean) {
    this.setState({ enableAuthentication: checked });
  };

  onSwitchAllowHttp(checked: boolean) {
    this.setState({ allowHttp: checked });
  };

  onFieldChange(value: string, e: any) {
    let state = {};
    state[e.target.id] = value;
    this.setState(state);
  }

  render() {

    let { admins, loaded, validEmail, enableAuthentication, redirectUrl, clientID, clientSecret, issuer } = this.state;

    // Setting default redirect parameter
    redirectUrl = this.fixRedirectUrl(redirectUrl);

    if (!loaded) {
      return null;
    }

    let adminChips = (admins || []).map((admin, idx) => (
      <Chip 
        key={idx}
        label={admin} 
        avatar={<Avatar random>{admin.length && admin[0] || '?'}</Avatar>}
        removable
        onClick={this.onRemoveAdmin.bind(this, admin)}
      />
    ));

    // tslint:disable:max-line-length
    return (
      <div style={{ width: '100%' }}>
        <Switch
          id="enableAuthentication" 
          name="enableAuthentication"
          label="Enable Authentication"
          checked={enableAuthentication}
          onChange={this.onSwitchAuthenticationEnables}
          style={{ float: 'left' }}
        />
        <InfoDrawer 
          width={300} 
          title="Authentication"
          buttonIcon="help"
          buttonTooltip="Click here to learn more about authentications"
        >
          <div>
            Follow the instructions
            in <a href="https://auth0.com/docs/connections/enterprise/azure-active-directory" target="_blank">this link</a> to
            get <b>Client ID</b> and <b>Client Secret</b>
            <hr/>
            Once you set up authentication, the first user you will log in with, will become the administrator.
            <hr/>
            This page (/setup) will continue to be available without authentication as long as you don't set up admin users.
          </div>
        </InfoDrawer>

        <br />
        {
          enableAuthentication && (
            <div>
              <Switch
                id="allowHttp" 
                name="allowHttp"
                label="Allow http in authentication responses"
                checked={this.state.allowHttp}
                onChange={this.onSwitchAllowHttp}
              />
              <div className="chip-list">
                {adminChips}
              </div>
              <TextField 
                id="adminEmail"
                label="Administrator Email"
                error={!validEmail}
                errorText={(!validEmail && 'Please enter a valid email address') || ''}
                lineDirection="center"
                placeholder="Enter an additional administrator email"
                className="md-cell md-cell--bottom"
                onKeyDown={this.checkEmailValue}
              />
              <TextField 
                id="redirectUrl"
                label="Redirect Url"
                lineDirection="center"
                placeholder="Enter an additional administrator email"
                className="md-cell md-cell--bottom"
                defaultValue={redirectUrl}
                onChange={this.onFieldChange}
              />
              <TextField 
                id="clientID"
                label="Client ID (Application ID)"
                lineDirection="center"
                placeholder="Enter an additional administrator email"
                className="md-cell md-cell--bottom"
                defaultValue={clientID}
                onChange={this.onFieldChange}
              />
              <TextField 
                id="clientSecret"
                label="Client Secret"
                type="password"
                lineDirection="center"
                placeholder="Enter client secret for registered application"
                className="md-cell md-cell--bottom"
                defaultValue={clientSecret}
                onChange={this.onFieldChange}
              />
              <TextField 
                id="issuer"
                label="Issuer: https://sts.windows.net/{Tenant-ID}/"
                lineDirection="center"
                placeholder="https://sts.windows.net/{Tenant-ID}/"
                className="md-cell md-cell--bottom"
                defaultValue={issuer}
                onChange={this.onFieldChange}
              />
            </div>)
        }
        <Button flat primary label="Save &amp; Apply" onClick={this.onSave}>save</Button>
        <Button flat primary label="Cancel" onClick={this.onCancel}>undo</Button>
      </div>
    );
    // tslint:enable:max-line-length
  }
}
