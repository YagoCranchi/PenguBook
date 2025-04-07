package github.yagocranchi.reservas.controller.dto;


public record CreateUserDto(String name,
                            String password,
                            String email,
                            String phone,
                            String cpf) {
    
}
