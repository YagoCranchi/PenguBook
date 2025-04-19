package github.yagocranchi.pengubook.controller.dto;

public record CreateUserWithoutPasswordDto(
    String name,
    String email,
    String phone,
    String cpf) {

}
