import path from 'node:path'
import type { ExtensionContext, StatusBarItem } from 'vscode'
import { StatusBarAlignment, commands, window } from 'vscode'
import rimraf from 'rimraf'
import { formatMs, getRunItem } from './utils'

const DEFAULT_TEXT = 'Clean Node_modules'

async function cleanNodeModules(bar: StatusBarItem) {
  const select = await getRunItem()
  bar.text = `$(sync~spin) ${DEFAULT_TEXT}`

  try {
    const startTime = Date.now()
    const target = path.join(select.path, '**/node_modules').replace(/\\/g, '/')
    await rimraf(target, { glob: true })
    // eslint-disable-next-line no-console
    console.log(`Finish: ${formatMs(Date.now() - startTime)}`)
  }
  catch (error) {
    window.showErrorMessage('Delete failed. Check if the project is running?')
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
