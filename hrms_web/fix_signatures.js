const fs = require('fs');
const path = require('path');

const files = [
  'AttendanceView.tsx',
  'EmployeesView.tsx',
  'LeavesView.tsx',
  'PayrollView.tsx',
  'ProfileView.tsx',
  'SettingsView.tsx',
  'ShiftsView.tsx'
];

for (const file of files) {
  const filePath = path.join('D:/Projects/Attendance/hrms_web/src/components/views', file);
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/export\s+default\s+function\s+(\w+)\s*\(\{\s*(.*?)\s*:\s*(\w+Props)\s*,\s*setView\s*\}\s*:\s*any\)\s*{/, 
    (match, funcName, props, propsType) => {
        return `export default function ${funcName}({ ${props}, setView }: ${propsType} & { setView?: any }) {`;
    });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed ' + file);
}
