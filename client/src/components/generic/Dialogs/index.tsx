import * as React from 'react';

import Dialog from './Dialog';
import DialogsActions from './DialogsActions';
import DialogsStore from './DialogsStore';

function loadDialogsFromDashboard(dashboard: IDashboardConfig): JSX.Element[] {

  if (!dashboard.visualDialog) {
    return null;
  }

  var dialogs = dashboard.visualDialog.map((dialog, idx) => 
    <Dialog key={idx} dialogData={dialog} dashboard={dashboard} />
  );

  return dialogs;
}

export {
  loadDialogsFromDashboard,
  Dialog,
  DialogsActions,
  DialogsStore
}