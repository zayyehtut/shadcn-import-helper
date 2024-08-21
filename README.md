# Shadcn Import Helper

Shadcn Import Helper is a Visual Studio Code extension that simplifies the process of installing [shadcn/ui](https://ui.shadcn.com/) components in your project. It scans your files for shadcn component imports and helps you install them with just a few clicks.

## Features

- Right-click on files or folders to scan for shadcn component imports
- Automatically detects uninstalled components
- Installs multiple components at once
- Configurable component folders and import detection
- Dynamic update of import detection based on folder configuration
- Status bar item for easy access to pending component installations
- Supports npm, pnpm, and Bun for component installation
- Workspace-wide scanning for shadcn component imports
- Caching of installed components for improved performance

## Installation

1. Open Visual Studio Code
2. Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X on macOS)
3. Search for "Shadcn Import Helper"
4. Click Install

## Usage

1. Right-click on a file or folder in the Explorer view
2. Select "Install Shadcn Components" from the context menu
3. The extension will scan for shadcn component imports and add uninstalled components to the queue
4. Click on the status bar item to install all queued components

Alternatively, you can use the command palette (Ctrl+Shift+P or Cmd+Shift+P on macOS) and search for "Shadcn: Scan Workspace for Components" to scan your entire workspace for shadcn component imports.

## Configuration

This extension contributes the following settings:

- `shadcnImportHelper.componentFolders`: An array of folder names where shadcn components might be stored. Default is `["ui", "shadcn"]`. Changing this setting will automatically update the import detection regex.
- `shadcnImportHelper.importRegex`: Regular expression pattern for detecting component imports. This is automatically updated when `componentFolders` changes, but can be manually overridden if needed.
- `shadcnImportHelper.packageManager`: Specify the package manager to use for installing components. Options are 'npm', 'pnpm', or 'bun'. Default is 'npm'.

You can modify these settings in your VS Code settings.json file or through the Settings UI.

### Dynamic Import Detection

The extension automatically updates its import detection regex when you change the `componentFolders` setting. This means you can easily add or remove component folders without needing to manually update the regex.

For example, if you update your settings to:

```json
"shadcnImportHelper.componentFolders": ["ui", "shadcn", "custom-ui"]
```

The extension will automatically update its import detection to work with components imported from "@/components/ui/", "@/components/shadcn/", and "@/components/custom-ui/".

If you need to use a custom regex that doesn't follow this pattern, you can still manually set the `importRegex` setting, which will override the automatic behavior.

## Requirements

- This extension requires that you have [shadcn/ui](https://ui.shadcn.com/) set up in your project.
- Make sure you have Node.js and your chosen package manager (npm, pnpm, or Bun) installed on your system.

## Known Issues

- The extension currently doesn't support automatic installation of shadcn/ui if it's not already set up in your project.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Release Notes

### 1.2.0

- Implemented dynamic regex update based on component folder configuration
- Added support for multiple component folders
- Improved error handling and user feedback

### 1.1.0

- Added support for pnpm and Bun package managers
- Implemented workspace-wide scanning for shadcn components
- Improved performance with component installation caching
- Enhanced error handling and user feedback

### 1.0.0

- Initial release of Shadcn Import Helper

---

**Enjoy!**
