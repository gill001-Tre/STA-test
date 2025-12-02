// This script checks localStorage data in the browser console
// Copy and paste this into your browser console to see the data

console.log('=== CHECKING LOCALSTORAGE DATA ===\n');

const keys = [
  'must-wins-data',
  'key-activities-data',
  'sub-tasks-data',
  'strategy-pillars-assignments'
];

keys.forEach(key => {
  const data = localStorage.getItem(key);
  console.log(`\n📦 ${key}:`);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      console.log(`✅ Found - ${Array.isArray(parsed) ? parsed.length + ' items' : 'Object'}`);
      console.log(parsed);
    } catch (e) {
      console.log('❌ Error parsing:', e.message);
      console.log(data);
    }
  } else {
    console.log('❌ Not found in localStorage');
  }
});

console.log('\n\n=== SUMMARY ===');
console.log(`Total keys in localStorage: ${localStorage.length}`);
console.log('All keys:', Object.keys(localStorage));
