import connectDB from "./config/db.js";
import { server } from "./utils/socket.js";

import { PORT } from "./config/utils.js";

const port = PORT || 5000;

connectDB();

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
