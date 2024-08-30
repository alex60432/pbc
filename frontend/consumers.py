import json

from channels.generic.websocket import AsyncWebsocketConsumer


class UserConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["url_route"]["kwargs"]["curname"]
        self.sameuser = f"cookie_{self.user}"
        
        # Join a group
        await self.channel_layer.group_add(self.sameuser, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the group
        await self.channel_layer.group_discard(self.sameuser, self.channel_name)

   # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to group
        await self.channel_layer.group_send(
            self.sameuser, {"type": "user.message", "message": message}
        )

    # Receive message from group
    async def user_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))
