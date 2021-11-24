const express = require("express");
const mongoose = require("mongoose");
const chalk = require("chalk");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const routes = require("./routes");
// require("./services/passport");

const { database } = require("./config/keys");
const app = express();
const user = require("./routes/api/Auth.route");

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
var corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://app.archshelf.com",
    "https://archshelf.com",
    "https://arch-shelf-frontend.vercel.app",
    "https://arch-shelf-front.web.app",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(morgan("combined"));
app.use("/user", user);
app.use(routes);

// app.use(passport.initialize());
// app.use(passport.session());
// app.get('/', function (req, res) {
//   res.send('GET request to the homepage')
// })

// Connect to MongoDB
mongoose.set("useCreateIndex", true);
mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() =>
    console.log(`${chalk.green("✓")} ${chalk.blue("MongoDB Connected!")}`)
  )
  .then(() => {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `${chalk.green("✓")} ${chalk.blue(
          "Server Started on port"
        )} ${chalk.bgMagenta(PORT)}`
      );
    });
  })
  .catch((err) => console.log(err));
