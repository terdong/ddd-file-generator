// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
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

const basicPath = 'src/main/scala/'

const makeLayer = (rootDir: vscode.Uri, rootPackageName: string, domainName: string) => async (layer: Layer): Promise<vscode.Uri> => {
	const layerIndex = layer.valueOf()
	const layerName = Object.values(LayerNames)[layerIndex]
	const layerSuffix = Object.values(LayerFileSuffix)[layerIndex]
	const layerDir = await FileUtils.createDirectory(rootDir, layerName)
	const fileName = `${domainName}${layerSuffix}`
	return await FileUtils.createFileWithContent(layerDir, `${fileName}.scala`, stringToUintArray(getCommonSnippet(`${rootPackageName}.${layerName}`, fileName)))
}

async function onCreateDomainStructure(uri: vscode.Uri) {
	const domainName = await vscode.window.showInputBox({ title: "Domain Name", prompt: "As you enter a domain name, files and directories are created accrding to a simple DDD layer rule", placeHolder: "Enter a domain name" })
	const selectedUri = uri ? uri : vscode.workspace.workspaceFolders?.[0].uri
	if (domainName && selectedUri) {
		let rootPath = selectedUri.path
		let targetPath = ''
		if (!rootPath.includes(basicPath)) {
			targetPath = basicPath
		}

		// console.log(`domainName:${domainName}, root:${selectedUri.fsPath}`)
		const rootFolder = await FileUtils.createDirectory(selectedUri, targetPath.concat(toSnakeCase(domainName)))
		const rootPackageName = rootFolder.path.split(basicPath)[1].replaceAll('/', '.')
		const domainNameAsPascalCase = toPascalCase(domainName)

		const curriedMakeLayer = makeLayer(rootFolder, rootPackageName, domainNameAsPascalCase)

		const controllerFile = await curriedMakeLayer(Layer.presentation)
		const serviceFile = await curriedMakeLayer(Layer.application)
		const domainFile = await curriedMakeLayer(Layer.domain)
		const repositoryFile = await curriedMakeLayer(Layer.infrastructure)

		FileUtils.openFile([controllerFile, serviceFile, domainFile, repositoryFile])
		vscode.window.showInformationMessage(`${domainNameAsPascalCase} Layer Created!`)
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ddd-basic-generator" is now active!');

	const createDomainStructure = vscode.commands.registerCommand('ddd-basic-generator.createDomainStructure', onCreateDomainStructure)

	context.subscriptions.push(createDomainStructure);
}
