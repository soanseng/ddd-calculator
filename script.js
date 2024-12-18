const medications = [
    { name: 'Alprazolam', strengths: ['0.5 mg/tab', '1 mg/tab'], ddd: 1 },
    { name: 'Bromazepam', strengths: ['3 mg/tab'], ddd: 10 },
    { name: 'Brotizolam', strengths: ['0.25 mg/tab'], ddd: 0.25 },
    { name: 'Clonazepam', strengths: ['0.5 mg/tab', '2 mg/tab'], ddd: 8 },
    { name: 'Diazepam', strengths: ['2 mg/tab', '5 mg/tab'], ddd: 10 },
    { name: 'Estazolam', strengths: ['2 mg/tab'], ddd: 3 },
    { name: 'Fludiazepam', strengths: ['0.25 mg/tab'], ddd: 0.75 },
    { name: 'Flunitrazepam', strengths: ['2 mg/tab'], ddd: 1 },
    { name: 'Flurazepam', strengths: ['15 mg/cap', '30 mg/cap'], ddd: 30 },
    { name: 'Lorazepam', strengths: ['0.5 mg/tab', '1 mg/tab'], ddd: 2.5 },
    { name: 'Nimetazepam', strengths: ['5 mg/tab'], ddd: 5 },
    { name: 'Nitrazepam', strengths: ['5 mg/tab'], ddd: 5 },
    { name: 'Nordazepam', strengths: ['5 mg/tab'], ddd: 15 },
    { name: 'Oxazolam', strengths: ['10 mg/tab'], ddd: 30 },
    { name: 'Triazolam', strengths: ['0.25 mg/tab'], ddd: 0.25 },
    { name: 'Zolpidem', strengths: ['10 mg/tab'], ddd: 10 },
    { name: 'Zopiclone', strengths: ['7.5 mg/tab'], ddd: 7.5 }
];

let warningThreshold = 5;
let criticalThreshold = 10;

// Initialize the medication list
function initializeMedicationList() {
    const medicationList = document.getElementById('medicationList');
    medicationList.innerHTML = '';

    medications.forEach((med, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${med.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <select id="strength_${index}" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    ${med.strengths.map(str => `<option value="${str}">${str}</option>`).join('')}
                </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <input type="number" id="tablets_${index}" value="0" min="0" step="0.5"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${med.ddd} mg</div>
            </td>
        `;
        medicationList.appendChild(row);

        // Add event listener for tablet input
        document.getElementById(`tablets_${index}`).addEventListener('input', calculateTotalDDD);
    });
}

// Calculate total DDD
function calculateTotalDDD() {
    let totalDDD = 0;

    medications.forEach((med, index) => {
        const tablets = parseFloat(document.getElementById(`tablets_${index}`).value) || 0;
        const strength = document.getElementById(`strength_${index}`).value;
        const strengthValue = parseFloat(strength.match(/[\d.]+/)[0]);
        
        const dailyDose = tablets * strengthValue;
        totalDDD += dailyDose / med.ddd;
    });

    // Update total DDD display
    document.getElementById('totalDDD').textContent = `Total DDD: ${totalDDD.toFixed(2)}`;

    // Check warning thresholds
    const warningDiv = document.getElementById('warning');
    const criticalDiv = document.getElementById('critical');

    warningDiv.classList.add('hidden');
    criticalDiv.classList.add('hidden');

    if (totalDDD >= criticalThreshold) {
        criticalDiv.textContent = `⚠️ Critical: Total DDD (${totalDDD.toFixed(2)}) exceeds critical threshold of ${criticalThreshold}`;
        criticalDiv.classList.remove('hidden');
    } else if (totalDDD >= warningThreshold) {
        warningDiv.textContent = `⚠️ Warning: Total DDD (${totalDDD.toFixed(2)}) exceeds warning threshold of ${warningThreshold}`;
        warningDiv.classList.remove('hidden');
    }
}

// Initialize threshold inputs
document.getElementById('warningThreshold').addEventListener('input', function() {
    warningThreshold = parseFloat(this.value) || 5;
    calculateTotalDDD();
});

document.getElementById('criticalThreshold').addEventListener('input', function() {
    criticalThreshold = parseFloat(this.value) || 10;
    calculateTotalDDD();
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeMedicationList();
    calculateTotalDDD();
});
