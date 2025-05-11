const bookings = [];
const rooms = {
    Single: 10,
    Double: 8,
    Suite: 5
};

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    const targetSection = document.getElementById(sectionId);
    targetSection.classList.remove('hidden');
    window.scrollTo({ top: targetSection.offsetTop - 100, behavior: 'smooth' });
}

// Booking Form Submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const guestName = document.getElementById('guestName').value;
    const guestEmail = document.getElementById('guestEmail').value;
    const roomType = document.querySelector('input[name="roomType"]:checked')?.value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;

    if (!roomType) {
        alert('Please select a room type.');
        return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
        alert('Check-out date must be after check-in date.');
        return;
    }

    bookings.push({ guestName, guestEmail, roomType, checkIn, checkOut });
    const message = document.getElementById('bookingMessage');
    message.classList.remove('hidden');
    setTimeout(() => message.classList.add('hidden'), 4000);
    this.reset();
    updateAdminDashboard();
});

// Availability Form Submission
document.getElementById('availabilityForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const checkIn = document.getElementById('availCheckIn').value;
    const checkOut = document.getElementById('availCheckOut').value;

    if (new Date(checkOut) <= new Date(checkIn)) {
        alert('Check-out date must be after check-in date.');
        return;
    }

    const result = checkAvailability(checkIn, checkOut);
    document.getElementById('availabilityResult').innerHTML = `
        <h3 class="text-xl font-semibold mb-4">Available Rooms</h3>
        <p class="text-lg">Single: ${result.Single}</p>
        <p class="text-lg">Double: ${result.Double}</p>
        <p class="text-lg">Suite: ${result.Suite}</p>
    `;
});

// Check Room Availability
function checkAvailability(checkIn, checkOut) {
    const availableRooms = { ...rooms };
    bookings.forEach(booking => {
        const bookingCheckIn = new Date(booking.checkIn);
        const bookingCheckOut = new Date(booking.checkOut);
        const queryCheckIn = new Date(checkIn);
        const queryCheckOut = new Date(checkOut);

        if (
            (queryCheckIn >= bookingCheckIn && queryCheckIn < bookingCheckOut) ||
            (queryCheckOut > bookingCheckIn && queryCheckOut <= bookingCheckOut) ||
            (queryCheckIn <= bookingCheckIn && queryCheckOut >= bookingCheckOut)
        ) {
            availableRooms[booking.roomType]--;
        }
    });
    return availableRooms;
}

// Update Admin Dashboard
function updateAdminDashboard() {
    const tbody = document.getElementById('bookingsBody');
    tbody.innerHTML = '';
    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-4">${booking.guestName}</td>
            <td class="p-4">${booking.guestEmail}</td>
            <td class="p-4">${booking.roomType}</td>
            <td class="p-4">${booking.checkIn}</td>
            <td class="p-4">${booking.checkOut}</td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize Home Section
showSection('home');