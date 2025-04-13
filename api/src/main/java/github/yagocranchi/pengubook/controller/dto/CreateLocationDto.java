package github.yagocranchi.pengubook.controller.dto;

import java.math.BigDecimal;

public record CreateLocationDto(String name,
                                String type,
                                String description,
                                BigDecimal hourlyRate,
                                Integer minimumTime,
                                Integer maximumTime
    ) {
}
