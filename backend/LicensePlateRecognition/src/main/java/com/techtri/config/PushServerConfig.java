package com.techtri.config;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import lombok.RequiredArgsConstructor;

@Component
class PushSocketHandler extends TextWebSocketHandler {
	private static Map<String, WebSocketSession> map = new HashMap<>();

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.println("user is conntected![" + session.getId() + "]");
		map.put(session.getId(), session);
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("user is disconntected![" + session.getId() + "]");
		map.remove(session.getId());
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		System.out.println("msg:" + session.getId() + ":" + message.getPayload());
	}

	// 클라이언트에게 메시지를 보낼 때 호출하는 메소드 (JSON 문자열을 보내면 됨)
	public void sendData(String sendMessage) {
		Set<String> keys = map.keySet();
		synchronized (map) { // 블럭안에 코드를 수행하는 동안 map 객체에 대한 다른 스레드의 접근을 방지한다.
			for (String key : keys) {
				WebSocketSession session = map.get(key);

				try {
					session.sendMessage(new TextMessage(sendMessage));
					System.out.println(session.getId() + ":" + sendMessage);

				} catch (IOException e) {
				}
			}
		}
	}
	
}

@RequiredArgsConstructor
@Configuration
@EnableWebSocket
public class PushServerConfig implements WebSocketConfigurer {
	private final PushSocketHandler pushSocketHandler;

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(pushSocketHandler, "/pushservice").setAllowedOrigins("*");

	}

}
