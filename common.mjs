// Shared logic for date calculations used by both web and iCal generators

/**
 * Gets the date of a commemorative day based on its pattern
 * @param {Object} day - Day configuration from days.json
 * @param {number} year - The year to calculate the date for
 * @returns {Date} The date of the commemorative day
 */
export function getDateForDay(day, year) {
    const monthIndex = getMonthIndex(day.monthName);
    const dayOfWeek = getDayOfWeekIndex(day.dayName);
    const occurrence = day.occurrence;
    
    // Get first day of the month
    const firstDay = new Date(year, monthIndex, 1);
    let targetDate;
    
    if (occurrence === 'last') {
        // Get last day of the month
        const lastDay = new Date(year, monthIndex + 1, 0);
        const lastDayOfWeek = lastDay.getDay();
        // Calculate how many days to subtract to get to the target day of week
        const diff = (lastDayOfWeek - dayOfWeek + 7) % 7;
        targetDate = new Date(year, monthIndex, lastDay.getDate() - diff);
    } else {
        // Get the first occurrence of the target day of week
        const firstDayOfWeek = firstDay.getDay();
        let daysToAdd = (dayOfWeek - firstDayOfWeek + 7) % 7;
        
        if (occurrence === 'second') {
            daysToAdd += 7;
        } else if (occurrence === 'third') {
            daysToAdd += 14;
        } else if (occurrence === 'fourth') {
            daysToAdd += 21;
        }
        // For 'first', we keep daysToAdd as is
        
        targetDate = new Date(year, monthIndex, 1 + daysToAdd);
    }
    
    return targetDate;
}

/**
 * Gets the name of the month from its index
 * @param {number} monthIndex - Month index (0-11)
 * @returns {string} Month name
 */
export function getMonthName(monthIndex) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex];
}

/**
 * Gets the month index from a month name
 * @param {string} monthName - Name of the month
 * @returns {number} Month index (0-11)
 */
export function getMonthIndex(monthName) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames.indexOf(monthName);
}

/**
 * Gets the day of week index from a day name
 * @param {string} dayName - Name of the day
 * @returns {number} Day of week index (0=Sunday, 6=Saturday)
 */
export function getDayOfWeekIndex(dayName) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames.indexOf(dayName);
}

/**
 * Gets the number of days in a month
 * @param {number} year - The year
 * @param {number} month - Month index (0-11)
 * @returns {number} Number of days in the month
 */
export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Gets the day of week for the first day of the month
 * @param {number} year - The year
 * @param {number} month - Month index (0-11)
 * @returns {number} Day of week (0=Sunday, 6=Saturday)
 */
export function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

/**
 * Generates all dates for a given day pattern within a year range
 * @param {Object} day - Day configuration from days.json
 * @param {number} startYear - Start year (inclusive)
 * @param {number} endYear - End year (inclusive)
 * @returns {Array<Date>} Array of dates for each year
 */
export function generateDatesForDay(day, startYear, endYear) {
    const dates = [];
    for (let year = startYear; year <= endYear; year++) {
        dates.push(getDateForDay(day, year));
    }
    return dates;
}

/**
 * Formats a date as a string in the format YYYYMMDD
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDateYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

/**
 * Formats a date as a string in the format YYYY-MM-DD
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDateYYYY_MM_DD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
