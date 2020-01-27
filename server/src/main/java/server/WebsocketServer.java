package server;

import game.*;
import java.net.InetSocketAddress;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.WebSocket;
import org.java_websocket.server.WebSocketServer;

public class WebsocketServer extends WebSocketServer {
    Game game;
    Timer timer = new Timer();
    TimerTask task;
    private static int TCP_PORT = 4444;

    private Set<WebSocket> conns;

    public WebsocketServer() {
        super(new InetSocketAddress(TCP_PORT));
        conns = new HashSet<>();
        newGame();
    }
    
    public void newGame() {
        this.game = new Game(this);
     } 

    public void broadcast(){
        this.broadcast(false);
    }

    public void broadcast(boolean end){
        if(end) System.out.print("Broadcast: END");
        Gson gson = new Gson();
        String broadcast = gson.toJson(new Broadcast(game, end));
        for (WebSocket sock : conns) {
            sock.send(broadcast);
        }
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        conns.add(conn);
        System.out.println("New connection from " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
        broadcast();
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        System.out.println("Closing connection.");
        conns.remove(conn);
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        System.out.println("Message from client: " + message);
        handleRequest(conn, message);
        broadcast();
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        System.out.println("ERROR!");
        ex.printStackTrace();
        if (conn != null) {
            System.out.println("ERROR from " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
            conns.remove(conn);
        }
        else System.out.println("ERROR: Connection does not exist");
    }

    public void timeOut() {
        Random r = new Random();
        System.out.println("PHASE:" + game.phase);
        switch(game.phase){
            case 0: 
                System.out.println("case0");
                game.setQuote(game.quoteChoices[r.nextInt(3)], game.indexOfIt); 
                break;
            case 1: 
                System.out.println("case1");
                String[] timeOutQuote = game.quote.clone();
                timeOutQuote[2] = "failed to write something in time.";
                for(int i = 0; i<game.numPlayers; i++){
                    if(!game.submitted[i]) {
                        game.setQuote(timeOutQuote, i);
                    }
                }
                break;
            case 2: 
                System.out.println("case2");
                for(int i = 0; i<game.numPlayers; i++){
                    if(!game.submitted[i]) {
                        game.vote(-1, i);
                    }
                }
                break;
            case 3: game.time = 60;
        }
        broadcast();
    }

    public void timer() {        
        game.time = 60;
        if(task!=null) task.cancel();
        task = new TimerTask()
        {
            public void run()
            {
                game.time--;
                broadcast();
                if(game.time<=0){
                    timeOut();
                    this.cancel();
                    return;
                }
            }
        };
        timer.scheduleAtFixedRate(
            task,
            0,      // run first occurrence immediately
            1100);  // run every second
    }

    public void handleRequest(WebSocket conn, String request) {
        JsonParser jp = new JsonParser();
        JsonElement body = jp.parse(request);
        Gson gson = new Gson();
        Request r = gson.fromJson(body, Request.class);
        
        if(!r.action.equals("join")) game.players.get(r.index).connection = conn;
        
        switch(r.action) {
            case "set": game.NUM_ROUNDS = r.rounds; game.time = r.time; break;
            case "join": game.addPlayer(r.name, conn); break;
            case "leave": game.removePlayer(r.index); break;
            case "start": game.startGame(r.rounds); break;
            case "choose": game.setQuote(r.quote, r.index); break;
            case "vote": game.vote(r.voteIndex, r.index); break;
            case "bonus": game.awardBonus(r.voteIndex); break;
            case "next" : game.nextRound(); break;
            case "end": game.endGame(); break;
            case "reset": game.reset(); break;
        }
    }

}