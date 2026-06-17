// This is a placeholder file which shows how you can access functions and data defined in other files. You can delete the contents of the file once you have understood how it works.
// It can be run with `node`.

import fs from 'fs';
import daysData from "./days.json" with { type: "json" };
import { getDateForDay, formatDateYYYYMMDD, formatDateYYYY_MM_DD } from "./common.mjs";

/**
 * Generates an iCal file for all commemorative days from 2020 to 2030
 */
function generateICal() {
    const startYear = 2020;
    const endYear = 2030;

    // Start building the iCal content
    let icalContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Days Calendar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH'
    ].join('\r\n');

    // For each day in the JSON file
    daysData.forEach(day => {
        // For each year in the range
        for (let year = startYear; year <= endYear; year++) {
            const date = getDateForDay(day, year);
            const dateStr = formatDateYYYYMMDD(date);

            // Add the event to the iCal file
            const event = [
                'BEGIN:VEVENT',
                `UID:${day.name.replace(/\s/g, '')}${year}@days-calendar`,
                `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
                `DTSTART;VALUE=DATE:${dateStr}`,
                `SUMMARY:${day.name}`,
                `DESCRIPTION:${day.name} - ${formatDateYYYY_MM_DD(date)}`,
                'END:VEVENT'
            ].join('\r\n');

            icalContent += '\r\n' + event;
        }
    });

    // Close the calendar
    icalContent += '\r\nEND:VCALENDAR';

    // Write the file
    fs.writeFileSync('days.ics', icalContent);
    console.log('✅ days.ics generated successfully!');
    console.log(`📅 Generated events for ${daysData.length} commemorative days from ${startYear} to ${endYear}`);
}

// Run the generator
generateICal();
