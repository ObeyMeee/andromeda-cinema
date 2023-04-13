package ua.com.andromeda.film;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.com.andromeda.film.dto.PosterDto;
import ua.com.andromeda.session.SessionService;
import ua.com.andromeda.session.dto.SessionDto;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/films")
@RequiredArgsConstructor
public class FilmController {
    private final FilmService filmService;
    private final SessionService sessionService;

    @GetMapping
    public ResponseEntity<List<PosterDto>> getAll() {
        List<PosterDto> posters = filmService.getPoster();
        return new ResponseEntity<>(posters, HttpStatus.OK);
    }

    @GetMapping("/{id}/sessions")
    public ResponseEntity<List<SessionDto>> getAllByFilmId(@PathVariable String id) {
        List<SessionDto> sessions = sessionService.getSessionByFilmId(UUID.fromString(id));
        return new ResponseEntity<>(sessions, HttpStatus.OK);
    }
}