import {removeDirAndFiles} from './files';
import {getSaveDirPath} from './paths';
import {restartApp} from './utils';

export async function reset() {
  removeSaveDirIfAvail();
  clearLocalStorage();
  restartApp();
}

export function clearLocalStorage() {
  localStorage.clear();
}

export async function removeSaveDirIfAvail() {
  const saveDir = getSaveDirPath();
  await removeDirAndFiles(saveDir);
}