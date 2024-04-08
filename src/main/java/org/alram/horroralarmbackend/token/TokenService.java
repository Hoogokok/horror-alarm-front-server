package org.alram.horroralarmbackend.token;

import org.alram.horroralarmbackend.TokenDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class TokenService {
    private TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public void saveToken(TokenDTO tokenDTO){
        Token token = new Token(tokenDTO.getToken());
        tokenRepository.save(token);
    }
}
