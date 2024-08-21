import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

interface ShadcnConfig {
  componentFolder: string;
  importRegex: string;
}

function getConfig(): ShadcnConfig {
  const config = vscode.workspace.getConfiguration("shadcnImportHelper");
  return {
    componentFolder: config.get("componentFolder", "shadcn"),
    importRegex: config.get(
      "importRegex",
      "import\\s*{([^}]+)}\\s*from\\s*[\"']@/components/shadcn/([^\"']+)[\"']"
    ),
  };
}

class ComponentManager {
  private pendingComponents: Set<string> = new Set();
  private statusBarItem: vscode.StatusBarItem;
  private isInstalling: boolean = false;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = "extension.installPendingShadcnComponents";
    this.updateStatusBarItem();
  }

  public addComponent(component: string) {
    this.pendingComponents.add(component);
    this.updateStatusBarItem();
  }

  private updateStatusBarItem() {
    if (this.pendingComponents.size > 0) {
      this.statusBarItem.text = `$(cloud-download) Install ${this.pendingComponents.size} shadcn component(s)`;
      this.statusBarItem.show();
    } else {
      this.statusBarItem.hide();
    }
  }

  public async installPendingComponents() {
    if (this.pendingComponents.size === 0) {
      vscode.window.showInformationMessage(
        "No pending shadcn components to install."
      );
      return;
    }

    if (this.isInstalling) {
      vscode.window.showInformationMessage(
        "Component installation is already in progress."
      );
      return;
    }

    this.isInstalling = true;
    const components = Array.from(this.pendingComponents).join(" ");
    await this.installComponents(components);
    this.pendingComponents.clear();
    this.updateStatusBarItem();
    this.isInstalling = false;
  }

  private async installComponents(components: string) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      throw new Error("No workspace folder found");
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const config = getConfig();
    const componentPath = path.join("components", config.componentFolder);

    const terminal = vscode.window.createTerminal("Shadcn Installer");
    terminal.show();

    terminal.sendText(
      `cd "${rootPath}" && npx shadcn-ui@latest add ${components} --path ${componentPath}`
    );

    await vscode.window.showInformationMessage(
      `Installing components: ${components} in ${componentPath}. Please check the terminal for any prompts.`,
      "OK"
    );
  }
}

const componentManager = new ComponentManager();

async function isComponentInstalled(componentName: string): Promise<boolean> {
  const config = getConfig();
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) return false;

  const rootPath = workspaceFolders[0].uri;
  const componentPath = vscode.Uri.joinPath(
    rootPath,
    "components",
    config.componentFolder,
    `${componentName}.tsx`
  );

  try {
    await vscode.workspace.fs.stat(componentPath);
    return true;
  } catch {
    return false;
  }
}

function parseImports(document: vscode.TextDocument): string[] {
  const config = getConfig();
  const text = document.getText();
  const importRegex = new RegExp(config.importRegex, "g");
  const components: string[] = [];

  let match;
  while ((match = importRegex.exec(text)) !== null) {
    const importedComponents = match[1].split(",").map((c) => c.trim());
    const componentFile = match[2];
    components.push(...importedComponents.map((c) => componentFile));
  }

  return [...new Set(components)]; // Remove duplicates
}

async function scanDirectory(uri: vscode.Uri): Promise<string[]> {
  const components: string[] = [];
  const entries = await vscode.workspace.fs.readDirectory(uri);

  for (const [name, type] of entries) {
    if (type === vscode.FileType.File && name.endsWith(".tsx")) {
      const filePath = vscode.Uri.joinPath(uri, name);
      const document = await vscode.workspace.openTextDocument(filePath);
      components.push(...parseImports(document));
    } else if (type === vscode.FileType.Directory) {
      const subDirUri = vscode.Uri.joinPath(uri, name);
      components.push(...(await scanDirectory(subDirUri)));
    }
  }

  return [...new Set(components)]; // Remove duplicates
}

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "shadcn-import-helper" is now active!'
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.installPendingShadcnComponents",
      () => {
        componentManager.installPendingComponents();
      }
    )
  );

  let disposable = vscode.commands.registerCommand(
    "extension.installShadcnComponents",
    async (uri: vscode.Uri) => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage(
          "No workspace folder found. Please open a project folder."
        );
        return;
      }

      const rootPath = workspaceFolders[0].uri.fsPath;
      const componentsJsonPath = path.join(rootPath, "components.json");

      if (!fs.existsSync(componentsJsonPath)) {
        const result = await vscode.window.showWarningMessage(
          "shadcn-ui does not appear to be initialized in this project. Would you like to initialize it?",
          "Yes",
          "No"
        );

        if (result === "Yes") {
          const terminal = vscode.window.createTerminal("Shadcn Initializer");
          terminal.show();
          terminal.sendText(`cd "${rootPath}" && npx shadcn-ui@latest init`);
          await vscode.window.showInformationMessage(
            "Please complete the shadcn-ui initialization in the terminal, then run this command again."
          );
          return;
        } else {
          return;
        }
      }

      if (uri && uri.scheme === "file") {
        const stat = await vscode.workspace.fs.stat(uri);
        let components: string[] = [];

        if (stat.type === vscode.FileType.Directory) {
          components = await scanDirectory(uri);
        } else {
          const document = await vscode.workspace.openTextDocument(uri);
          components = parseImports(document);
        }

        for (const component of components) {
          if (!(await isComponentInstalled(component))) {
            componentManager.addComponent(component);
          }
        }

        if (components.length > 0) {
          vscode.window.showInformationMessage(
            "Components added to installation queue. Click the status bar item to install."
          );
        } else {
          vscode.window.showInformationMessage(
            "No new shadcn components found to install."
          );
        }
      } else {
        vscode.window.showErrorMessage(
          "Please right-click on a file or folder in the Explorer view."
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
