const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'src', 'components', 'views');
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('View.tsx') && f !== 'ReportsView.tsx' && f !== 'DashboardView.tsx');

for (const file of files) {
  const filePath = path.join(viewsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('RefreshData')) continue;
  if (content.includes('ArrowLeft') && content.includes('RefreshCw')) continue;

  // Add lucide icons
  if (content.includes('lucide-react')) {
      content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]lucide-react['"]/, (match, p1) => {
          if (!p1.includes('ArrowLeft')) {
             return `import { ${p1.trim()}, ArrowLeft, RefreshCw } from 'lucide-react'`;
          }
          return match;
      });
  }

  // Add setView
  content = content.replace(/export\s+default\s+function\s+(\w+)\s*\(([^)]*)\)\s*{/, (match, funcName, props) => {
      if (props.trim() === '') {
          return `export default function ${funcName}({ setView }: any) {`;
      } else if (!props.includes('setView')) {
          return `export default function ${funcName}({ ${props.replace(/{\s*|}/g, '')}, setView }: any) {`;
      }
      return match;
  });

  // Replace Header
  const headerRegex = /({\/\*\s*Header\s*\*\/}\s*)<div[^>]*>\s*<h2([^>]*)>(.*?)<\/h2>\s*(<p[^>]*>.*?<\/p>)?\s*<\/div>/g;
  
  content = content.replace(headerRegex, (match, comment, h2Attrs, title, pTag) => {
      return `${comment}<div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {setView && (
            <button
              onClick={() => setView('dashboard')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-700 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h2${h2Attrs}>${title}</h2>
            ${pTag || ''}
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Refresh Data"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>`;
  });

  const headerRegexWithButton = /({\/\*\s*Header\s*\*\/}\s*)<div className="flex items-center justify-between[^>]*>\s*<div>\s*<h2([^>]*)>(.*?)<\/h2>\s*(<p[^>]*>.*?<\/p>)?\s*<\/div>\s*([\s\S]*?)<\/div>/;
  if (!content.includes('Back to Dashboard')) {
      content = content.replace(headerRegexWithButton, (match, comment, h2Attrs, title, pTag, innerHtml) => {
          return `${comment}<div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {setView && (
            <button
              onClick={() => setView('dashboard')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-700 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h2${h2Attrs}>${title}</h2>
            ${pTag || ''}
          </div>
        </div>
        <div className="flex items-center gap-3">
          ${innerHtml.trim()}
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            title="Refresh Data"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>`;
      });
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + file);
}
