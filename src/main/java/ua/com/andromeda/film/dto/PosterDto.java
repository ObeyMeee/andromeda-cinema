package ua.com.andromeda.film.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ua.com.andromeda.media.Media;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PosterDto {
    private UUID filmId;
    private String title;
    private Media media;
}
