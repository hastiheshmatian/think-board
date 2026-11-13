import { X, Pencil } from "lucide-react";
import type { Note } from "../services/noteService";

interface NoteDetailsProps {
  selectedNote: Note;
  formatDate: (date: string) => string;
  closeDetails: () => void;
  onEdit: (note: Note) => void;
}

function NoteDetails({
  selectedNote,
  formatDate,
  closeDetails,
  onEdit,
}: NoteDetailsProps) {
  return (
    <div className="modal-overlay" onClick={closeDetails}>
      <div className="details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Note Details</h2>
          <button className="close-button" onClick={closeDetails}>
            <X size={20} />
          </button>
        </div>

        <div className="detail-content">
          <h3 className="detail-title">{selectedNote.title}</h3>
          <p className="detail-text">{selectedNote.content}</p>
          <span className="detail-date">
            Created: {formatDate(selectedNote.createdAt)}
          </span>
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={closeDetails}>
            Close
          </button>
          <button className="new-note" onClick={() => onEdit(selectedNote)}>
            <Pencil size={16} />
            Edit Note
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteDetails;
