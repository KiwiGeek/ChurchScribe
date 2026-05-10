window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createEditorTables = (deps) => {
  const {
    noteEditor,
    tableToolbar,
    tableDialog,
    tableRowsInput,
    tableColumnsInput,
    tableContextMenu,
    saveEditorSelection,
    restoreEditorSelection,
    getEditorRange,
    getClosestEditorElement,
    saveActiveNote,
    showInsertTableDialog,
    windowObject
  } = deps;

  let savedSelectionForTableInsert = null;
  let activeTableCell = null;
  let contextMenuTableCell = null;

  const ensureEditableCellContent = (cell) => {
    if (!cell) {
      return;
    }

    if (!cell.innerHTML.trim()) {
      cell.innerHTML = "<br>";
    }
  };

  const focusTableCell = (cell) => {
    if (!cell) {
      return;
    }

    ensureEditableCellContent(cell);
    noteEditor.focus();
    const range = document.createRange();
    range.selectNodeContents(cell);
    range.collapse(true);
    const selection = windowObject.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const getTableCellFromSelection = () => {
    const range = getEditorRange();

    if (!range) {
      return null;
    }

    const candidate = getClosestEditorElement(range.startContainer, "td, th");
    return candidate && noteEditor.contains(candidate) ? candidate : null;
  };

  const getTableContext = (cell) => {
    if (!cell) {
      return null;
    }

    const table = cell.closest("table");
    const row = cell.parentElement;

    if (!table || !row) {
      return null;
    }

    return {
      cell,
      row,
      table,
      rowIndex: [...table.rows].indexOf(row),
      columnIndex: [...row.cells].indexOf(cell)
    };
  };

  const buildTableMarkup = (rows, columns, markerId) => {
    const safeRows = Math.max(1, Math.min(20, rows));
    const safeColumns = Math.max(1, Math.min(12, columns));
    let body = "";

    for (let rowIndex = 0; rowIndex < safeRows; rowIndex += 1) {
      let cells = "";

      for (let columnIndex = 0; columnIndex < safeColumns; columnIndex += 1) {
        cells += "<td><br></td>";
      }

      body += `<tr>${cells}</tr>`;
    }

    return `<table class="note-table" data-table-marker="${markerId}"><tbody>${body}</tbody></table><p><br></p>`;
  };

  const closeTableContextMenu = () => {
    tableContextMenu.hidden = true;
    contextMenuTableCell = null;
  };

  const refreshTableUi = () => {
    const currentCell = getTableCellFromSelection();
    activeTableCell = currentCell;
    tableToolbar.toggleAttribute("hidden", !currentCell);

    if (!currentCell) {
      closeTableContextMenu();
    }
  };

  const insertTableAtSelection = (rows, columns) => {
    noteEditor.focus();
    const restoredSelection = restoreEditorSelection(savedSelectionForTableInsert);

    if (!restoredSelection && !getEditorRange()) {
      const range = document.createRange();
      range.selectNodeContents(noteEditor);
      range.collapse(false);
      const selection = windowObject.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }

    const markerId = `table-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const currentTable = getTableCellFromSelection()?.closest("table");
    let insertedTable = null;

    if (currentTable && noteEditor.contains(currentTable)) {
      const fragmentHost = document.createElement("div");
      fragmentHost.innerHTML = buildTableMarkup(rows, columns, markerId);
      const insertedNodes = [...fragmentHost.childNodes];
      currentTable.after(...insertedNodes);
      insertedTable = insertedNodes.find((node) => node.nodeName === "TABLE") ?? null;
    } else {
      document.execCommand("insertHTML", false, buildTableMarkup(rows, columns, markerId));
      insertedTable = noteEditor.querySelector(`[data-table-marker="${markerId}"]`);
    }

    if (!insertedTable) {
      saveActiveNote();
      refreshTableUi();
      return;
    }

    insertedTable.removeAttribute("data-table-marker");
    const firstCell = insertedTable.rows[0]?.cells[0] ?? null;

    if (firstCell) {
      focusTableCell(firstCell);
    }

    savedSelectionForTableInsert = null;
    saveActiveNote();
    refreshTableUi();
  };

  const getTableActionContext = () => getTableContext(contextMenuTableCell ?? activeTableCell);

  const isLastTableCell = (context) => {
    if (!context) {
      return false;
    }

    const isLastRow = context.rowIndex === context.table.rows.length - 1;
    const isLastColumn = context.columnIndex === context.row.cells.length - 1;
    return isLastRow && isLastColumn;
  };

  const getNextTableCell = (context) => {
    if (!context) {
      return null;
    }

    const nextCellInRow = context.row.cells[context.columnIndex + 1];

    if (nextCellInRow) {
      return nextCellInRow;
    }

    const nextRow = context.table.rows[context.rowIndex + 1];
    return nextRow?.cells[0] ?? null;
  };

  const createEmptyParagraph = () => {
    const paragraph = document.createElement("p");
    paragraph.innerHTML = "<br>";
    return paragraph;
  };

  const focusAfterTableRemoval = (table) => {
    let focusTarget = table.nextElementSibling;

    if (!focusTarget || !noteEditor.contains(focusTarget)) {
      focusTarget = createEmptyParagraph();
      table.after(focusTarget);
    }

    noteEditor.focus();
    const range = document.createRange();
    range.selectNodeContents(focusTarget);
    range.collapse(true);
    const selection = windowObject.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const insertTableRow = (context, offset, focusColumnIndex = context.columnIndex) => {
    const { table, rowIndex } = context;
    const insertIndex = offset < 0 ? rowIndex : rowIndex + 1;
    const columnCount = table.rows[0]?.cells.length ?? 0;
    const row = table.insertRow(insertIndex);

    for (let index = 0; index < columnCount; index += 1) {
      const cell = row.insertCell();
      cell.innerHTML = "<br>";
    }

    focusTableCell(row.cells[Math.min(focusColumnIndex, row.cells.length - 1)] ?? row.cells[0] ?? null);
  };

  const deleteTableRow = (context) => {
    const { table, rowIndex, columnIndex } = context;

    if (table.rows.length <= 1) {
      focusAfterTableRemoval(table);
      table.remove();
      return;
    }

    table.deleteRow(rowIndex);
    const nextRow = table.rows[Math.min(rowIndex, table.rows.length - 1)];
    focusTableCell(nextRow?.cells[Math.min(columnIndex, nextRow.cells.length - 1)] ?? nextRow?.cells[0] ?? null);
  };

  const insertTableColumn = (context, offset) => {
    const { table, columnIndex, rowIndex } = context;
    const insertIndex = offset < 0 ? columnIndex : columnIndex + 1;

    [...table.rows].forEach((row) => {
      const cell = row.insertCell(insertIndex);
      cell.innerHTML = "<br>";
    });

    const targetRow = table.rows[rowIndex] ?? table.rows[0];
    focusTableCell(targetRow?.cells[insertIndex] ?? null);
  };

  const deleteTableColumn = (context) => {
    const { table, columnIndex, rowIndex } = context;
    const columnCount = table.rows[0]?.cells.length ?? 0;

    if (columnCount <= 1) {
      focusAfterTableRemoval(table);
      table.remove();
      return;
    }

    [...table.rows].forEach((row) => {
      if (row.cells[columnIndex]) {
        row.deleteCell(columnIndex);
      }
    });

    const targetRow = table.rows[Math.min(rowIndex, table.rows.length - 1)] ?? null;
    const nextColumnIndex = Math.min(columnIndex, (targetRow?.cells.length ?? 1) - 1);
    focusTableCell(targetRow?.cells[nextColumnIndex] ?? null);
  };

  const deleteTableAtContext = (context) => {
    const { table } = context;
    focusAfterTableRemoval(table);
    table.remove();
  };

  const runTableAction = (action) => {
    const context = getTableActionContext();

    if (!context) {
      return;
    }

    switch (action) {
      case "insert-row-above":
        insertTableRow(context, -1);
        break;
      case "insert-row-below":
        insertTableRow(context, 1);
        break;
      case "delete-row":
        deleteTableRow(context);
        break;
      case "insert-column-left":
        insertTableColumn(context, -1);
        break;
      case "insert-column-right":
        insertTableColumn(context, 1);
        break;
      case "delete-column":
        deleteTableColumn(context);
        break;
      case "delete-table":
        deleteTableAtContext(context);
        break;
      default:
        return;
    }

    closeTableContextMenu();
    saveActiveNote();
    refreshTableUi();
  };

  const openTableContextMenu = (cell, x, y) => {
    contextMenuTableCell = cell;
    const margin = 12;
    tableContextMenu.hidden = false;
    const menuRect = tableContextMenu.getBoundingClientRect();
    const maxX = windowObject.innerWidth - menuRect.width - margin;
    const maxY = windowObject.innerHeight - menuRect.height - margin;
    tableContextMenu.style.left = `${Math.max(margin, Math.min(x, maxX))}px`;
    tableContextMenu.style.top = `${Math.max(margin, Math.min(y, maxY))}px`;
  };

  const openInsertTableDialog = () => {
    savedSelectionForTableInsert = saveEditorSelection();
    tableRowsInput.value = "3";
    tableColumnsInput.value = "3";
    showInsertTableDialog();
    windowObject.setTimeout(() => {
      tableRowsInput.focus();
      tableRowsInput.select();
    }, 0);
  };

  const confirmInsertTable = () => {
    const rows = Number.parseInt(tableRowsInput.value, 10);
    const columns = Number.parseInt(tableColumnsInput.value, 10);
    tableDialog.close();
    insertTableAtSelection(Number.isFinite(rows) ? rows : 3, Number.isFinite(columns) ? columns : 3);
  };

  return {
    focusTableCell,
    getTableCellFromSelection,
    getTableContext,
    closeTableContextMenu,
    refreshTableUi,
    isLastTableCell,
    getNextTableCell,
    insertTableRow,
    runTableAction,
    openTableContextMenu,
    openInsertTableDialog,
    confirmInsertTable
  };
};
