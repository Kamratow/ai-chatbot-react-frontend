# ai-chatbot-react-frontend

Frontend part of ai chatbot created in React.
Based on the tuorial you can find here: https://www.youtube.com/playlist?list=PLOvIwkWvHysNRNjLPcHHAWXrLzRkl__kR

## How to run the app

In order to use the frontend part of the solution you will need to first setup and run custom server locally.
Link for the code of the chat-bot API server: https://github.com/Kamratow/ai-chatbot-node-backend

After you will have the server up and running you will need to provide server URL in `.env` file.
The key for the server URL should be named `VITE_CHAT_BOT_API_URL`.
Example content of `.env` file:

```
VITE_CHAT_BOT_API_URL="http://localhost:8080/api/chat-bot"
```

After setting-up all the prerequsites you can simply run the app with this command:

```
npm run dev
```
