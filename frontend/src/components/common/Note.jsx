// Importing React library
import React from "react"; // Correct import should be 'React', not 'Reac'
import "../styles/Home.css"

/*
 * Note Component
 * Props:
 * - note: An object containing details of the note (title, content, created_at, id).
 * - onDelete: A callback function to delete the note, passed from a parent component.
 */
function Note({ note, onDelete }) {
    // Formats the created_at date into a more readable string format
    // Using toLocaleDateString with "en-US" for English (US) formatting
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");

    return (
        <div className="note-container"> {/* Container for the note */}
            <p className="note-title">{note.title}</p> {/* Displays the note title */}
            <p className="note-content">{note.content}</p> {/* Displays the note content */}
            <p className="note-date">{formattedDate}</p> {/* Displays the formatted creation date */}
            <button
                className="delete-button"
                onClick={() => onDelete(note.id)} /* Calls the onDelete function with the note's ID when clicked */
            >
                Delete {/* Text displayed on the delete button */}
            </button>
        </div>
    );
}

// Exports the Note component so it can be imported and used in other files
export default Note;
