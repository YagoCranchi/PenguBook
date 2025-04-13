package github.yagocranchi.pengubook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import github.yagocranchi.pengubook.entities.Location;

import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, UUID> {
    
}
