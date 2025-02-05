'use strict';

const editor = {
  create: () => {
    return {
      dispose: () => {},
    }
  }
};

const loader = {
    config: () => {},
}

const monaco = {
  editor,
  loader
};

module.exports = monaco;