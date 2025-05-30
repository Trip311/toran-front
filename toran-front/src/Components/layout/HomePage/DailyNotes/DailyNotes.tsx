// DailyNotes.tsx
import React from 'react';
import './DailyNotes.scss';

const DailyNotes = () => {
  const exampleNotes = [
    { user: 'Alice', note: 'Reviewed team tasks and scheduled retro.' },
    { user: 'Bob', note: 'Fixed kitchen ventilation issue.' },
    { user: 'Charlie', note: 'Updated Jira for Q3 goals.' },
  ];

  return (
    <div className="daily-notes">
      <h3>🗒️ Daily Notes</h3>
      <ul>
        {exampleNotes.map((item, idx) => (
          <li key={idx}>
            <span className="user">{item.user}:</span>
            <span className="note">{item.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyNotes;
