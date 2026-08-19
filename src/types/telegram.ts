export interface TelegramUser {
  chatId: number;
  userId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TelegramDB {
  chatId: number;
  name: string;
}
