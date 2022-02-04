// import helper from '../helper';
const diffJson = require('diff-json');

export default class History {
  constructor() {
    this.undoItems = [];
    this.redoItems = [];
  }

  add(data, clearRedo = true) {
    if (this.undoItems.length > 0) {
      const actualState = JSON.parse(JSON.stringify(data));
      const baseItem = JSON.parse(this.undoItems[0]);
      for (let idx = 1; idx < this.undoItems.length; idx += 1) {
        diffJson.applyChanges(baseItem, JSON.parse(this.undoItems[idx]));
      }
      const diffs = diffJson.diff(baseItem, actualState);
      this.undoItems.push(JSON.stringify(diffs));
    } else {
      this.undoItems.push(JSON.stringify(data));
    }
    if (clearRedo) {
      this.redoItems = [];
    }
  }

  addRedo(data) {
    if (this.redoItems.length > 0) {
      const actualState = JSON.parse(JSON.stringify(data));
      const baseItem = JSON.parse(this.redoItems[0]);
      for (let idx = 1; idx < this.redoItems.length; idx += 1) {
        diffJson.applyChanges(baseItem, JSON.parse(this.redoItems[idx]));
      }
      const diffs = diffJson.diff(baseItem, actualState);
      this.redoItems.push(JSON.stringify(diffs));
    } else {
      this.redoItems.push(JSON.stringify(data));
    }
  }


  canUndo() {
    return this.undoItems.length > 0;
  }

  canRedo() {
    return this.redoItems.length > 0;
  }

  undo(currentd, cb) {
    const { undoItems } = this;
    if (this.canUndo()) {
      this.addRedo(currentd);
      if (undoItems.length > 1) {
        const baseItem = JSON.parse(undoItems[0]);
        for (let idx = 1; idx < undoItems.length; idx += 1) {
          diffJson.applyChanges(baseItem, JSON.parse(undoItems[idx]));
        }
        undoItems.pop();
        cb(baseItem);
      } else {
        cb(JSON.parse(undoItems.pop()));
      }
    }
  }

  redo(currentd, cb) {
    const { redoItems } = this;
    if (this.canRedo()) {
      this.add(currentd, false);
      if (redoItems.length > 1) {
        const baseItem = JSON.parse(redoItems[0]);
        for (let idx = 1; idx < redoItems.length; idx += 1) {
          diffJson.applyChanges(baseItem, JSON.parse(redoItems[idx]));
        }
        redoItems.pop();
        cb(baseItem);
      } else {
        cb(JSON.parse(redoItems.pop()));
      }
    }
  }
}
