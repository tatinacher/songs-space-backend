const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorsSchema = new Schema(
  {
    id: Schema.Types.ObjectId,
    author: String,
    description: String
  },
  { collection: "authors" }
);

const SongsSchema = new Schema(
  {
    id: Schema.Types.ObjectId,
    author: { type: Schema.Types.ObjectId, ref: "Authors" },
    title: String,
    album: { type: Schema.Types.ObjectId, ref: "Album" }
  },
  { collection: "songs" }
);

const SongChordsSchema = new Schema(
  {
    id: Schema.Types.ObjectId,
    song: { type: Schema.Types.ObjectId, ref: "Song" },
    title: String,
    chords: [String],
    lyrics: [
      {
        text: String,
        chords: [
          {
            name: String,
            width: Number,
            color: String
          }
        ]
      }
    ]
  },
  { collection: "chords" }
);

const AlbumSchema = new Schema(
  {
    id: Schema.Types.ObjectId,
    title: String,
    year: String,
    info: String
  },
  { collection: "albums" }
);

const Authors = mongoose.model("Authors", AuthorsSchema);
const Songs = mongoose.model("Songs", SongsSchema);
const SongChords = mongoose.model("SongChords", SongChordsSchema);
const Album = mongoose.model("Album", AlbumSchema);

module.exports = {
  Authors: Authors,
  Songs: Songs,
  SongChords: SongChords,
  Album: Album
};
