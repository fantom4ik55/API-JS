const defaultClassesData = [
    {
        "title": "Йога",
        "time": "10:00 - 11:00",
        "maxParticipants": 15,
        "currentParticipants": 0,
        "registeredUsers": []  
    },
    {
        "title": "Пилатес",
        "time": "11:30 - 12:30",
        "maxParticipants": 12,
        "currentParticipants": 0,
        "registeredUsers": []  
    },
    {
        "title": "Силовая тренировка",
        "time": "13:00 - 14:00",
        "maxParticipants": 20,
        "currentParticipants": 0,
        "registeredUsers": [] 
    }
];
function loadParticipants() {
    const storedData = localStorage.getItem('classesData');
    return storedData ? JSON.parse(storedData) : defaultClassesData;
}

function saveParticipants(classesData) {
    localStorage.setItem('classesData', JSON.stringify(classesData));
}


function createClassCard(classItem, index) {
    const card = document.createElement('div');
    card.classList.add('card', 'p-3', 'mb-2');
    card.innerHTML = `
        <h5>${classItem.title}</h5>
        <p>Время: ${classItem.time}</p>
        <p>Максимальное количество участников: ${classItem.maxParticipants}</p>
        <p>Текущее количество записанных участников: <span id="current-${index}">${classItem.currentParticipants}</span></p>
        <div id="registration-info-${index}"></div> 
        <button id="register-${index}" class="btn btn-primary" ${classItem.currentParticipants >= classItem.maxParticipants ? 'disabled' : ''}>Записаться</button>
        <button id="cancel-${index}" class="btn btn-danger" ${classItem.currentParticipants > 0 ? '' : 'disabled'}>Отменить запись</button>
    `;
    return card;
}

function updateClassDisplay(index, classItem) {
    const currentParticipantsSpan = document.getElementById(`current-${index}`);
    const registerButton = document.getElementById(`register-${index}`);
    const cancelButton = document.getElementById(`cancel-${index}`);
    const registrationInfoDiv = document.getElementById(`registration-info-${index}`);

    if (currentParticipantsSpan) {
        currentParticipantsSpan.innerText = classItem.currentParticipants;
    }
    if (registerButton) {
        registerButton.disabled = classItem.currentParticipants >= classItem.maxParticipants;
    }
    if (cancelButton) {
        cancelButton.disabled = classItem.currentParticipants <= 0;
    }
    if (registrationInfoDiv) {
        if (classItem.registeredUsers.length > 0) {
            registrationInfoDiv.innerHTML = classItem.registeredUsers.map(user => `<p>Время записи ${user.user}: ${user.time}</p>`).join('');
        } else {
            registrationInfoDiv.innerHTML = '';
        }
    }
}



function renderClasses() {
    const classesData = loadParticipants();
    const scheduleDiv = document.getElementById('schedule');
    scheduleDiv.innerHTML = '';

    classesData.forEach((classItem, index) => {
        if (!classItem.registeredUsers) {
            classItem.registeredUsers = [];
        }

        const card = createClassCard(classItem, index);
        scheduleDiv.appendChild(card);

        const registerButton = document.getElementById(`register-${index}`);
        const cancelButton = document.getElementById(`cancel-${index}`);

        registerButton?.addEventListener('click', () => {
            const isRegistered = classItem.registeredUsers.some(user => user.user === `User ${classItem.currentParticipants + 1}`);

            if (!isRegistered && classItem.currentParticipants < classItem.maxParticipants) {
                classItem.currentParticipants++;
                const currentTime = new Date().toLocaleString();
                classItem.registeredUsers.push({ user: `User ${classItem.currentParticipants}`, time: currentTime });
                saveParticipants(classesData);
                updateClassDisplay(index, classItem);
                registerButton.disabled = true;
            }
        });

        cancelButton?.addEventListener('click', () => {
            if (classItem.registeredUsers.length > 0) {
                classItem.currentParticipants--;
                classItem.registeredUsers.pop();
                saveParticipants(classesData);
                updateClassDisplay(index, classItem);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', renderClasses);