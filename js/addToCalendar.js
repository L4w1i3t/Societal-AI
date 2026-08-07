(function () {
  'use strict';

  function buildICS(title, start, end, description, location) {
    var uid = Date.now() + '-' + Math.random().toString(36).slice(2) + '@societal-ai-uva';
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Societal AI at UVA//EN',
      'BEGIN:VEVENT',
      'UID:' + uid,
      'DTSTART;VALUE=DATE:' + start,
      'DTEND;VALUE=DATE:' + end,
      'SUMMARY:' + esc(title),
      'DESCRIPTION:' + esc(description),
      'LOCATION:' + esc(location),
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  function esc(str) {
    return (str || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }

  function downloadICS(filename, content) {
    var uri = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(content);
    var a = document.createElement('a');
    a.href = uri;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function closeAll() {
    document.querySelectorAll('.add-to-cal-dropdown:not([hidden])').forEach(function (d) {
      d.hidden = true;
      var btn = d.closest('.add-to-cal').querySelector('.add-to-cal-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function init() {
    // ICS download links
    document.querySelectorAll('.atc-ics').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var d = this.dataset;
        var ics = buildICS(d.title, d.start, d.end, d.desc || '', d.loc || 'TBA');
        var filename = (d.title || 'event').replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.ics';
        downloadICS(filename, ics);
        closeAll();
      });
    });

    // Toggle dropdowns
    document.querySelectorAll('.add-to-cal-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var dropdown = this.closest('.add-to-cal').querySelector('.add-to-cal-dropdown');
        var isOpen = this.getAttribute('aria-expanded') === 'true';
        closeAll();
        if (!isOpen) {
          this.setAttribute('aria-expanded', 'true');
          dropdown.hidden = false;
        }
      });
    });

    document.addEventListener('click', closeAll);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
