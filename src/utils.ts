import { window, workspace } from 'vscode'

// @vuepress/utils code
export function formatMs(ms: number): string {
  if (ms < 1000)
    return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

export async function getRunItem() {
  const folders = workspace.workspaceFolders

  if (Array.isArray(folders) && folders.length > 0) {
    if (folders.length > 1) {
      const projects = folders.map(el => ({ path: el.uri.fsPath, label: el.name }))
      const select = await window.showQuickPick(projects, { placeHolder: 'Select the project you want to start' })
      if (select)
        return select
      else
        return Promise.reject(Error('Cancel'))
    }
    else {
      return { path: folders[0].uri.fsPath, label: folders[0].name }
    }
  }
  else {
    window.showInformationMessage('There are currently no projects')
    return Promise.reject(Error('There are currently no projects'))
  }
}
