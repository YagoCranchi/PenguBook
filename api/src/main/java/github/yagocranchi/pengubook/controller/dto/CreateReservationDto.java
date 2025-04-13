package github.yagocranchi.pengubook.controller.dto;

import java.util.UUID;
import java.time.LocalDateTime;
import java.math.BigDecimal;

public record CreateReservationDto(UUID userId,
                                   UUID locationId,
                                   LocalDateTime startDate,
                                   LocalDateTime endDate,
                                   BigDecimal finalValue,
                                   String status
) {}
