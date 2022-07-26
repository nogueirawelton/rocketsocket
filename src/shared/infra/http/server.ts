import { server } from "./app";
import "../websocket/ChatService";

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT} !`);
});