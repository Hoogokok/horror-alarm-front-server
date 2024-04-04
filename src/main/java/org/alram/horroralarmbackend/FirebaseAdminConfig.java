package org.alram.horroralarmbackend;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import java.io.FileInputStream;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class FirebaseAdminConfig {
    public static void init() {
        try {
            FileInputStream serviceAccount = new FileInputStream("/Users/ryun/Downloads/horror-alarm-firebase-adminsdk-msrw6-4f8d5fc52e.json");
            FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();
            FirebaseApp.initializeApp(options);
        } catch (Exception e) {
            log.error("Firebase Admin SDK 초기화에 실패했습니다.", e);
        }
    }
}
