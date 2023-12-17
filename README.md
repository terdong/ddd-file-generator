# DDD File Generator

This is an extension that creates directories and files based on layer architecture of DDD for each input domain.

I developed it to reduce the effort of repeating files and directories on Scala dev env.

## Features

* Create a package folder with related directories and files for DDD
![Create Domain Structure00](images/ddd_file_generator_example_01.gif)
![Create Domain Structure01](images/ddd_file_generator_example_00.gif)

<!-- Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow. -->

## Commands

| Command                                   | Title                   | Description                                                                                                                  |
| ----------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| ddd-file-generator.createDomainStructure | Create Domain Structure | A package for the entered domain name is created, and each of the four layer packages and sample files are created below it. |

## Supported Languages

* Scala

<!-- If you have any requirements or dependencies, add a section describing those and how to install and configure them. -->

<!-- ## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something. -->

## Known Issues

* Since it is created in the standard source code location of the Scala project(i.e. src/main/scala), if it is executed with a vscode command not like through the context menu, the result will be created under the path.
* Other languages may be supported in the future.

## Release Notes

### 1.0.0

Initial release to Vscode Marketplace with 1 main command

## For more information

This project is inspired by [ddd-hexagonal-generator](https://github.com/libeo-tech/ddd-hexagonal-generator) and includes part of it's code

**Enjoy!**
