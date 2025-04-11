document.addEventListener('DOMContentLoaded', function() {
    // Determine the correct path to events.json based on current location
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('/pages/');
    const basePath = isInSubfolder ? '../' : '';
    const eventsJsonPath = `${basePath}data/events.json`;
    
    // Initialize with empty events array
    let events = [];
    
    // Fetch events from JSON file
    // Right now just has sample data, but will be replaced with real data later
    // The format for the data is as follows:
    // {
    //     "events": [
    //         {
    //             "id": "1",
    //             "title": "Sample Event",
    //             "start": "2023-10-01T10:00:00",
    //             "end": "2023-10-01T12:00:00",
    //             "location": "Sample Location",
    //             "description": "Sample description for the event."
    //         },
    //         . . .
    fetch(eventsJsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load events data');
            }
            return response.json();
        })
        .then(data => {
            // Extract events array from the JSON data
            events = data.events || [];
            
            // Initialize calendar with the loaded events
            initializeCalendar(events);
            
            // Populate the upcoming events list
            populateUpcomingEvents(events);
        })
        .catch(error => {
            console.error('Error loading events:', error);
            // Initialize with empty events if there's an error
            initializeCalendar([]);
            
            // Show error in upcoming events section
            const eventListContainer = document.getElementById('event-list');
            if (eventListContainer) {
                eventListContainer.innerHTML = `
                    <div class="no-events">
                        Unable to load events. Please try again later.
                    </div>
                `;
            }
        });
    
    // Function to initialize the calendar with events
    function initializeCalendar(calendarEvents) {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) return;
        
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listMonth'
            },
            events: calendarEvents,
            eventClick: function(info) {
                showEventModal(info.event);
            },
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                meridiem: true
            },
            height: 'auto',
            themeSystem: 'standard',
            // Custom styling for the dark theme
            eventDidMount: function(info) {
                // Add hover styling to events
                info.el.style.transition = 'transform 0.3s, box-shadow 0.3s';
                info.el.addEventListener('mouseover', function() {
                    info.el.style.transform = 'scale(1.02)';
                    info.el.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                    info.el.style.zIndex = '5';
                });
                info.el.addEventListener('mouseout', function() {
                    info.el.style.transform = '';
                    info.el.style.boxShadow = '';
                    info.el.style.zIndex = '';
                });
            }
        });
        
        // Apply additional styling to match our dark theme
        applyDarkThemeStyles();
        
        // Render the calendar
        calendar.render();
        
        // Set up modal event handlers
        setupEventModal();
        
        // Store calendar instance in a global variable for access from other functions
        window.calendarInstance = calendar;
    }

    // Function to show event details in modal
    function showEventModal(event) {
        const modal = document.getElementById('event-modal');
        const title = document.getElementById('modal-title');
        const date = document.getElementById('modal-date');
        const time = document.getElementById('modal-time');
        const location = document.getElementById('modal-location');
        const description = document.getElementById('modal-description');
        
        // Format date and time
        const eventDate = event.start;
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const formattedTime = eventDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }) + ' - ' + (event.end ? 
            event.end.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            }) : '');
        
        // Set modal content
        title.textContent = event.title;
        date.textContent = `Date: ${formattedDate}`;
        time.textContent = `Time: ${formattedTime}`;
        location.textContent = `Location: ${event.extendedProps.location || 'TBA'}`;
        description.textContent = event.extendedProps.description || 'No description available.';
        
        // Show modal
        modal.style.display = 'flex';
    }
    
    // Set up modal event handlers
    function setupEventModal() {
        const modal = document.getElementById('event-modal');
        const closeBtn = document.querySelector('.close-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
        
        // Close modal when clicking outside of it
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Close modal on escape key
        window.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    }
    
    // Populate upcoming events list
    function populateUpcomingEvents(events) {
        const eventListContainer = document.getElementById('event-list');
        if (!eventListContainer) return;
        
        // Clear loading placeholder
        eventListContainer.innerHTML = '';
        
        // Sort events by date
        const sortedEvents = [...events].sort((a, b) => {
            return new Date(a.start) - new Date(b.start);
        });
        
        // Filter for upcoming events (today and future)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingEvents = sortedEvents.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate >= today;
        }).slice(0, 5); // Show only the next 5 events
        
        if (upcomingEvents.length === 0) {
            const noEvents = document.createElement('div');
            noEvents.className = 'no-events';
            noEvents.textContent = 'No upcoming events at this time.';
            eventListContainer.appendChild(noEvents);
            return;
        }
        
        // Create event list items
        upcomingEvents.forEach(event => {
            const eventDate = new Date(event.start);
            const formattedDate = eventDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            
            const formattedTime = eventDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <div class="event-date">
                    <span class="event-month">${formattedDate.split(' ')[0]}</span>
                    <span class="event-day">${formattedDate.split(' ')[1]}</span>
                </div>
                <div class="event-details">
                    <h3>${event.title}</h3>
                    <p class="event-time">${formattedTime}</p>
                    <p class="event-location">${event.location}</p>
                </div>
            `;
            
            // Add click event to show modal
            eventCard.addEventListener('click', function() {
                const calEvent = window.calendarInstance.getEventById(event.id);
                if (calEvent) {
                    showEventModal(calEvent);
                }
            });
            
            eventListContainer.appendChild(eventCard);
        });
    }
    
    // Apply dark theme styles to the calendar
    function applyDarkThemeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .fc-theme-standard {
                background-color: rgba(30, 33, 48, 0.6);
                border-radius: 4px;
                padding: 1rem;
                border: none;
                color: #e0e0e0;
            }
            .fc .fc-toolbar {
                flex-wrap: wrap;
                row-gap: 1rem;
            }
            .fc .fc-toolbar-title {
                color: #ffffff;
            }
            .fc th {
                background-color: rgba(30, 33, 48, 0.8);
                color: #e0e0e0;
                padding: 10px 0;
            }
            .fc-theme-standard td, .fc-theme-standard th {
                border-color: rgba(51, 54, 68, 0.8);
            }
            .fc-theme-standard .fc-scrollgrid {
                border-color: rgba(51, 54, 68, 0.8);
            }
            .fc .fc-daygrid-day.fc-day-today {
                background-color: rgba(108, 158, 255, 0.15);
            }
            .fc .fc-button-primary {
                background-color: rgba(30, 33, 48, 0.9);
                border-color: rgba(51, 54, 68, 0.8);
                color: #e0e0e0;
            }
            .fc .fc-button-primary:not(:disabled):hover {
                background-color: rgba(108, 158, 255, 0.7);
                border-color: rgba(108, 158, 255, 0.9);
            }
            .fc .fc-button-primary:not(:disabled).fc-button-active,
            .fc .fc-button-primary:not(:disabled):active {
                background-color: rgba(108, 158, 255, 0.8);
                border-color: rgba(108, 158, 255, 0.9);
            }
            .fc-event {
                cursor: pointer;
            }
            .fc-daygrid-event-dot {
                border-color: #6c9eff !important;
            }
        `;
        document.head.appendChild(style);
    }
});