const vscode = require('vscode');
const axios = require('axios');

async function createGist(content) {
	const token = "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";
	
	if (!token) {
	  throw new Error('GitHub token is missing. Please provide a valid token in the .env file.');
	}
  
	const response = await axios.post('https://api.github.com/gists', {
	  files: {
		'code.js': {
		  content,
		},
	  },
	  public: false,
	}, {
	  headers: {
		Authorization: `Bearer ${token}`,
	  },
	});
  
	return response.data.html_url;
}

function activate(context) {
	console.log('Расширение "VS Code Gist" активировано.');

  // Команда для публикации выделенного текста на Gist
  let disposable = vscode.commands.registerCommand('github-gist-poster.postToGist', async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const selectedText = editor.document.getText(editor.selection);

      if (selectedText) {
        try {
          const gistUrl = await createGist(selectedText);
          vscode.window.showInformationMessage(`Gist создан: ${gistUrl}`);
        } catch (error) {
          vscode.window.showErrorMessage(`Ошибка при создании Gist: ${error.message}`);
        }
      } else {
        vscode.window.showWarningMessage('Не выделен текст для создания Gist.');
      }
    } else {
      vscode.window.showWarningMessage('Откройте файл, чтобы использовать это расширение.');
    }
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
