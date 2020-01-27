package game;
import server.*;
import java.util.Timer;
import java.util.TimerTask;

class Session implements Runnable {
    Game game;
    WebsocketServer wss;
    Timer timer = new Timer();
    TimerTask task;
    public Session(WebsocketServer wss){
        this.wss = wss;
    }

    public void run() {
        this.game = new Game(wss);
    }
}