# Future

![License](https://img.shields.io/github/license/rxxuzi/future)

Future is a lightweight, powerful file server written in Go, featuring a sleek, modern UI inspired by Google Drive.
It provides an intuitive and visually appealing way to browse and manage your files and directories.

## Features

- **Modern UI**: Enjoy a clean, responsive interface reminiscent of Google Drive for easy file navigation and management.
- **Easy Setup**: Get up and running quickly with minimal configuration.
- **Cross-platform**: Works on Windows, macOS, and Linux.
- **Customizable**: Configure port, root directory, and other options to suit your needs.
- **Responsive Design**: Access your files from any device with a web browser.
- **File Icons**: Easily identify file types at a glance with intuitive icons.
- **Sort and Filter**: Organize your files effortlessly.
- **Lightweight**: Minimal resource usage, perfect for both personal use and small team deployments.

## Installation

1. Download the latest release for your platform from the [releases page](https://github.com/rxxuzi/future/releases).
2. Extract the downloaded archive to a directory of your choice.

## Usage

1. Open a terminal or command prompt.
2. Navigate to the directory containing the Future executable.
3. Run the following command:

```
./future
```

By default, Future will serve the current directory on port 9700.

### Command-line Options

- `-port <number>`: Specify the port number (default: 9700)
- `-root <path>`: Set the root directory to serve (default: current directory)
- `-log`: Enable request logging
- `-open`: Automatically open the default web browser after starting the server
- `-gen`: Generate a default configuration file (future.json)

Example:
```
./future -port 8080 -root /path/to/files -log -open
```

## Configuration

Future can be configured using a JSON file named `future.json`. To generate a default configuration file, run:

```
./future -gen
```

Edit the generated `future.json` file to customize your settings.

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

This project is licensed under the GPL - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the sleek design of Google Drive
- Built with love using Go