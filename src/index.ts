import path from 'node:path'
import type { ExtensionContext, StatusBarItem } from 'vscode'
import { StatusBarAlignment, commands, window, workspace } from 'vscode'
import rimraf from 'rimraf'

const DEFAULT_TEXT = 'Clean Node_modules'

async function getRunItem() {
  const folders = workspace.workspaceFolders

  if (folders) {
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
    window.showErrorMessage('There are currently no projects')
    return Promise.reject(Error('There are currently no projects'))
  }
}

async function cleanNodeModules(bar: StatusBarItem) {
  bar.text = `$(sync~spin) ${DEFAULT_TEXT}`

  try {
    const select = await getRunItem()
    const target = path.join(select.path, '**/node_modules').replace(/\\/g, '/')
    await rimraf(target, { glob: true })
  }
  catch (error) {
    window.showErrorMessage('Clean node_modules ERROR.Please clean it manually.')
  }
  finally {
    bar.text = DEFAULT_TEXT
  }
}

export function activate(context: ExtensionContext) {
  const bar = window.createStatusBarItem(StatusBarAlignment.Left, 0)

  const disposable = commands.registerCommand('extension.cleanNodeModules', () => cleanNodeModules(bar))
  context.subscriptions.push(disposable)

  bar.text = DEFAULT_TEXT
  bar.command = 'extension.cleanNodeModules'
  bar.tooltip = 'Delete node_modules in the workspace'
  bar.show()
}

export function deactivate() {

}
