local sqlite3 = require("lsqlite3")
local dbAdmin = require("@rakis/DbAdmin")

-- Open an in-memory database
db = sqlite3.open_memory()

-- Create a DbAdmin instance
admin = dbAdmin.new(db)

admin:exec([[
  CREATE TABLE IF NOT EXISTS leaderboard (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    isCreator BOOLEAN DEFAULT FALSE
  );
]])

Handlers.add(
    "Register-Player",
    "Register-Player",
    function(msg)
        -- Check if the player is already in the leaderboard
        local results = admin:select('SELECT id FROM leaderboard WHERE id = ?;', { msg.From })

        if #results > 0 then
            msg.reply({ Data = "You are already registered." })
            return -- Player is already in the leaderboard
        end

        table.insert(Members, msg.From)
        
        local isCreator = false
        local result = admin:exec('SELECT COUNT(*) as count FROM leaderboard;')
        if result[1].count == 0 then
            isCreator = true
        end
        admin:apply('INSERT INTO leaderboard (id, name, score, isCreator) VALUES (?, ?, ?, ?);', { msg.From, msg.Tags.DisplayName, 0, isCreator })
        msg.reply({ Data = "Successfully registered to game." })
    end
)

GameState = {
    currentRound = 1, -- Is this necessary?
    maxRounds = 8,
    activeDrawer = "",
    mode = "In-Waiting",
    answeredBy = {}
}

WordList = {
    "cat", "dog", "tree", "house", "sun", "moon", "flower", "car", "train", 
  "phone", "pizza", "balloon", "book", "computer", "mountain", "river", 
  "apple", "banana", "cupcake", "guitar", "star", "tiger", "beach", "rainbow",
  "rocket", "bird", "fish", "laptop", "pencil", "glasses", "umbrella", 
  "jungle", "bridge", "robot", "cake", "camera", "chair", "ship", "crown",
  "horse", "airplane", "castle", "snowman", "spider", "bat", "globe",
  "forest", "elephant", "dolphin", "bicycle", "violin", "butterfly"
}

Handlers.add(
    "Joined-Users",
    "Joined-Users",
    function (msg)
        local users = admin:exec("SELECT * FROM leaderboard")
        msg.reply({ Action = "Joined User Res", Data = users})
    end
)

Handlers.add(
    "Unregister-Player",
    "Unregister-Player",
    function(msg)
        -- Check if the player is already in the leaderboard
        local results = admin:select('SELECT id FROM leaderboard WHERE id = ?;', { msg.From })

        if #results == 0 then
            msg.reply({ Data = "You are not registered." })
            return -- Player is not in the leaderboard
        end

        for i, v in ipairs(Members) do
            if v == msg.From then
                table.remove(Members, i)
                break
            end
        end

        admin:apply('DELETE FROM leaderboard WHERE id = ?;', { msg.From })
        msg.reply({ Data = "Successfully unregistered from game." })
    end
)   

Handlers.add(
    "Start-Game",
    "Start-Game",
    function(msg)
     -- Create game round table
        admin:exec([[
            CREATE TABLE IF NOT EXISTS rounds (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                active_drawer TEXT NOT NULL,
                word TEXT NOT NULL,
                drawing TEXT NOT NULL,
                correct_answers TEXT NOT NULL
            );
        ]])

        -- Select a random player from the leaderboard to be the active drawer
        local results = admin:exec('SELECT id, name FROM leaderboard ORDER BY RANDOM() LIMIT 1;')
            
        local activeDrawerId = results[1].id
        local activeDrawer = results[1].name

        local randomIndex = math.random(#WordList)
        local chosenWord = words[randomIndex]
        
        GameState.mode = "Playing"
        GameState.currentTimeStamp = msg.Timestamp
        GameState.activeDrawer = activeDrawerId

        admin:apply('INSERT INTO leaderboard (active_drawer, word, drawing, correct_answers) VALUES (?, ?, ?, ?);', { activeDrawerId, chosenWord, "", "" })

        GameState.currentRound = admin:exec("SELECT id FROM rounds ORDER BY id DESC LIMIT 1;")[1].id
        
        ao.send({ Target = ao.id, Action = "Broadcast", Data = "Game-Started. Welcome to " .. GameState.currentRound})
        ao.send({ Target = ao.id, Action = "Broadcast", Data = "The active drawer is " .. activeDrawer .. " : " .. activeDrawerId .. ". Please wait while they finish drawing." })
    end
)

Handlers.add(
    "Submit Drawing",
    "Submit Drawing",
    function(msg)
        -- Submit drawing
    end
)

Handlers.add(
    "Submit-Answer",
    "Submit-Answer",
    function(msg)
        -- Submit answer

        -- Update leaderboard
    end
)

Handlers.add(
    "End-Game",
    "End-Game",
    function(msg)
        -- End game

        -- Update leaderboard
    end
)