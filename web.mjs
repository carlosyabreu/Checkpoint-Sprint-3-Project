import {
    getDateForDay,
    getMonthName,
    getMonthIndex,
    getDaysInMonth,
    getFirstDayOfMonth,
    formatDateYYYY_MM_DD
} from "./common.mjs";
import daysData from "./days.json" with { type: "json" };

// State
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let eventsCache = {};

// DOM Elements
const container = document.getElementById('calendarContainer');
const currentMonthDisplay = document.getElementById('currentMonthDisplay');
const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const goToMonthBtn = document.getElementById('goToMonth');
const eventModal = document.getElementById('eventModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
const modalTitle = document.getElementById('modalTitle');

// Initialize year select with a reasonable range
function populateYearSelect() {
    const currentYear = new Date().getFullYear();
    for (let year = 1900; year <= 2100; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) {
            option.selected = true;
        }
        yearSelect.appendChild(option);
    }
}

// Cache events for a given month
function cacheEventsForMonth(year, month) {
    const cacheKey = `${year}-${month}`;
    if (eventsCache[cacheKey]) {
        return eventsCache[cacheKey];
    }

    const events = {};
    daysData.forEach(day => {
        const date = getDateForDay(day, year);
        if (date.getMonth() === month) {
            const dayKey = date.getDate();
            if (!events[dayKey]) {
                events[dayKey] = [];
            }
            events[dayKey].push(day);
        }
    });

    eventsCache[cacheKey] = events;
    return events;
}

// Render the calendar
function renderCalendar(year, month) {
    // Update selectors
    monthSelect.value = month;
    yearSelect.value = year;

    // Update display
    currentMonthDisplay.textContent = `${getMonthName(month)} ${year}`;
    document.title = `Days Calendar - ${getMonthName(month)} ${year}`;

    // Cache events for this month
    const events = cacheEventsForMonth(year, month);

    // Get calendar data
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInMonth = getDaysInMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    // Build the calendar grid
     let html = '<div class="calendar-grid">';

    // Day headers
    const dayHeaders = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayHeaders.forEach(day => {
           html += `<div class="calendar-cell calendar-cell-header">${day}</div>`;
    });

    // Calculate total cells needed (including padding)
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    // Current date for highlighting today
    const today = new Date();
    const isTodayMonth = today.getMonth() === month && today.getFullYear() === year;
    const todayDate = today.getDate();

    // Render cells
    for (let i = 0; i < totalCells; i++) {
        let dayNumber;
        let isOtherMonth = false;
        let cellDate = null;

        if (i < firstDay) {
            // Days from previous month
            const prevMonthDay = daysInPrevMonth - firstDay + i + 1;
            dayNumber = prevMonthDay;
            isOtherMonth = true;
            // Create a date object for the previous month
            const prevMonth = month - 1;
            const prevYear = prevMonth < 0 ? year - 1 : year;
            const prevMonthIndex = prevMonth < 0 ? 11 : prevMonth;
            cellDate = new Date(prevYear, prevMonthIndex, prevMonthDay);
        } else if (i >= firstDay + daysInMonth) {
            // Days from next month
            const nextMonthDay = i - (firstDay + daysInMonth) + 1;
            dayNumber = nextMonthDay;
            isOtherMonth = true;
            // Create a date object for the next month
            const nextMonth = month + 1;
            const nextYear = nextMonth > 11 ? year + 1 : year;
            const nextMonthIndex = nextMonth > 11 ? 0 : nextMonth;
            cellDate = new Date(nextYear, nextMonthIndex, nextMonthDay);
        } else {
            // Current month days
            dayNumber = i - firstDay + 1;
            cellDate = new Date(year, month, dayNumber);
        }

        // Check if this is today
        const isToday = isTodayMonth && dayNumber === todayDate && !isOtherMonth;

        // Check if this cell has events
        const dayEvents = events[dayNumber] || [];

        // Build cell
        const cellClass = `calendar-cell${isOtherMonth ? ' other-month' : ''}${isToday ? ' today' : ''}`;
        html += `<div class="${cellClass}">`;  
        html += `<div class="day-number">${dayNumber}</div>`;

        // Add events as buttons (for accessibility)
        dayEvents.forEach(event => {
            const dateStr = cellDate ? formatDateYYYY_MM_DD(cellDate) : '';
            html += `<button class="event-name" data-event="${encodeURIComponent(event.name)}" data-date="${dateStr}" data-description="${encodeURIComponent(event.descriptionURL)}" aria-label="${event.name} on ${dateStr}">${event.name}</button>`;
        });

        html += '</div>';
    }

    html += '</div>';
    container.innerHTML = html;

    // Add event listeners to event buttons
    document.querySelectorAll('.event-name').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const name = decodeURIComponent(this.dataset.event);
            const date = this.dataset.date;
            const descriptionURL = decodeURIComponent(this.dataset.description);
            showEventDetails(name, date, descriptionURL);
        });
    });
}

// Show event details in modal
async function showEventDetails(name, date, descriptionURL) {
    modalTitle.textContent = name;
    modalBody.innerHTML = `<p><strong>Date:</strong> ${date}</p><p><em>Loading description...</em></p>`;
    eventModal.style.display = 'block';

    try {
        const response = await fetch(descriptionURL);
        if (response.ok) {
            const text = await response.text();
            modalBody.innerHTML = `<p><strong>Date:</strong> ${date}</p><p>${text}</p>`;
        } else {
            modalBody.innerHTML = `<p><strong>Date:</strong> ${date}</p><p><em>Description not available</em></p>`;
        }
    } catch (error) {
        modalBody.innerHTML = `<p><strong>Date:</strong> ${date}</p><p><em>Error loading description</em></p>`;
    }
}

// Close modal
function closeModal() {
    eventModal.style.display = 'none';
}

// Navigation functions
function goToPreviousMonth() {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    renderCalendar(currentYear, currentMonth);
}

function goToNextMonth() {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    renderCalendar(currentYear, currentMonth);
}

function goToSelectedMonth() {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    currentYear = year;
    currentMonth = month;
    renderCalendar(currentYear, currentMonth);
}

// Event listeners
prevMonthBtn.addEventListener('click', goToPreviousMonth);
nextMonthBtn.addEventListener('click', goToNextMonth);
goToMonthBtn.addEventListener('click', goToSelectedMonth);

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && eventModal.style.display === 'block') {
        closeModal();
    }
});

// Click outside modal to close
eventModal.addEventListener('click', function(e) {
    if (e.target === eventModal) {
        closeModal();
    }
});

modalClose.addEventListener('click', closeModal);

// Initialize
populateYearSelect();
renderCalendar(currentYear, currentMonth);

// Accessibility: Set aria-live for calendar updates
container.setAttribute('aria-live', 'polite');
container.setAttribute('aria-atomic', 'true');