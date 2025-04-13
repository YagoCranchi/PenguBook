package github.yagocranchi.pengubook.config;

import github.yagocranchi.pengubook.repository.RoleRepository;
import github.yagocranchi.pengubook.repository.UserRepository;
import github.yagocranchi.pengubook.entities.Role;
import github.yagocranchi.pengubook.entities.User;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.boot.CommandLineRunner;

import java.util.Set;

@Configuration
public class AdminUserConfig implements CommandLineRunner {

    private RoleRepository roleRepository;
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder;

    public AdminUserConfig(RoleRepository roleRepository,
                           UserRepository userRepository,
                           BCryptPasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        var roleAdmin = roleRepository.findByName(Role.Values.ADMIN.name());

        var userAdmin = userRepository.findByName("admin");
        
        userAdmin.ifPresentOrElse(
                user -> {
                    System.out.println("Admin already exist!!!");
                },
                () -> {
                    var user = new User();
                    user.setName("admin");
                    user.setPassword(passwordEncoder.encode("123"));
                    user.setEmail("emailTeste@email.com");
                    user.setPhone("+99 99 9 9999-999");
                    user.setCpf("999.999.999-99");
                    
                    user.setRoles(Set.of(roleAdmin));
                    userRepository.save(user);
                }
        );
    }
}