package github.yagocranchi.pengubook.utils;

public class ValidationError {
    private int code;
    private String message;

    public ValidationError(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

}
