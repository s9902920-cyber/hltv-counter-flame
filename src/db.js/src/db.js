import Database from 'better-sqlite3';

const db = new Database('hltv.db');
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  logo TEXT DEFAULT '',
  description TEXT DEFAULT '',
  vrs INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL,
  nickname TEXT NOT NULL,
  role TEXT DEFAULT 'Player',
  FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tournaments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  logo TEXT DEFAULT '',
  organizer TEXT DEFAULT '',
  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',
  prize_pool TEXT DEFAULT '',
  status TEXT DEFAULT 'upcoming',
  winner_team_id INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(winner_team_id) REFERENCES teams(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tournament_teams (
  tournament_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  PRIMARY KEY(tournament_id, team_id),
  FOREIGN KEY(tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tournament_id INTEGER,
  team1_id INTEGER NOT NULL,
  team2_id INTEGER NOT NULL,
  score1 INTEGER NOT NULL DEFAULT 0,
  score2 INTEGER NOT NULL DEFAULT 0,
  match_date TEXT DEFAULT '',
  status TEXT DEFAULT 'finished',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(tournament_id) REFERENCES tournaments(id) ON DELETE SET NULL,
  FOREIGN KEY(team1_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY(team2_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT DEFAULT '',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vrs_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL,
  old_value INTEGER NOT NULL,
  new_value INTEGER NOT NULL,
  delta INTEGER NOT NULL,
  reason TEXT DEFAULT '',
  admin TEXT DEFAULT 'admin',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS telegram_users (
  telegram_id INTEGER PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  photo_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

export default db;
