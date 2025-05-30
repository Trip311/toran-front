import React from 'react';
import './DailyNotes.scss';
import noteImg from '../../../../assets/pinned.png';


interface Note {
  user: string;
  note: string;
}

const DailyNotes: React.FC<{ notes: Note[] }> = ({ notes }) => (
  <div className="daily-notes">
    <h3>
        <img
        src={noteImg}
        alt="Daily Notes"
        style={{ width: 24, height: 24, verticalAlign: 'middle', marginRight: 8 }}
      /> Daily Notes</h3>
    <ul>
      {notes.length === 0 ? (
        <li>No notes for this day.</li>
      ) : (
        notes.map((item, idx) => (
          <li key={idx}>
            <span className="user">{item.user}:</span>
            <span className="note">{item.note}</span>
          </li>
        ))
      )}
    </ul>
  </div>
);

export default DailyNotes;
