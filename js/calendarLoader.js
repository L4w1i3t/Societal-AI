(function () {
  'use strict';

  var CALENDAR_ID = 'saiatuvaboard@gmail.com';
  var API_KEY = 'YOUR_API_KEY_HERE'; // replace with your Google Calendar API key
  var CALENDAR_LINK = 'https://calendar.google.com/calendar/u/0?cid=c2FpYXR1dmFib2FyZEBnbWFpbC5jb20';
  var MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  var CAL_ICON = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';

  function parseStart(event) {
    var str = event.start.date || event.start.dateTime;
    if (str.length === 10) {
      var p = str.split('-');
      return { month: parseInt(p[1]) - 1, day: parseInt(p[2]) };
    }
    var d = new Date(str);
    return { month: d.getMonth(), day: d.getDate() };
  }

  function toICSDate(str) {
    if (!str) return '';
    if (str.length === 10) return str.replace(/-/g, '');
    return str.replace(/[-:]/g, '').replace(/\.\d+/, '') + (str.endsWith('Z') ? '' : 'Z');
  }

  function escHtml(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function escAttr(s) {
    return (s || '').replace(/"/g, '&quot;').replace(/\n/g, ' ');
  }

  function stripHtml(s) {
    return (s || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  }

  function buildGoogleUrl(title, start, end, desc, loc) {
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(title) +
      '&dates=' + start + '%2F' + end +
      '&details=' + encodeURIComponent(desc || '') +
      '&location=' + encodeURIComponent(loc || '');
  }

  function renderEvent(event) {
    var date   = parseStart(event);
    var title  = event.summary || 'Untitled Event';
    var loc    = event.location || '';
    var desc   = stripHtml(event.description || '');
    var iStart = toICSDate(event.start.date || event.start.dateTime);
    var iEnd   = toICSDate(event.end.date   || event.end.dateTime);
    var gUrl   = buildGoogleUrl(title, iStart, iEnd, desc, loc);

    return [
      '<div class="upcoming-event-item">',
        '<div class="event-date">',
          '<span class="month">' + MONTHS[date.month] + '</span>',
          '<span class="day">' + date.day + '</span>',
        '</div>',
        '<div class="event-details">',
          '<h3>' + escHtml(title) + '</h3>',
          loc  ? '<p class="event-location">'   + escHtml(loc)  + '</p>' : '',
          desc ? '<p class="event-description">' + escHtml(desc) + '</p>' : '',
          '<div class="add-to-cal">',
            '<button class="add-to-cal-btn" aria-expanded="false">' + CAL_ICON + ' Add to Calendar</button>',
            '<div class="add-to-cal-dropdown" hidden>',
              '<a class="atc-option" href="' + escAttr(gUrl) + '" target="_blank" rel="noopener noreferrer">Google Calendar</a>',
              '<a class="atc-option atc-ics" href="#"',
                ' data-title="' + escAttr(title) + '"',
                ' data-start="' + iStart + '"',
                ' data-end="'   + iEnd   + '"',
                ' data-desc="'  + escAttr(desc) + '"',
                ' data-loc="'   + escAttr(loc)  + '"',
              '>Apple / Outlook (.ics)</a>',
            '</div>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');
  }

  function showError(list) {
    list.innerHTML = '<p style="padding:1rem 0;color:var(--text-muted);font-family:var(--font-sans)">Could not load events. <a href="' + CALENDAR_LINK + '" target="_blank" rel="noopener noreferrer">View on Google Calendar</a>.</p>';
  }

  function load() {
    var list = document.querySelector('.events-upcoming-list');
    if (!list) return;

    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') return; // no key yet, leave static HTML

    list.innerHTML = '<p style="padding:1rem 0;color:var(--text-muted);font-family:var(--font-sans)">Loading events…</p>';

    var now = new Date().toISOString();
    var url = 'https://www.googleapis.com/calendar/v3/calendars/' +
      encodeURIComponent(CALENDAR_ID) +
      '/events?key=' + encodeURIComponent(API_KEY) +
      '&orderBy=startTime&singleEvents=true' +
      '&timeMin=' + encodeURIComponent(now) +
      '&maxResults=10';

    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then(function (data) {
        var events = data.items || [];
        if (events.length === 0) {
          list.innerHTML = '<p style="padding:1rem 0;color:var(--text-muted);font-family:var(--font-sans)">No upcoming events scheduled. <a href="' + CALENDAR_LINK + '" target="_blank" rel="noopener noreferrer">View calendar</a>.</p>';
          return;
        }
        list.innerHTML = events.map(renderEvent).join('');
      })
      .catch(function () { showError(list); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
