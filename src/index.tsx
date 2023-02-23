import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


(window as any).MonacoEnvironment = {
	getWorkerUrl: function (_moduleId, label) {
		switch (label) {
			case 'json': {
				return './json.worker.js';
			}
			default: {
				return './editor.worker.js';
			}
		}
	}
};


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);

reportWebVitals();
