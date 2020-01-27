package server;

public class App
{
    public static void main(String[] args) {
        System.out.println(System.getProperty("user.dir"));
        WebsocketServer wss = new WebsocketServer();
        wss.start();
      }
}
