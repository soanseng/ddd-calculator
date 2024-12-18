const medications = [
    { name: 'Alprazolam', brandNames: ['Xanax', '安邦', 'Alpragin'], strengths: ['0.5 mg/tab', '1 mg/tab', '2 mg/tab'], ddd: 1, category: 'bzd' },
    { name: 'Bromazepam', brandNames: ['Lexotan', 'Bropan'], strengths: ['1.5 mg/tab', '3 mg/tab'], ddd: 10, category: 'bzd' },
    { name: 'Brotizolam', brandNames: ['Lendormin'], strengths: ['0.25 mg/tab'], ddd: 0.25, category: 'bzd' },
    { name: 'Clonazepam', brandNames: ['Rivotril','克顛平'], strengths: ['0.5 mg/tab', '2 mg/tab'], ddd: 8, category: 'bzd' },
    { name: 'Diazepam', brandNames: ['Valium'], strengths: ['2 mg/tab', '5 mg/tab'], ddd: 10, category: 'bzd' },
    { name: 'Estazolam', brandNames: ['Eszo'], strengths: ['2 mg/tab'], ddd: 3, category: 'bzd' },
    { name: 'Fludiazepam', brandNames: ['Erispan'], strengths: ['0.25 mg/tab'], ddd: 0.75, category: 'bzd' },
    { name: 'Flunitrazepam', brandNames: ['FM2', 'Modipanol','Fallep服爾眠'], strengths: ['1 mg/tab', '2 mg/tab'], ddd: 1, category: 'bzd' },
    { name: 'Flurazepam', brandNames: ['Dalmadorm','當眠多'], strengths: ['15 mg/cap', '30 mg/cap'], ddd: 30, category: 'bzd' },
    { name: 'Lorazepam', brandNames: ['Ativan', 'lowen(0.5)', 'lorazin(1)','larparm(2)'], strengths: ['0.5 mg/tab', '1 mg/tab','2 mg/tab'], ddd: 2.5, category: 'bzd' },
    { name: 'Midazolam', brandNames: ['Dormicum', '導美睡'], strengths: ['7.5 mg/tab', '15 mg/tab'], ddd: 15, category: 'bzd' },
    { name: 'Nitrazepam', brandNames: ['Sleepin', '速入眠'], strengths: ['5 mg/tab'], ddd: 5, category: 'bzd' },
    { name: 'Triazolam', brandNames: ['Halcion', '酣樂欣'], strengths: ['0.25 mg/tab'], ddd: 0.25, category: 'bzd' },
    { name: 'Zolpidem', brandNames: ['Stilnox', 'seminax'], strengths: ['10 mg/tab'], ddd: 10, category: 'z-drug' },
    { name: 'Zopiclone', brandNames: ['Imovane', 'Genclone' ], strengths: ['7.5 mg/tab'], ddd: 7.5, category: 'z-drug' }
];

let warningThreshold = 5;
let criticalThreshold = 10;

// Initialize the medication list
function initializeMedicationList() {
    const medicationTable = document.getElementById('medicationTable');
    medicationTable.innerHTML = '';
    
    const categories = {
        'bzd': 'Benzodiazepines',
        'z-drug': 'Z-drugs'
    };
    
    // Sort medications by category and name
    const sortedMeds = [...medications].sort((a, b) => {
        if (a.category !== b.category) {
            return a.category === 'bzd' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });

    let currentCategory = '';
    
    sortedMeds.forEach((med, index) => {
        // Add category header if category changes
        if (currentCategory !== med.category) {
            currentCategory = med.category;
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'bg-gray-50 px-4 py-2';
            categoryDiv.innerHTML = `
                <div class="text-sm font-semibold text-gray-700">${categories[med.category]}</div>
            `;
            medicationTable.appendChild(categoryDiv);
        }

        const medDiv = document.createElement('div');
        medDiv.className = 'p-4 space-y-3';
        medDiv.innerHTML = `
            <div class="flex flex-col gap-4">
                <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">
                        ${med.name} (${med.brandNames[0]})
                    </div>
                    ${med.brandNames.length > 1 ? 
                        `<div class="text-xs text-gray-500 mt-1">${med.brandNames.slice(1).join(', ')}</div>` 
                        : ''}
                    <div class="flex items-baseline gap-3 mt-1">
                        <div class="text-xs text-gray-500">DDD: ${med.ddd} mg/day</div>
                        <div class="text-xs font-medium">
                            Current: <span id="ddd_${index}" class="text-sm font-medium text-gray-900">0</span>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    ${med.strengths.map((strength, strengthIndex) => `
                        <div class="flex items-center gap-2">
                            <span class="text-xs text-gray-600 min-w-[80px]">${strength}:</span>
                            <input type="number" 
                                id="tablets_${index}_${strengthIndex}"
                                min="0"
                                class="text-xs w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onchange="calculateDDD(${index})"
                            >
                            <span class="text-xs text-gray-600">tablets</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        medicationTable.appendChild(medDiv);
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
