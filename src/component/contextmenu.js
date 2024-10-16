import { h } from './element';
import { bindClickoutside, unbindClickoutside } from './event';
import { cssPrefix } from '../config';
import { tf } from '../locale/locale';

const menuItems = [
  { key: 'copy', title: tf('contextmenu.copy'), label: 'Ctrl+C' },
  { key: 'cut', title: tf('contextmenu.cut'), label: 'Ctrl+X' },
  { key: 'paste', title: tf('contextmenu.paste'), label: 'Ctrl+V' },
  { key: 'paste-value', title: tf('contextmenu.pasteValue'), label: 'Ctrl+Shift+V' },
  { key: 'paste-format', title: tf('contextmenu.pasteFormat'), label: 'Ctrl+Alt+V' },
  { key: 'divider' },
  { key: 'insert-row', title: tf('contextmenu.insertRow') },
  { key: 'insert-row-below', title: tf('contextmenu.insertRowBelow') },
  { key: 'delete-row', title: tf('contextmenu.deleteRow') },
  { key: 'hide-row', title: tf('contextmenu.hideRow') },
  { key: 'divider-row' },
  { key: 'insert-column', title: tf('contextmenu.insertColumn') },
  { key: 'insert-column-right', title: tf('contextmenu.insertColumnRight') },
  { key: 'delete-column', title: tf('contextmenu.deleteColumn') },
  { key: 'hide-column', title: tf('contextmenu.hideColumn') },
  { key: 'divider-column' },
  // { key: 'delete-cell', title: tf('contextmenu.deleteCell') }, // stays unactive
  { key: 'delete-cell-text', title: tf('contextmenu.deleteCellText') },
  { key: 'delete-cell-format', title: tf('contextmenu.deleteCellFormat') },
  { key: 'divider' },
  { key: 'validation', title: tf('contextmenu.validation') },
  { key: 'divider' },
  { key: 'cell-printable', title: tf('contextmenu.cellprintable') },
  { key: 'cell-non-printable', title: tf('contextmenu.cellnonprintable') },
  { key: 'divider' },
  { key: 'cell-editable', title: tf('contextmenu.celleditable') },
  { key: 'cell-non-editable', title: tf('contextmenu.cellnoneditable') },
];

function buildMenuItem(item) {
  if (item.key.includes('divider')) {
    return h('div', `${cssPrefix}-item divider`);
  }
  return h('div', `${cssPrefix}-item`)
    .on('click', () => {
      this.itemClick(item.key);
      this.hide();
    })
    .children(
      item.title(),
      item.label ? h('div', 'label').child(item.label) : null,
    )
    .attr('data-title', item.title());
}

function buildMenu() {
  return menuItems.map(it => buildMenuItem.call(this, it));
}

export default class ContextMenu {
  constructor(viewFn, isHide = false) {
    this.menuItems = buildMenu.call(this);
    this.el = h('div', `${cssPrefix}-contextmenu`)
      .children(...this.menuItems)
      .hide();
    this.viewFn = viewFn;
    this.itemClick = () => {};
    this.isHide = isHide;
    this.setMode('range');
  }

  // row: all cells in a row
  // col: all cells in a col
  // range: select range
  setMode(mode, options = {}) {
    const {
      cols, rows, width, height,
    } = options;

    const items = menuItems.map(({ key }, index) => ({ key, index }));
    let rowItems = items.filter(({ key }) => key.includes('row'));
    let colItems = items.filter(({ key }) => key.includes('column'));

    // replace placeholders {a}, {b} (number of cols) in string
    for (const { index } of colItems) {
      const attr = this.menuItems[index].attr('data-title');
      if (attr) {
        this.menuItems[index].html(
          attr.replace('{a}', width).replace('{b}', width > 1 ? 's' : ''),
        );
      }
    }

    // replace placeholders {a}, {b} (number of rows) in string
    for (const { index } of rowItems) {
      const attr = this.menuItems[index].attr('data-title');
      if (attr) {
        this.menuItems[index].html(
          attr.replace('{a}', height).replace('{b}', height > 1 ? 's' : ''),
        );
      }
    }

    if (cols || rows) {
      for (const { index } of [...colItems, ...rowItems]) {
        this.menuItems[index].hide();
      }

      const omittedColItems = ['insert-column', 'delete-column', 'insert-column-right'];
      const omittedRowItems = ['insert-row', 'delete-row', 'insert-row-below'];

      const vOffset = cols.eci - cols.len;
      if (cols.eci === cols.len || (vOffset < width && vOffset >= 0)) {
        omittedColItems.splice(2, 2);
      }

      if (vOffset >= width) {
        omittedColItems.splice(0, 3);
      }

      const hOffset = rows.eri - rows.len;
      if (rows.eri === rows.len || (hOffset < height && hOffset >= 0)) {
        omittedRowItems.splice(2, 2);
      }

      if (hOffset >= height) {
        omittedRowItems.splice(0, 3);
      }

      colItems = colItems.filter(({ key }) => omittedColItems.every(elm => elm !== key));
      rowItems = rowItems.filter(({ key }) => omittedRowItems.every(elm => elm !== key));
    }

    if (['row', 'col', 'row-no-insert'].includes(mode)) {
      if (mode === 'col') {
        for (const { index } of colItems) {
          this.menuItems[index].show();
        }
        for (const { index } of rowItems) {
          this.menuItems[index].hide();
        }
      }
      if (mode === 'row') {
        for (const { index } of rowItems) {
          this.menuItems[index].show();
        }
        for (const { index } of colItems) {
          this.menuItems[index].hide();
        }
      }
      if (mode === 'row-no-insert') {
        for (const { index } of [...rowItems, ...colItems]) {
          this.menuItems[index].hide();
        }
      }
    }
    if (['range-single', 'range-multiple'].includes(mode)) {
      if (mode === 'range-single') {
        for (const { index, key } of [...colItems, ...rowItems]) {
          if (key.includes('hide')
            || (key.includes('divider-column') && cols && (cols.eci < cols.len))
            || (key.includes('divider-row') && rows && rows.eri < rows.len)) {
            this.menuItems[index].hide();
          } else {
            this.menuItems[index].show();
          }
        }
      }
      if (mode === 'range-multiple') {
        for (const { index } of [...colItems, ...rowItems]) {
          this.menuItems[index].hide();
        }
      }
    }
  }

  hide() {
    const { el } = this;
    el.hide();
    unbindClickoutside(el);
  }

  setPosition(x, y) {
    if (this.isHide) return;
    const { el } = this;
    const { width } = el.show().offset();
    const view = this.viewFn();
    const vhf = view.height / 2;
    let left = x;
    if (view.width - x <= width) {
      left -= width;
    }
    el.css('left', `${left}px`);
    if (y > vhf) {
      el.css('bottom', `${view.height - y}px`)
        .css('max-height', `${y}px`)
        .css('top', 'auto');
    } else {
      el.css('top', `${y}px`)
        .css('max-height', `${view.height - y}px`)
        .css('bottom', 'auto');
    }
    bindClickoutside(el);
  }
}
