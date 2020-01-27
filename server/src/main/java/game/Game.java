package game;

import server.*;
import org.java_websocket.WebSocket;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Random;

// import java.util.Timer;
// import java.util.TimerTask;

public class Game {
    public short numPlayers;
    public short round;
    public short NUM_ROUNDS = 3;
    public int phase = -1;
    public int time = 60;
    public int indexOfIt;
    public boolean itWins = true;
    public int[] scores;
    public int[] votes;
    public ArrayList<Player> players;
    public ArrayList<String> playerNames;

    public boolean[] bonus;
    public boolean[] submitted;
    public String[][] allQuotes;
    public boolean[] usedQuotes;
    public String[][] quoteChoices;
    public String[] quote;
    public String[][] submittedQuotes;
    
    public boolean end;
    public boolean results;




//game phases: pre-game = -1, choosing quote = 0, writing = 1, voting = 2

    WebsocketServer wss;

    public Game(){ //test constructor
        this.numPlayers=0;
        this.players = new ArrayList<Player>();
        this.playerNames = new ArrayList<String>();
    }
    public Game(WebsocketServer wss) {
        readFile("sourceQuotes.txt");
        this.numPlayers=0;
        this.players = new ArrayList<Player>();
        this.playerNames = new ArrayList<String>();
        this.wss = wss;
        System.out.println("New Game on " + wss.getPort() + "!");
    }
    public void broadcast(){
        wss.broadcast();
    }
    public void readFile(String filename) {        
        try {
            BufferedReader bufferedReader = new BufferedReader(
                    new InputStreamReader(getClass().getClassLoader().getResourceAsStream(filename),
                            Charset.defaultCharset()));
            int numQuotes = Integer.parseInt(bufferedReader.readLine());
            allQuotes = new String[numQuotes][4];
            for (int i = 0; i < numQuotes; i++) {
                for(int j = 0; j<3; j++) {
                    allQuotes[i][j] = bufferedReader.readLine();
                }
                allQuotes[i][3]="-1";
            }
            usedQuotes = new boolean[allQuotes.length];
        } catch (Exception e) {
            System.out.println(e.getStackTrace());
        }
        System.out.println("Read in quotes:");
        for(String[] q : allQuotes) {
            System.out.println(Arrays.toString(q));
        }
    }
    
    public boolean allSubmitted(){
        for(int i = 0; i<this.submitted.length; i++) {
            if(i==this.indexOfIt) continue;
            if(!this.submitted[i]) return false;
        }
        return true;
    }
    public void addPlayer(String name, WebSocket conn){
        if(this.playerNames.contains(name) && this.players.get(this.playerNames.indexOf(name)).address.equals(conn.getRemoteSocketAddress().getAddress().getHostAddress())) {
            System.out.println("Welcome back...");
            this.players.get(this.playerNames.indexOf(name)).connection = conn;
            return;
        }
		Player player = new Player(numPlayers, name, conn);
		this.numPlayers++;
        players.add(player);
        playerNames.add(name);
        System.out.println("Added " + name + " to game!");
        System.out.println(numPlayers + " current players:\n" + playerNames);
    }
    
	public void removePlayer(int index){
        players.remove(index);
        playerNames.remove(index);
        this.numPlayers--;
    }
    
    public void startGame(short rounds) {

        this.scores = new int[numPlayers];
        this.submitted = new boolean[numPlayers];
        this.indexOfIt = 0;
        this.round = 1;
        choice();
    }

    public void choice(){
        wss.timer();
        this.phase = 0;
        Random r = new Random();
        quoteChoices = new String[3][4];
        for(int i = 0; i<quoteChoices.length; i++) {
            int index = r.nextInt(allQuotes.length);
            while(usedQuotes[index]) {
                System.out.println("Can't use \"" + allQuotes[index][1]+" "+ allQuotes[index][2] + "\"");
                index = r.nextInt(allQuotes.length);
            }
            quoteChoices[i] = allQuotes[index];
            usedQuotes[index] = true;
        }
        submittedQuotes = new String[this.numPlayers][4];
        bonus = new boolean[this.numPlayers];
    }
    public void setQuote(String[] quote, int index){
        quote[3] = "" + index;
        System.out.println("Setting quote for player " + index + " to \"" + quote[1] + " " + quote[2] + "\"");
        this.submittedQuotes[index] = quote;
        this.submitted[index] = true;
        if(this.phase==0) {
            this.quote = quote;
            this.phase = 1;
            wss.timer();
        }
        if (this.allSubmitted()) {
            shuffleArray(this.submittedQuotes);
            this.submitted = new boolean[this.numPlayers];
            this.phase = 2;
            wss.timer();
        }
        votes = new int[players.size()];
        wss.broadcast();
    }
    public void awardBonus(int index) {
        this.bonus[index]=!this.bonus[index];
    }
    public void showResults() {
        this.results = true;
        broadcast();
    }

    public void vote(int voteIndex, int index) {
        submitted[index]=true;
        
        if(voteIndex==indexOfIt) {
            scores[index]+=2;
            itWins = false;
        }
        else if(voteIndex==-1); //player failed to vote in time; 
        else scores[voteIndex]+=2;
        if(voteIndex!=-1) votes[voteIndex]++;
        if(this.allSubmitted()){
            if(itWins) scores[indexOfIt]+=3;
            for(int i = 0; i<numPlayers; i++) {
                if(this.bonus[i]) this.scores[i]++;
            }
            showResults();
        }
    }
    public void nextRound(){
        this.results = false;
        this.submitted = new boolean[this.numPlayers];
        this.itWins = true;
        this.indexOfIt++;
        this.indexOfIt = this.indexOfIt % this.numPlayers;
        
        if(this.indexOfIt==0) this.round++;
        
        if(this.round>this.NUM_ROUNDS) endGame();
        else choice();
    }

    public void endGame(){
        this.end = true;      
        this.phase = 3;
        this.round = 0;
    }  

    public void reset(){
        for(int i = 0; i<this.numPlayers; i++){
            this.players.remove(0);
            this.playerNames.remove(0);
        }
        this.end = false;
        this.numPlayers = 0;
        this.scores = null;
        this.itWins = true;
        this.usedQuotes = new boolean[allQuotes.length];
        this.submitted = null;
        this.bonus = null;
        this.phase = -1;
        wss.broadcast(true);
    }
    private static void shuffleArray(String[][] array){
        int index;
        String[] temp;
        Random random = new Random();
        for (int i = array.length - 1; i > 0; i--)
        {
            index = random.nextInt(i + 1);
            temp = array[index];
            array[index] = array[i];
            array[i] = temp;
        }
    } 
}