import { assertFalse } from "@renderer/utilities/assertion";
import { RootState } from "../store";
import { SynchronisationQueue } from "../../utilities/SynchronisationQueue";

const QUEUE = new SynchronisationQueue();
const BATCH_SIZE = 32;
const PATH_SEPARATOR = "\\";

export function getSelectedItem(state: RootState, columnIndex: number): Purpl.Item {
  const selectedItem_rowIndex = getSelectedItem_rowIndex(state, columnIndex);
  const selectedItem_columnIndex = columnIndex;

  return state.items.allItems[selectedItem_columnIndex][selectedItem_rowIndex];
}

export function getActiveItem(state: RootState): Purpl.Item {
  const activeItem_rowIndex = getActiveItem_rowIndex(state);
  const activeItem_columnIndex = getActiveItem_columnIndex(state);

  return state.items.allItems[activeItem_columnIndex][activeItem_rowIndex];
}

export function getItemName(item: Purpl.Item): string | undefined {
  if (item === undefined) {
    return undefined;
  } else {
    return item.name;
  }
}

export function getPathSegments_activeItem(state: RootState): (string | undefined)[] {
  const pathSegments: (string | undefined)[] = [];

  for (let i = 0; i < state.items.indices.length; i++) {
    const selectedItem = getSelectedItem(state, i);
    const selectedItemName = getItemName(selectedItem);
    pathSegments.push(selectedItemName);
  }

  return pathSegments;
}

export function getPathSegments_directoryOfActiveItem(state: RootState): string[] {
  const activeItem_columnIndex = getActiveItem_columnIndex(state);
  return getPathSegments_directoryOf(state, activeItem_columnIndex);
}

export function getPathSegments_nodejsDirname(): string[] {
  const currentDirectory: string = window.api.sendSync("GET_NODEJS_DIRNAME", null);
  const pathSegments = currentDirectory.split(PATH_SEPARATOR);
  return pathSegments;
}

export function getPathSegments_directoryOf(state: RootState, columnIndex): (string | undefined)[] {
  const pathSegments: (string | undefined)[] = [];

  for (let i = 0; i < columnIndex; i++) {
    const selectedItem = getSelectedItem(state, i);
    const selectedItemName = getItemName(selectedItem);
    pathSegments.push(selectedItemName);
  }

  return pathSegments;
}

export function getFullPath(pathSegments: string[]): string {
  return pathSegments.length === 1
    ? pathSegments[0] + PATH_SEPARATOR
    : pathSegments.join(PATH_SEPARATOR);
}

export async function isFolder(fullPath: string): Promise<boolean> {
  return await window.api.invoke("IS_FOLDER", fullPath);
}

export function isFolder_activeItem(state: RootState): boolean {
  const activeItem = getActiveItem(state);
  return activeItem.isFolder;
}

export async function getDirectoryContents(folderPath: string): Promise<string[]> {
  return await window.api.invoke("GET_DIRECTORY_CONTENTS", folderPath);
}

export async function createItem(
  folderPath: string,
  name: string
): Promise<Purpl.Item | undefined> {
  const fullPath = folderPath + PATH_SEPARATOR + name;
  const _isFolder = await isFolder(fullPath);

  if (_isFolder === undefined) {
    // `fs.stat` failed due to EPERM or EBUSY or EACCES
    return undefined;
  }

  if (_isFolder === true) {
    const dummyDirectoryContents = await getDirectoryContents(fullPath);

    if (dummyDirectoryContents === undefined) {
      // `fs.readdir` failed due to EPERM or EBUSY or EACCES
      return undefined;
    }
  }

  const item: Purpl.Item = {
    name: name,
    isFolder: _isFolder
  };

  return item;
}

export async function getItemsSync(pathSegments: string[]): Promise<Purpl.Item[]> {
  const fullPath = getFullPath(pathSegments);
  const _isFolder = await isFolder(fullPath);

  if (_isFolder === undefined) {
    throw new Error("`_isFolder` is `undefined`");
  }

  if (_isFolder === false) {
    return [SPECIAL_FILE_STRING];
  }

  const folderPath = fullPath;
  const directoryContents = await getDirectoryContents(folderPath);

  const promises_items = directoryContents.map(async (name) => createItem(folderPath, name));

  const items = (await Promise.all(promises_items)).filter((item) => item !== undefined);

  return sortItems(items);
}

