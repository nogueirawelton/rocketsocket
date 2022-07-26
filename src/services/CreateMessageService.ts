import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";

interface ICreateMessageDTO {
  to: string;
  text: string;
  roomId: string;
}

@injectable()
export class CreateMessageService {
  async execute({ to, text, roomId }: ICreateMessageDTO) {
    const message = await Message.create({
      to,
      text,
      roomId
    });
    return message;
  }
}