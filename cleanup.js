const fs = require('fs');
const path = require('path');

const replacements = [
  { file: 'src/app/(dashboard)/map/page.tsx', 
    target: 'Initializing Command Center Map...', 
    replace: 'Loading Map...' },
  { file: 'src/components/MapClient.tsx', 
    target: 'Live Filters', 
    replace: 'Filters' },
  { file: 'src/app/(dashboard)/tasks/page.tsx', 
    target: 'Dispatch Pipeline', 
    replace: 'Tasks' },
  { file: 'src/app/(dashboard)/tasks/page.tsx', 
    target: 'Real-time status of all active operations', 
    replace: 'Manage and view all tasks.' },
  { file: 'src/app/(dashboard)/volunteers/page.tsx', 
    target: 'Volunteer Registry', 
    replace: 'Volunteers' },
  { file: 'src/app/(dashboard)/volunteers/page.tsx', 
    target: 'Manage field ops and team availability', 
    replace: 'Manage all active volunteers.' },
  { file: 'src/app/(dashboard)/analytics/page.tsx', 
    target: 'Intelligence Dashboard', 
    replace: 'Analytics' },
  { file: 'src/app/(dashboard)/analytics/page.tsx', 
    target: 'Real-time macro analytics of operation readiness', 
    replace: 'Overview of system statistics.' },
  { file: 'src/app/(dashboard)/submit-report/page.tsx', 
    target: 'Field Intel Report', 
    replace: 'Submit Report' },
  { file: 'src/app/(dashboard)/submit-report/page.tsx', 
    target: 'Submit new exigency directly to Command Center', 
    replace: 'Create a new report.' },
  { file: 'src/app/(dashboard)/submit-report/page.tsx', 
    target: 'Submit Intelligence', 
    replace: 'Submit' },
  { file: 'src/app/(dashboard)/submit-report/page.tsx', 
    target: 'Uplinking...', 
    replace: 'Submitting...' },
  { file: 'src/app/(dashboard)/submit-report/page.tsx', 
    target: 'Report Transmitted', 
    replace: 'Report Submitted' },
  { file: 'src/app/(dashboard)/submit-report/page.tsx', 
    target: 'Command Center has been notified.', 
    replace: 'Your report has been received.' },
  { file: 'src/app/(dashboard)/my-tasks/page.tsx', 
    target: 'Active Deployments', 
    replace: 'My Tasks' },
  { file: 'src/app/(dashboard)/my-tasks/page.tsx', 
    target: 'Your current field assignments', 
    replace: 'Tasks assigned to you.' },
  { file: 'src/app/(dashboard)/my-tasks/page.tsx', 
    target: 'Take a break or stand by for new assignments from the command center.', 
    replace: 'You have no active tasks currently.' },
  { file: 'src/app/(dashboard)/my-profile/page.tsx', 
    target: 'Operator Profile', 
    replace: 'Profile' },
  { file: 'src/app/(dashboard)/my-profile/page.tsx', 
    target: 'Operator Name', 
    replace: 'Full Name' },
  { file: 'src/app/(dashboard)/my-profile/page.tsx', 
    target: 'Deployments', 
    replace: 'Tasks Completed' },
  { file: 'src/app/(dashboard)/my-profile/page.tsx', 
    target: 'Acquire GPS Lock', 
    replace: 'Update GPS' },
  { file: 'src/app/(dashboard)/my-profile/page.tsx', 
    target: 'Live Fleet Location', 
    replace: 'Current Location' }
];

replacements.forEach(({ file, target, replace }) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(new RegExp(target, 'g'), replace);
    fs.writeFileSync(filePath, content);
  }
});
console.log('Replacements complete');
