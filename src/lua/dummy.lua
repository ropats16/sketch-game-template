-- .load-blueprint apm

-- apm.update()

-- apm.install("@rakis/DbAdmin")

-- .load-blueprint chatroom

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
    isCreator BOOLEAN DEFAULT FALSE,
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
    currentRound = 1,
    maxRounds = 8,
    activeDrawer = "",
    mode = "In-Waiting",
    answeredBy = {},
    currentTimeStamp = 0
}

ChosenWord = ""
DrawerId = 1

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
    "Joined-Players",
    "Joined-Players",
    function (msg)
        local players = admin:exec("SELECT * FROM leaderboard")
        msg.reply({ Action = "Joined Player Res", Data = players})
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

        local math = require("math")

        local randomIndex = math.random(#WordList)
        local chosenWord = WordList[randomIndex]
        ChosenWord = chosenWord

        -- print(chosenWord)
        
        GameState.mode = "Drawing"
        GameState.currentTimeStamp = msg.Timestamp
        GameState.activeDrawer = activeDrawerId

        admin:apply('INSERT INTO rounds (active_drawer, word, drawing, correct_answers) VALUES (?, ?, ?, ?);', { activeDrawerId, chosenWord, "", "" })

        GameState.currentRound = admin:exec("SELECT id FROM rounds ORDER BY id DESC LIMIT 1;")[1].id
        
        -- ao.send({ Target = ao.id, Action = "Broadcast", Data = "Game-Started. "})
        ao.send({ Target = activeDrawerId, Action = "Chosen-Word", Data = chosenWord })
        ao.send({ Target = ao.id, Action = "Broadcast", Data = "Game-Started. Welcome to round " .. GameState.currentRound})
        ao.send({ Target = ao.id, Action = "Broadcast", Data = "The active drawer is " .. activeDrawer .. " : " .. activeDrawerId .. ". Please wait while they finish drawing." })
    end
)

Handlers.add(
    "Game-State",
    "Game-State",
    function (msg)
        msg.reply({ Action = "Current Game State", Data = GameState})
    end
)

Handlers.add(
    "Chosen-Word",
    "Chosen-Word",
    function(msg)
        msg.reply({ Action = "Chosen-Word", Data = ChosenWord })
    end
)

Handlers.add(
    "Submit-Drawing",
    "Submit-Drawing",
    function(msg)
        -- Submit drawing
        -- ao.send({ Target = ao.id, Data = msg.Data})
        admin:apply('UPDATE rounds SET drawing = ? WHERE id = ?;', { msg.Data, GameState.currentRound })
        GameState.mode = "Guessing"
        msg.reply({ Data = "Drawing submitted successfully." })
    end
)

Handlers.add(
    "Get-Drawing",
    "Get-Drawing",
    function(msg)
        local results = admin:select('SELECT drawing FROM rounds WHERE id = ?;', { GameState.currentRound })
        msg.reply({ Data = { results[1].drawing } })
    end
)

Handlers.add(
    "Submit-Answer",
    "Submit-Answer",
    function(msg)
        -- Submit answer
            local results = admin:select('SELECT word FROM rounds WHERE id = ?;', { GameState.currentRound })
            local correctAnswer = results[1].word
            local submittedAnswer = msg.Data

            if submittedAnswer == correctAnswer then
                -- Update correct answers
                local results = admin:select('SELECT correct_answers FROM rounds WHERE id = ?;', { GameState.currentRound })
                local correctAnswers = results[1].correct_answers
                correctAnswers = correctAnswers .. msg.From .. ", "
                admin:apply('UPDATE rounds SET correct_answers = ? WHERE id = ?;', { correctAnswers, GameState.currentRound })
                admin:apply('UPDATE leaderboard SET score = score + 10 WHERE id = ?;', { msg.From })
                msg.reply({ Data = "Correct answer!" })
            else
                msg.reply({ Data = "Incorrect answer." })
            end
        -- Update leaderboard
            
    end
)

Handlers.add(
    "Update-Round",
    "Update-Round",
    function(msg)
        if (msg.Timestamp - GameState.currentTimeStamp) < 20000 then
            msg.reply({ Action = "Spam", Data = "Round already updated"})
            return
        end

        GameState.currentRound = GameState.currentRound + 1

        if GameState.currentRound < GameState.maxRounds then
            DrawerId = DrawerId + 1

            -- Find the next player in the leaderboard
            local results = admin:exec('SELECT id, name FROM leaderboard')

            local drawer = results[DrawerId]

            if not drawer then
                DrawerId = 1
                drawer = results[DrawerId]
            end

            local activeDrawerId = results[1].id
            local activeDrawer = results[1].name

            local math = require("math")

            local randomIndex = math.random(#WordList)
            local chosenWord = WordList[randomIndex]

            if chosenWord ~= ChosenWord then
                ChosenWord = chosenWord
            else
                chosenWord = WordList[randomIndex + 1]
                ChosenWord = chosenWord
            end

        -- print (activeDrawer)
            -- print(ChosenWord)
            
            GameState.mode = "Drawing"
            GameState.currentTimeStamp = msg.Timestamp
            GameState.activeDrawer = activeDrawerId

            admin:apply('INSERT INTO rounds (active_drawer, word, drawing, correct_answers) VALUES (?, ?, ?, ?);', { activeDrawerId, chosenWord, "", "" })
            
            -- ao.send({ Target = ao.id, Action = "Broadcast", Data = "Game-Started. "})
            ao.send({ Target = activeDrawerId, Action = "Chosen-Word", Data = chosenWord })
            ao.send({ Target = ao.id, Action = "Broadcast", Data = "Round-Started. Welcome to round " .. GameState.currentRound})
            ao.send({ Target = ao.id, Action = "Broadcast", Data = "The active drawer is " .. activeDrawer .. " : " .. activeDrawerId .. ". Please wait while they finish drawing." })
        else 
            GameState.mode = "Completed"
            ao.send({ Target = ao.id, Action = "Broadcast", Data = "Game Over!" }) 
        end
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