package game;

import org.java_websocket.WebSocket;

public class Player {
    String name;
	int index;
	boolean it;
    Game game;
    public WebSocket connection;
    String address;

    public Player(short index, String  name, WebSocket conn) {
        this.index = index;
        this.name = name;
        this.connection = conn;
        this.address = conn.getRemoteSocketAddress().getAddress().getHostAddress();
    }

    public void sendMessage(String message) {
        System.out.println("Broadcasting to " + this.name + ":\n" + message);
        this.connection.send(message);
    }
}