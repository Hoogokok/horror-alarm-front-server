package org.alram.horroralarmbackend.alarm;

public record TokenTimeCheckedRequest(boolean result, String token, TimeCheckResult timeCheckResult) {

}
