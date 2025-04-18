package github.yagocranchi.pengubook.controller.dto;

import java.time.LocalDateTime;

public record ReservationDateDto(LocalDateTime startDate,
                                 LocalDateTime endDate
    ) {
}