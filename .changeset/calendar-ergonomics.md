---
"@opensourcescouting/design-system": minor
---

Calendar ergonomics. `CalendarEvent` gains an `allDay` flag that suppresses the
time label in agenda rows and month chips (a start-of-day date no longer reads
as a misleading "12:00 AM"). When the agenda window is empty but events exist
outside it, the calendar now prompts "Switch to Month view to browse" instead of
a dead end (hidden on narrow viewports where the month grid is unavailable). A
new optional `onViewChange` prop reports view changes from the toolbar or the
prompt. (The agenda window already anchored to today, not `defaultMonth`.)
