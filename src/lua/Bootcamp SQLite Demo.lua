.load-blueprint apm

apm.update()

apm.install("@rakis/DbAdmin")

local sqlite3 = require("lsqlite3")
local dbAdmin = require("@rakis/DbAdmin")

-- Open an in-memory database
db = sqlite3.open_memory()

-- Create a DbAdmin instance
admin = dbAdmin.new(db)

admin:exec[[
  CREATE TABLE leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    profile_image TEXT
  );
]]

admin:apply('INSERT INTO leaderboard (name, score, profile_image) VALUES (?, ?, ?);', { "Alice", 10, "image_url_1" })
admin:apply('INSERT INTO leaderboard (name, score, profile_image) VALUES (?, ?, ?);', { "Bob", 15, "image_url_2" })

print(admin:select('SELECT * FROM leaderboard WHERE name = ?;', { "Alice" }))

admin:apply('UPDATE leaderboard SET score = ? WHERE name = ?;', { 20, "Alice" })

print(admin:select('SELECT * FROM leaderboard WHERE name = ?;', { "Alice" }))