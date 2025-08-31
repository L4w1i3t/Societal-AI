# Dynamic Legacy Management System

## Overview

The legacy page has been refactored to use a dynamic system that loads past board members and events from `data/legacy.json`. This allows for easy management and updates without modifying HTML code.

## Files

- `data/legacy.json` - Contains all legacy data (past board members and events)
- `js/legacyLoader.js` - Main module for loading and rendering legacy content
- `js/legacyAdmin.js` - Optional admin interface for managing legacy data
- `js/legacyDropdowns.js` - Updated to work with dynamic content
- `pages/legacy.html` - Updated to use dynamic loading

## Legacy Data Structure

The `legacy.json` file has two main sections:

### Past Board Members
```json
{
  "pastBoardMembers": {
    "class-2025": {
      "title": "Class of 2025",
      "members": [
        {
          "id": "unique-id",
          "name": "Full Name",
          "title": "Position/Title",
          "degree": "Academic Degree",
          "bio": "Biography text",
          "image": "path/to/image.webp"
        }
      ]
    }
  }
}
```

### Past Events
```json
{
  "pastEvents": {
    "2024-2025": {
      "title": "Academic Year 2024-2025",
      "events": [
        {
          "id": "unique-id",
          "title": "Event Title",
          "location": "Event Location",
          "description": "Event Description",
          "date": {
            "month": "JAN",
            "day": "15",
            "year": "2024"
          }
        }
      ]
    }
  }
}
```

## Usage

### Basic Usage

The legacy page will automatically load and display all past board members and events from `data/legacy.json`. No additional setup is required.

### Admin Interface

To enable the admin interface, include the admin script in your HTML:

```html
<script src="../js/legacyAdmin.js"></script>
```

#### Admin Features

1. **Access Admin Panel**: Press `Ctrl+Shift+L` to open the admin panel
2. **Add Board Members**: Select class, fill out form to add new board members
3. **Add Events**: Select academic year, fill out form to add new events
4. **Remove Items**: Click remove button next to any board member or event
5. **Export Data**: Download current legacy data as JSON
6. **Import Data**: Upload a JSON file to replace current legacy data

### Manual JSON Editing

You can directly edit `data/legacy.json` to:

- Add new graduating classes or academic years
- Add board members or events
- Update existing information
- Remove outdated content
- Reorder display

### Adding New Content

#### New Board Member
When adding a new board member, ensure:

1. The `id` is unique within the class
2. The class exists or create a new one
3. All required fields are filled
4. The image path is correct and the image exists

#### New Event
When adding a new event, ensure:

1. The `id` is unique within the academic year
2. The academic year exists or create a new one
3. Date format is correct (month as 3-letter abbreviation)
4. All required fields are filled

### Image Guidelines

- Store legacy member images in `assets/legacy/`
- Use WebP format for better performance
- Recommended size: Square aspect ratio, at least 300x300px
- Use descriptive filenames

## API Reference

### LegacyLoader Class

The global `window.legacyLoader` object provides the following methods:

- `addBoardMember(classId, member)` - Add a new board member to a specific class
- `addEvent(yearId, event)` - Add a new event to a specific academic year
- `getData()` - Get current legacy data

### Example Usage

```javascript
// Add a new board member
window.legacyLoader.addBoardMember('class-2026', {
  id: 'new-member',
  name: 'New Member',
  title: 'New Position',
  degree: 'Some Degree',
  bio: 'Bio text here',
  image: '../assets/legacy/new-member.webp'
});

// Add a new event
window.legacyLoader.addEvent('2025-2026', {
  id: 'new-event',
  title: 'New Event',
  location: 'Event Location',
  description: 'Event description',
  date: {
    month: 'MAR',
    day: '15',
    year: '2025'
  }
});
```

## Dropdown Functionality

The legacy page uses collapsible dropdowns to organize content by:
- **Board Members**: Grouped by graduating class
- **Events**: Grouped by academic year

Features:
- Click to expand/collapse sections
- Only one section open at a time
- Smooth animations and scrolling
- Keyboard accessibility (Enter/Space)
- Click outside to close

## Troubleshooting

### Content Not Loading

1. Check browser console for errors
2. Ensure `legacy.json` is valid JSON
3. Verify all image paths are correct
4. Check network tab for failed requests

### Dropdowns Not Working

1. Ensure `legacyDropdowns.js` is loaded
2. Check that content is fully loaded before interaction
3. Look for JavaScript errors in console

### Admin Panel Issues

1. Ensure `legacyAdmin.js` is included
2. Check that `legacyLoader.js` loaded first
3. Press `Ctrl+Shift+L` to open admin panel
4. Verify form validation requirements

## Data Migration

If you have existing legacy data in HTML format:

1. Extract the information manually
2. Structure it according to the JSON format
3. Add to `legacy.json`
4. Test the display and dropdown functionality
5. Remove the old HTML content

## Security Considerations

- The admin interface should only be included in development/admin environments
- For production, remove the `legacyAdmin.js` script
- Validate all user inputs when using admin features
- Consider implementing proper authentication for admin features

## Future Enhancements

Potential improvements could include:

- Search functionality across legacy content
- Filtering by role or event type
- Photo gallery integration
- Timeline view for events
- Integration with current staff system
- Bulk import from CSV files
- Archive/unarchive functionality
