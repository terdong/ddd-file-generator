// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import fs from 'fs';
import path from 'path';
import * as vscode from 'vscode';
import * as FileUtils from './file-utils';
import { getCommonSnippet } from './snippets';
import { stringToUintArray, toPascalCase, toSnakeCase } from './utils/string-manipulation';

enum Layer {
	presentation, application, domain, infrastructure
}

enum LayerNames {
	presentation = "la1_presentation",
	application = "la2_application",
	domain = "la3_domain",
	infrastructure = "la4_infrastructure"
}

enum LayerFileSuffix {
	presentation = "Controller",
	application = "Service",
	domain = "",
	infrastructure = "Repository"
}

const makeLayer = (rootDir: vscode.Uri, rootPackageName: string, domainName: string, shouldCreateFile: boolean) => async (layer: Layer, configedLayerName: string): Promise<vscode.Uri> => {
	const layerIndex = layer.valueOf()
	const layerName = configedLayerName.length > 0 ? configedLayerName : Object.values(LayerNames)[layerIndex]
	const layerSuffix = Object.values(LayerFileSuffix)[layerIndex]
	const layerDir = await FileUtils.createDirectory(rootDir, layerName)
	if (shouldCreateFile) {
		const fileName = `${domainName}${layerSuffix}`
		return await FileUtils.createFileWithContent(layerDir, `${fileName}.scala`, stringToUintArray(getCommonSnippet(`${rootPackageName}.${layerName}`, fileName)))
	} else {
		return layerDir
	}
}

const onCreateDDDStructure = (shouldCreateFile: boolean) => async (uri: vscode.Uri) => {
	const domainName = await vscode.window.showInputBox({ title: "Domain Name", prompt: "As you enter a domain name, files and directories are created accrding to a simple DDD layer rule", placeHolder: "Enter a domain name" })
	const selectedUri = uri ? uri : vscode.window.activeTextEditor != null ? vscode.window.activeTextEditor.document.uri : vscode.workspace.workspaceFolders?.[0].uri

	if (domainName && selectedUri) {
		const isFile = fs.lstatSync(selectedUri.fsPath).isFile()
		const targetUri = isFile ? vscode.Uri.parse(path.dirname(selectedUri.path)) : selectedUri

		const config = vscode.workspace.getConfiguration('ddd-file-generator')
		// This code is deprecated. Because of adding related command in config.
		/* const shouldCreateFile = config.get<boolean>('createEachFilesOnLayers') ?? false
		"ddd-file-generator.createEachFilesOnLayers": {
			"type": "boolean",
			"default": true,
			"description": "Creates each files When a directory is created."
		} */
		const defaultPath = config.get<string>('defaultRootPath') ?? 'src/main/scala/'

		let rootPath = targetUri.path
		let targetPath = ''
		if (!rootPath.concat('/').includes(defaultPath)) {
			targetPath = defaultPath
		}
		// console.log(`domainName:${domainName}, root:${selectedUri.fsPath}`)
		const rootFolder = await FileUtils.createDirectory(targetUri, targetPath.concat(toSnakeCase(domainName)))
		const rootPackageName = rootFolder.path.split(defaultPath)[1].replaceAll('/', '.')
		const domainNameAsPascalCase = toPascalCase(domainName)

		const curriedMakeLayer = makeLayer(rootFolder, rootPackageName, domainNameAsPascalCase, shouldCreateFile)
		const controllerFile = await curriedMakeLayer(Layer.presentation, config.get<string>('layerPresentation') ?? '')
		const serviceFile = await curriedMakeLayer(Layer.application, config.get<string>('layerApplication') ?? '')
		const domainFile = await curriedMakeLayer(Layer.domain, config.get<string>('layerDomain') ?? '')
		const repositoryFile = await curriedMakeLayer(Layer.infrastructure, config.get<string>('layerInfrastructure') ?? '')

		if (shouldCreateFile) {
			FileUtils.openFile([controllerFile, serviceFile, domainFile, repositoryFile])
		}
		vscode.window.showInformationMessage(`${domainNameAsPascalCase} Layer Created!`)
	} else {
		vscode.window.showErrorMessage(`Can not create files.Please check the workspace path`);
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "ddd-basic-generator" is now active!');
	const createDDDStructure = vscode.commands.registerCommand('ddd-file-generator.createDDDStructure', onCreateDDDStructure(true))
	const createDDDStructureWithoutFiles = vscode.commands.registerCommand('ddd-file-generator.createDDDStructureWithoutFiles', onCreateDDDStructure(false))

	context.subscriptions.push(createDDDStructure, createDDDStructureWithoutFiles);
}
