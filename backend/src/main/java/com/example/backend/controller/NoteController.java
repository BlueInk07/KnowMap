
package com.example.backend.controller;

import com.example.backend.model.Note;
import com.example.backend.repository.NoteRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:5173")
public class NoteController {

    private final NoteRepository repository;

    public NoteController(NoteRepository repository) {
        this.repository = repository;
    }

    // Get all notes
    @GetMapping
    public List<Note> getAllNotes() {
        return repository.findAll();
    }

    // Add a new note
    @PostMapping
    public Note createNote(@RequestBody Note note) {
        return repository.save(note);
    }

    // Update a note
    @PutMapping("/{id}")
    public Note updateNote(@PathVariable Long id, @RequestBody Note updatedNote) {
        Note note = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        note.setTitle(updatedNote.getTitle());
        note.setContent(updatedNote.getContent());
        note.setCategory(updatedNote.getCategory());

        return repository.save(note);
    }

    // Delete a note
    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
