export const EventData = {
  Notification: {
    Show: 'application/notification/show',
  },
  Sidebar: {
    Table: 'application/sidebar/table',
    Orientation: 'application/sidebar/orientation',
    Select: 'application/sidebar/select',
  },
  Drawer: {
    Join: {
      Save: 'application/drawer/join/save',
      Cancel: 'application/drawer/join/cancel',
    },
    Mapping: {
      Save: 'application/drawer/mapping/save',
      Cancel: 'application/drawer/mapping/cancel',
    },
    Filters: {
      Save: 'application/drawer/filters/save',
      Cancel: 'application/drawer/filters/cancel',
    },
  },
  Model: {
    Select: 'application/model/select',
    Save: 'application/model/save',
    SaveAsync: 'application/model/save',
    AfterSave: 'application/model/aftersave',
    Table: {
      Add: 'application/model/table/add',
    },
    Delete: 'application/model/open-delete-transformation',
  },
  Process: {
    Message: 'application/process/message',
    UpdateProgress: 'application/process/update-progress',
  },
  Diagram: {
    Click: 'application/diagram/click',
    OpenDrawer: 'application/diagram/open-drawer',
    Node: {
      Add: 'application/diagram/node/add',
      Remove: 'application/diagram/node/remove',
      ShowPreview: 'application/diagram/node/show-preview',
      DeleteTarget: 'application/diagram/node/delete-target',
    },
    Edge: {
      PreAdd: 'application/diagram/edge/pre-add',
      Add: 'application/diagram/edge/add',
      Remove: 'application/diagram/edge/remove',
      Click: 'application/diagram/edge/click',
    },
    TemporaryNode: {
      Add: 'application/diagram/temporarynode/add',
      Remove: 'application/diagram/temporarynode/remove',
    },
    Panel: {
      Click: 'application/diagram/panel/click',
      FitView: 'application/diagram/panel/fit-view',
    },
  },
};
