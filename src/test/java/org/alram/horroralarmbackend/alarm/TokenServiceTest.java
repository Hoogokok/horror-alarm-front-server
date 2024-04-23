package org.alram.horroralarmbackend.alarm;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.transaction.Transactional;
import java.time.LocalDate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@Transactional
@SpringBootTest
class TokenServiceTest {
    @Autowired
    private TokenService tokenService;


    @DisplayName("저장 테스트")
    @Test
    void saveToken() {
        // given
        TokenRequest tokenRequest = new TokenRequest("token", LocalDate.of(2024, 3, 24));
        // when
        Token token = tokenService.saveToken(tokenRequest);

        // then
        assertThat(token.getToken()).isEqualTo(tokenRequest.getToken());
        assertThat(token.getTime()).isEqualTo(tokenRequest.getTime());
    }

    @DisplayName("한달이 지났는지 확인")
    @Test
    void check_Token_Pass_A_Month() {
        // given
        TokenRequest tokenRequest = new TokenRequest("token", LocalDate.of(2024, 3, 24));
        tokenService.saveToken(tokenRequest);

        // when
        TokenTimeCheckedRequest actual = tokenService.checkedTokenTimesPassedTheMonth(tokenRequest.getToken());

        // then
        assertThat(actual.result()).isFalse();
        assertThat(actual.token()).isEqualTo(tokenRequest.getToken());
        assertThat(actual.timeCheckResult()).isEqualTo(TimeCheckResult.EXIST);
    }

    @Test
    void updateToken() {
        // given
        TokenRequest tokenRequest = new TokenRequest("token", LocalDate.of(2024, 3, 24));
        tokenService.saveToken(tokenRequest);

        // when
        TokenUpdateRequest updateToken = new TokenUpdateRequest(tokenRequest.getToken(),"updateToken", LocalDate.of(2024, 4, 24));
        TokenUpdateResponse tokenRequest1 = tokenService.updateToken(updateToken);

        // then
        assertThat(tokenRequest1.token()).isEqualTo(updateToken.getNewToken());
        assertThat(tokenRequest1.message()).isEqualTo("Token updated successfully");
    }
}