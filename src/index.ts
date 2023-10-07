import path from 'node:path'
import type { ExtensionContext, StatusBarItem } from 'vscode'
import { StatusBarAlignment, commands, window } from 'vscode'
import rimraf from 'rimraf'
import { formatMs, getRunItem } from './utils'

const DEFAULT_TEXT = 'Clean Node_modules'
const COMMAND = 'extension.cleanNodeModules'

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

  const disposable = commands.registerCommand(COMMAND, async () => {
    const select = await window.showQuickPick(['YES', 'NO'], { placeHolder: 'Do you want to delete all node_modules in the workspace?' })

    if (select === 'YES')
      await cleanNodeModules(bar)
  })

  context.subscriptions.push(disposable)

  bar.text = DEFAULT_TEXT
  bar.command = COMMAND
  bar.tooltip = 'Delete node_modules in the workspace'
  bar.show()
}

export function deactivate() {

}
