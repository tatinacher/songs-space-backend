const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const model = require("./data");
var ObjectId = require("mongoose").Types.ObjectId;

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

const dbRoute = "mongodb://localhost:27017/test";

mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

router.get("/last-records", (req, res) => {
  const { count } = req.body;

  model.SongChords.find()
    .sort({ date: -1 })
    .limit(count)
    .exec(function(err, data) {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data });
    });
});

router.get("/authors", (req, res) => {
  model.Authors.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get("/author/:id", (req, res) => {
  const id = req.params.id;

  model.Songs.find({ author: new ObjectId(id) }).exec(function(err, data) {
    if (err) return res.json({ success: false, error: err });
    model.Authors.findById(new ObjectId(id), (err, author) => {
      const songs = data.map(song => {
        return {
          id: song._id,
          title: song.title
        };
      });
      const result = {
        author: author.author,
        songs: songs
      };

      return res.json({ success: true, data: result });
    });
  });
});

router.get("/song/:id", (req, res) => {
  const id = req.params.id;

  model.SongChords.find({ song: new ObjectId(id) }).exec(function(err, data) {
    if (err) return res.json({ success: false, error: err });
    const songs = data.map(song => {
      return {
        id: song._id,
        title: song.title
      };
    });
    return res.json({ success: true, data: songs });
  });
});

router.get("/variation/:id", (req, res) => {
  const id = req.params.id;

  model.SongChords.findById(new ObjectId(id), (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post("/update-author", (req, res) => {
  const { id, update } = req.body;
  model.Authors.findByIdAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.delete("/delete-author", (req, res) => {
  const { id } = req.body;
  model.Authors.findByIdAndRemove(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

router.post("/add-author", (req, res) => {
  let data = new model.Authors();

  const { author, description } = req.body;
  const id = mongoose.Types.ObjectId();

  if ((!id && id !== 0) || !author) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.author = author;
  data.description = description || "";
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post("/add-song", (req, res) => {
  let song = new model.Songs();

  const { title, author, album } = req.body;
  const id = mongoose.Types.ObjectId();

  if ((!id && id !== 0) || !title || !author) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  song.id = id;
  song.title = title;
  song.author = author;
  song.album = album;

  song.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post("/add-song-variation", (req, res) => {
  let song = new model.SongChords();

  const id = mongoose.Types.ObjectId();
  const { title, lyrics, chords, fullText, songId } = req.body;
  song.id = id;
  song.title = title;
  song.lyrics = lyrics;
  song.chords = chords;
  song.fullText = fullText;
  song.song = songId;

  if (
    (!id && id !== 0) ||
    !title ||
    !lyrics ||
    !fullText ||
    !chords ||
    !songId
  ) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  router;

  song.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
