const medications = [
    { name: 'Alprazolam', brandNames: ['Xanax', 'Niravam', 'Alpraz'], strengths: ['0.5 mg/tab', '1 mg/tab', '2 mg/tab'], ddd: 1 },
    { name: 'Bromazepam', brandNames: ['Lexotan', 'Lectopam'], strengths: ['3 mg/tab'], ddd: 10 },
    { name: 'Brotizolam', brandNames: ['Lendormin'], strengths: ['0.25 mg/tab'], ddd: 0.25 },
    { name: 'Clonazepam', brandNames: ['Klonopin', 'Rivotril'], strengths: ['0.5 mg/tab', '2 mg/tab'], ddd: 8 },
    { name: 'Diazepam', brandNames: ['Valium', 'Diastat', 'Valtoco'], strengths: ['2 mg/tab', '5 mg/tab'], ddd: 10 },
    { name: 'Estazolam', brandNames: ['ProSom'], strengths: ['2 mg/tab'], ddd: 3 },
    { name: 'Fludiazepam', brandNames: ['Erispan'], strengths: ['0.25 mg/tab'], ddd: 0.75 },
    { name: 'Flunitrazepam', brandNames: ['Rohypnol', 'Rohydorm'], strengths: ['2 mg/tab'], ddd: 1 },
    { name: 'Flurazepam', brandNames: ['Dalmane', 'Dalmadorm'], strengths: ['15 mg/cap', '30 mg/cap'], ddd: 30 },
    { name: 'Lorazepam', brandNames: ['Ativan', 'Loraz', 'Temesta'], strengths: ['0.5 mg/tab', '1 mg/tab'], ddd: 2.5 },
    { name: 'Nimetazepam', brandNames: ['Erimin'], strengths: ['5 mg/tab'], ddd: 5 },
    { name: 'Nitrazepam', brandNames: ['Mogadon', 'Alodorm', 'Insoma'], strengths: ['5 mg/tab'], ddd: 5 },
    { name: 'Nordazepam', brandNames: ['Nordaz', 'Madar'], strengths: ['5 mg/tab'], ddd: 15 },
    { name: 'Oxazolam', brandNames: ['Serenal'], strengths: ['10 mg/tab'], ddd: 30 },
    { name: 'Triazolam', brandNames: ['Halcion', 'Apo-Triazo'], strengths: ['0.25 mg/tab'], ddd: 0.25 },
    { name: 'Zolpidem', brandNames: ['Ambien', 'Stilnox', 'Sublinox'], strengths: ['10 mg/tab'], ddd: 10 },
    { name: 'Zopiclone', brandNames: ['Imovane', 'Zimovane'], strengths: ['7.5 mg/tab'], ddd: 7.5 }
];

let warningThreshold = 5;
let criticalThreshold = 10;

// Initialize the medication list
function initializeMedicationList() {
    const tbody = document.querySelector('#medicationTable tbody');
    tbody.innerHTML = '';
    
    medications.forEach((med, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                <div class="text-xs sm:text-sm font-medium text-gray-900">
                    ${med.name} (${med.brandNames[0]})
                    ${med.brandNames.length > 1 ? 
                        `<div class="text-xs text-gray-500 mt-0.5">${med.brandNames.slice(1).join(', ')}</div>` 
                        : ''}
                </div>
            </td>
            <td class="px-2 sm:px-6 py-2 sm:py-4">
                <div class="space-y-2">
                    ${med.strengths.map((strength, strengthIndex) => `
                        <div class="flex items-center space-x-2">
                            <span class="text-xs sm:text-sm text-gray-600">${strength}:</span>
                            <input type="number" 
                                id="tablets_${index}_${strengthIndex}"
                                min="0"
                                class="text-xs sm:text-sm w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onchange="calculateDDD(${index})"
                            >
                            <span class="text-xs sm:text-sm text-gray-600">tablets</span>
                        </div>
                    `).join('')}
                </div>
            </td>
            <td class="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                <span id="ddd_${index}" class="text-xs sm:text-sm text-gray-900">0</span>
            </td>`;
        tbody.appendChild(row);
    });
}

function calculateDDD(index) {
    const med = medications[index];
    let totalAmount = 0;
    
    med.strengths.forEach((strength, strengthIndex) => {
        const tablets = parseFloat(document.getElementById(`tablets_${index}_${strengthIndex}`).value) || 0;
        const strengthValue = parseFloat(strength.match(/[\d.]+/)[0]);
        totalAmount += tablets * strengthValue;
    });
    
    const dddValue = totalAmount / med.ddd;
    const dddElement = document.getElementById(`ddd_${index}`);
    dddElement.textContent = dddValue.toFixed(2);
    
    // Update color based on warning threshold
    if (dddValue > warningThreshold) {
        dddElement.classList.add('text-red-600', 'font-bold');
    } else {
        dddElement.classList.remove('text-red-600', 'font-bold');
    }

    // Calculate total DDD
    calculateTotalDDD();
}

function calculateTotalDDD() {
    let totalDDD = 0;
    
    medications.forEach((med, index) => {
        let medicationAmount = 0;
        med.strengths.forEach((strength, strengthIndex) => {
            const tablets = parseFloat(document.getElementById(`tablets_${index}_${strengthIndex}`).value) || 0;
            const strengthValue = parseFloat(strength.match(/[\d.]+/)[0]);
            medicationAmount += tablets * strengthValue;
        });
        totalDDD += medicationAmount / med.ddd;
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
});

document.getElementById('criticalThreshold').addEventListener('input', function() {
    criticalThreshold = parseFloat(this.value) || 10;
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeMedicationList();
});
