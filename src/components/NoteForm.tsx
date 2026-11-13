import { X } from "lucide-react";

interface NoteFormProps {
  editingNote: boolean;
  title: string;
  content: string;
  saving: boolean;
  setTitle: (value: string) => void;
  setContent: (value: string) => void;
  closeForm: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

function NoteForm({
  editingNote,
  title,
  content,
  saving,
  setTitle,
  setContent,
  closeForm,
  handleSubmit,
}: NoteFormProps) {
  return (
    <div className="modal-overlay" onClick={closeForm}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingNote ? "Edit Note" : "Create Note"}</h2>
          <button className="close-button" onClick={closeForm}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            className="form-input"
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />

          <label>Description</label>
          <textarea
            className="form-textarea"
            placeholder="Write your thoughts..."
            value={content}
            minLength={10}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={closeForm}>
              Cancel
            </button>

            <button type="submit" className="new-note" disabled={saving}>
              {saving
                ? "Saving..."
                : editingNote
                  ? "Save Changes"
                  : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteForm;
