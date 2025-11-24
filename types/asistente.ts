export interface Message {
  id: string;
  text: string;
  sender: "user" | "eva";
  timestamp: Date;
  type?: "text" | "thinking" | "success";
}
