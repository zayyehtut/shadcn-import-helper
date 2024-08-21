# Shadcn Import Helper

Shadcn Import Helper is a Visual Studio Code extension that simplifies the process of installing [shadcn/ui](https://ui.shadcn.com/) components in your project. It scans your files for shadcn component imports and helps you install them with just a few clicks.

## Features

- Right-click on files or folders to scan for shadcn component imports
- Automatically detects uninstalled components
- Installs multiple components at once
- Configurable component folder and import detection
- Status bar item for easy access to pending component installations
- Currently supports npm for component installation (support for pnpm and Bun coming soon)

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

## Configuration

This extension contributes the following settings:

- `shadcnImportHelper.componentFolder`: Specify the folder name for shadcn components (e.g., 'ui', 'shadcn', 'custom-ui'). Default is 'shadcn'.
- `shadcnImportHelper.importRegex`: Regular expression pattern for detecting component imports. Default is `import\s*{([^}]+)}\s*from\s*["']@/components/shadcn/([^"']+)["']`.

You can modify these settings in your VS Code settings.json file or through the Settings UI.

## Requirements

- This extension requires that you have [shadcn/ui](https://ui.shadcn.com/) set up in your project.
- Make sure you have Node.js and npm installed on your system.

## Known Issues

- The extension currently doesn't support automatic installation of shadcn/ui if it's not already set up in your project.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Release Notes

### 1.0.0

Initial release of Shadcn Import Helper

---

**Enjoy!**
