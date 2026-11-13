import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Note } from "../services/noteService";

interface NoteCardProps {
  note: Note;
  formatDate: (date: string) => string;
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

function NoteCard({
  note,
  formatDate,
  onView,
  onEdit,
  onDelete,
}: NoteCardProps) {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>

      <span className="note-date">{formatDate(note.updatedAt)}</span>

      <div className="note-card-actions">
        <button className="note-action" onClick={() => onView(note)}>
          <Eye size={15} />
          View
        </button>

        <button className="note-action" onClick={() => onEdit(note)}>
          <Pencil size={15} />
          Edit
        </button>

        <button className="note-action delete" onClick={() => onDelete(note)}>
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default NoteCard;