export async function getItems(pathSegments: string[]): Promise<Purpl.Item[]> {
  const ticket = QUEUE.generateTicket();

  QUEUE.enqueue(ticket);
  await QUEUE.waitTillMyTurn(ticket);

  const fullPath = getFullPath(pathSegments);
  const _isFolder = await isFolder(fullPath);

  if (_isFolder === undefined) {
    throw new Error("`_isFolder` is `undefined`");
  }

  if (_isFolder === false) {
    QUEUE.dequeue(ticket);
    return [SPECIAL_FILE_STRING];
  }

  const folderPath = fullPath;
  const directoryContents = await getDirectoryContents(folderPath);

  const items: Purpl.Item[] = [];

  for (let i = 0; i < directoryContents.length; i += BATCH_SIZE) {
    if (QUEUE.isAborted(ticket)) {
      QUEUE.dequeue(ticket);
      return [SPECIAL_LOADING_STRING];
    }

    const miniDirectoryContents = directoryContents.slice(i, i + BATCH_SIZE);

    const promises_miniItems = miniDirectoryContents.map(async (name) =>
      createItem(folderPath, name)
    );

    const miniItems = await Promise.all(promises_miniItems);
    const filteredMiniItems: Purpl.Item[] = miniItems.filter(
      (item): item is Purpl.Item => item !== undefined
    );

    items.push(...filteredMiniItems);
    await sleep(0);
  }

  QUEUE.dequeue(ticket);
  return sortItems(items);
}

export async function getAllItems(pathSegments: string[]): Promise<Purpl.Item[][]> {
  const promises_allItems = pathSegments.map(async (_, i) => {
    const miniPathSegments = pathSegments.slice(0, i + 1);
    const items = getItemsSync(miniPathSegments);

    return items;
  });

  const allItems = await Promise.all(promises_allItems);

  // add back root directory "C:" at the front
  const rootDirectoryItem = {
    name: pathSegments[0],
    isFolder: true
  };

  allItems.unshift([rootDirectoryItem]);
  return allItems;
}

export function getSelectedItem_rowIndex(state: RootState, columnIndex: number): number {
  const indices = state.items.indices;
  const selectedItem_rowIndex = indices[columnIndex];
  return selectedItem_rowIndex;
}

export function getActiveItem_rowIndex(state: RootState): number {
  const indices = state.items.indices;
  const activeItem_rowIndex = indices.at(-1);

  assertFalse(() => activeItem_rowIndex === undefined);

  return activeItem_rowIndex;
}

export function getActiveItem_columnIndex(state: RootState): number {
  const indices = state.items.indices;
  const activeItem_columnIndex = indices.length - 1;
  return activeItem_columnIndex;
}

export function getPreviewColumnItems(state: RootState): Purpl.Item[] {
  return state.items.allItems[state.items.indices.length];
}

export function getNumberOfValidColumns(allItems: Purpl.Item[][]): number {
  const array_isValidColumn = allItems.map(
    (items) =>
      !isColumn(items, SPECIAL_FILE_STRING) &&
      !isColumn(items, SPECIAL_BLANK_STRING) &&
      !isColumn(items, SPECIAL_LOADING_STRING)
  );

  const count = array_isValidColumn.filter((b) => b === true).length;
  return count;
}

export function isColumn(items: Purpl.Item[], SPECIAL_STRING): boolean {
  return items[0] === SPECIAL_STRING;
}

export function sortItems(items: Purpl.Item[]): Purpl.Item[] {
  const folderItems: Purpl.Item[] = [];
  const fileItems: Purpl.Item[] = [];

  for (const item of items) {
    if (item.isFolder) {
      folderItems.push(item);
    } else {
      fileItems.push(item);
    }
  }

  return [...folderItems, ...fileItems];
}
