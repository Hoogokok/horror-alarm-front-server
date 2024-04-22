package org.alram.horroralarmbackend.alarm;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Transactional
@Service
public class TokenService {
    private  TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public Token saveToken(TokenRequest tokenRequest){
        Token token = new Token(tokenRequest.getToken(), tokenRequest.getTime());
        return tokenRepository.save(token);
    }

    public void deleteToken(TokenRequest token) {
        Optional<Token> byToken = tokenRepository.findByToken(token.getToken());
        if (!byToken.isPresent()) {
            log.error("Token not found");
            return;
        }
        tokenRepository.delete(byToken.get());
    }

    public TokenTimeCheckedRequest checkedTokenTimesPassedTheMonth(String token) {
        Optional<Token> time = tokenRepository.findByToken(token);
        if (!time.isPresent()) {
            log.error("Token not found");
            return new TokenTimeCheckedRequest(false, token, TimeCheckResult.NOT_EXIST);
        }
        LocalDate now = LocalDate.now();
        LocalDate tokenTimestamp = time.get().getTime();
        if (isMonthPassed(tokenTimestamp, now)) {
            log.info("한달이 지났습니다.");
            return new TokenTimeCheckedRequest(true, token, TimeCheckResult.EXIST);
        }
        return new TokenTimeCheckedRequest(false, token, TimeCheckResult.EXIST);
    }

    public  boolean isMonthPassed(LocalDate date1, LocalDate date2) {
        return ChronoUnit.MONTHS.between(date1, date2) >= 1;
    }

    public TokenUpdateResponse updateToken(TokenUpdateRequest tokenUpdateRequest) {
        Optional<Token> oldToken = tokenRepository.findByToken(tokenUpdateRequest.getOldToken());
        if (oldToken.isEmpty()) {
            log.error("Token not found");
            return new TokenUpdateResponse(tokenUpdateRequest.getOldToken(),"Token not found");
        }
        Token token1 = oldToken.get();
        token1.update(tokenUpdateRequest.getNewToken(), tokenUpdateRequest.getNewTime());
        Token save = tokenRepository.save(token1);
        return new TokenUpdateResponse(save.getToken(), "Token updated successfully");
    }
}
